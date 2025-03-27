import OpenAI from 'openai';
import { Driver, Record as Neo4jRecord, Session } from 'neo4j-driver';

// Neo4j Vector Search utility
export interface Neo4jVectorSearchConfig {
  url: string;
  username: string;
  password: string;
  indexName: string;
  nodeLabel: string;
  textNodeProperties: string[];
  embeddingNodeProperty: string;
}

export interface QueryOptions {
  skipCache?: boolean;
  includeRawResults?: boolean;
}

export class Neo4jVectorSearch {
  private openai: OpenAI;
  private config: Neo4jVectorSearchConfig;
  private driver: Driver | null = null;
  private cypherGenerationTemplate: string;
  private cypherQATemplate: string;

  constructor(
    apiKey: string,
    config: Neo4jVectorSearchConfig
  ) {
    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Note: In production, you'd use a backend service
    });
    
    this.config = config;
    
    this.cypherGenerationTemplate = `Task: Generate Cypher statement to query a graph database.
Instructions:
Use only the provided relationship types and properties in the schema. However, always exclude the schema's \`embedding\` property from the Cypher statement.
Do not use any other relationship types or properties that are not provided.
Schema:
{schema}
Note: Do not include any explanations or apologies in your responses.
Do not respond to any questions that might ask anything else than for you to construct a Cypher statement.
Do not include any text except the generated Cypher statement.

The question is:
{question}

Cypher Query:`;

    this.cypherQATemplate = `You are an AI assistant that helps to form nice and human understandable answers.
The information part contains the provided information that you must use to construct an answer.
The provided information is authoritative, you must never doubt it or try to use your internal knowledge to correct it.
Make the answer sound as a response to the question. Do not mention that you based the result on the given information.
Here is an example:

Question: Which state has the maximum number of returns?
Context:[{"STATE": "CA"}, {"No_of_return": "5506120"}]
Helpful Answer: The state CA has the maximum number of returns with 5506120

Follow this example when generating answers.
If the provided information is empty, say that you don't know the answer.

Information:
{context}

Question: {question}
Helpful Answer:`;
  }

  async connect(neo4jDriver: Driver) {
    this.driver = neo4jDriver;
    // Test connection
    const session = this.driver.session();
    try {
      await session.run('RETURN 1');
      return true;
    } catch (error) {
      console.error('Failed to connect to Neo4j:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async getSchema(): Promise<string> {
    if (!this.driver) {
      throw new Error('Neo4j driver not initialized. Call connect() first.');
    }

    const session = this.driver.session();
    try {
      // Get node labels
      const labelsResult = await session.run(`
        CALL db.labels() YIELD label
        RETURN collect(label) AS labels
      `);
      
      const labels = labelsResult.records[0].get('labels');
      
      // Get properties for each label
      let schema = '';
      for (const label of labels) {
        const propertiesResult = await session.run(`
          MATCH (n:${label}) 
          WHERE n IS NOT NULL
          RETURN keys(n) AS properties LIMIT 1
        `);
        
        if (propertiesResult.records.length > 0) {
          const properties = propertiesResult.records[0].get('properties');
          schema += `Node label: ${label}\nProperties: ${properties.join(', ')}\n\n`;
        }
      }
      
      // Get relationship types and properties
      const relationshipsResult = await session.run(`
        CALL db.relationshipTypes() YIELD relationshipType
        RETURN collect(relationshipType) AS relationships
      `);
      
      const relationships = relationshipsResult.records[0].get('relationships');
      
      for (const relType of relationships) {
        const relPropertiesResult = await session.run(`
          MATCH ()-[r:${relType}]->() 
          WHERE r IS NOT NULL
          RETURN keys(r) AS properties LIMIT 1
        `);
        
        if (relPropertiesResult.records.length > 0) {
          const properties = relPropertiesResult.records[0].get('properties');
          schema += `Relationship type: ${relType}\nProperties: ${properties.join(', ')}\n\n`;
        }
      }
      
      return schema;
    } catch (error) {
      console.error('Error fetching schema:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async generateCypherQuery(question: string): Promise<string> {
    const schema = await this.getSchema();
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o", // Using gpt-4o instead of older gpt-4
      messages: [
        {
          role: "system",
          content: this.cypherGenerationTemplate
            .replace('{schema}', schema)
            .replace('{question}', question)
        }
      ],
      temperature: 0
    });
    
    return response.choices[0].message.content || '';
  }

  async formatResponse(question: string, cypherResults: any[]): Promise<string> {
    const context = JSON.stringify(cypherResults);
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o", // Using gpt-4o instead of older gpt-4
      messages: [
        {
          role: "system",
          content: this.cypherQATemplate
            .replace('{context}', context)
            .replace('{question}', question)
        }
      ],
      temperature: 0
    });
    
    return response.choices[0].message.content || '';
  }

  async query(question: string, options: QueryOptions = {}): Promise<{
    answer: string;
    cypher?: string;
    rawResults?: any[];
  }> {
    try {
      // Generate Cypher query from question
      const cypherQuery = await this.generateCypherQuery(question);
      
      // Execute the Cypher query
      if (!this.driver) {
        throw new Error('Neo4j driver not initialized. Call connect() first.');
      }
      
      const session: Session = this.driver.session();
      try {
        const result = await session.run(cypherQuery);
        const records = result.records.map(record => {
          const obj: Record<string, any> = {};
          for (const key of record.keys) {
            if (typeof key === 'string') {
              obj[key] = this.convertNeo4jValueToJS(record.get(key));
            }
          }
          return obj;
        });
        
        // Format the response
        const answer = await this.formatResponse(question, records);
        
        const response: {
          answer: string;
          cypher?: string;
          rawResults?: any[];
        } = { answer };
        
        if (options.includeRawResults) {
          response.cypher = cypherQuery;
          response.rawResults = records;
        }
        
        return response;
      } finally {
        await session.close();
      }
    } catch (error) {
      console.error('Error in query:', error);
      throw error;
    }
  }
  
  private convertNeo4jValueToJS(value: any): any {
    if (value === null || value === undefined) {
      return value;
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      return value.map(v => this.convertNeo4jValueToJS(v));
    }
    
    // Handle objects
    if (typeof value === 'object') {
      // Check if it's a Neo4j Integer
      if (value.low !== undefined && value.high !== undefined) {
        return value.toNumber();
      }
      
      // Handle regular objects
      const result: Record<string, any> = {};
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          result[key] = this.convertNeo4jValueToJS(value[key]);
        }
      }
      return result;
    }
    
    // Return primitives as is
    return value;
  }
}
