
import React from 'react';
import { motion } from 'framer-motion';
import { Database, Bot, Workflow, MessagesSquare, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const TaxAgentNeo4jBlog = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="space-y-3">
          <h1 className="text-4xl font-display font-bold tracking-tight">
            Building a Tax Agent with Neo4j Graph Database Integration
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A comprehensive guide to creating an intelligent Tax Agent that leverages Neo4j graph database
            for answering tax-related queries.
          </p>
          <div className="flex gap-2 pt-2">
            <Badge variant="outline">Neo4j</Badge>
            <Badge variant="outline">Graph Database</Badge>
            <Badge variant="outline">LangChain</Badge>
            <Badge variant="outline">OpenAI</Badge>
            <Badge variant="outline">Tax Assistant</Badge>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="flex items-center gap-2 text-2xl font-semibold mt-10 mb-6">
            <Database className="h-6 w-6 text-primary" />
            Introduction to the Tax Agent System
          </h2>
          
          <p>
            The Form 990 Filing Assistant is a specialized AI-powered agent designed to help users navigate 
            the complexities of Form 990 filing requirements. At its core, the agent uses a Neo4j graph database 
            to store and query tax-related information, combined with LangChain and OpenAI to process natural 
            language queries and generate informative responses.
          </p>
          
          <p>
            This blog post provides a detailed breakdown of the code implementation for this Tax Agent, 
            including connecting to Neo4j, creating vector indices, writing Cypher queries, and 
            integrating these components into a cohesive agent system.
          </p>
          
          <h2 className="flex items-center gap-2 text-2xl font-semibold mt-10 mb-6">
            <Database className="h-6 w-6 text-primary" />
            Connecting to the Neo4j Graph Database
          </h2>
          
          <p>
            The first step in building our Tax Agent is to establish a connection to the Neo4j graph database.
            This connection allows us to store, retrieve, and query tax-related information efficiently.
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto my-6">
            <pre className="text-sm">
{`import { Neo4jGraphDB } from "langchain/graphs/neo4j_graph";

// Neo4j connection setup
const neo4jGraph = new Neo4jGraphDB({
  url: process.env.NEO4J_URI || "bolt://localhost:7687",
  username: process.env.NEO4J_USERNAME || "neo4j",
  password: process.env.NEO4J_PASSWORD || "password",
  database: "neo4j",
});`}
            </pre>
          </div>
          
          <p>
            Here, we're using LangChain's Neo4jGraphDB class to establish a connection to our Neo4j database. 
            The connection details (URL, username, password) can be configured via environment variables or 
            default to the provided values for local development. This connection instance will be used 
            throughout our application to interact with the graph database.
          </p>
          
          <h2 className="flex items-center gap-2 text-2xl font-semibold mt-10 mb-6">
            <Bot className="h-6 w-6 text-primary" />
            Setting Up Vector Indexing for Neo4j
          </h2>
          
          <p>
            Vector indexing enables efficient similarity searches within our graph database. For our Tax Agent, 
            this is crucial for retrieving relevant tax information based on natural language queries.
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto my-6">
            <pre className="text-sm">
{`import { Neo4jVectorStore } from "langchain/vectorstores/neo4j_vector";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

// Vector store setup for Neo4j
const vectorStore = new Neo4jVectorStore(
  new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
  {
    url: process.env.NEO4J_URI || "bolt://localhost:7687",
    username: process.env.NEO4J_USERNAME || "neo4j",
    password: process.env.NEO4J_PASSWORD || "password",
    indexName: "tax_documents_vector_index",
    keywordIndexName: "tax_documents_keyword_index",
    searchType: "hybrid",
    nodeLabel: "TaxDocument",
    textNodeProperties: ["content", "title"],
    embeddingNodeProperty: "embedding",
  }
);`}
            </pre>
          </div>
          
          <p>
            In this code snippet, we're setting up a vector store using Neo4jVectorStore from LangChain. We're using 
            OpenAI's embedding model to convert text into vector representations. The configuration includes:
          </p>
          
          <ul>
            <li><strong>indexName</strong>: Name of the vector index in Neo4j ("tax_documents_vector_index")</li>
            <li><strong>keywordIndexName</strong>: Name of the keyword index ("tax_documents_keyword_index")</li>
            <li><strong>searchType</strong>: Set to "hybrid" to enable both vector similarity and keyword matching</li>
            <li><strong>nodeLabel</strong>: The label for nodes in the graph ("TaxDocument")</li>
            <li><strong>textNodeProperties</strong>: Node properties that contain text to be vectorized</li>
            <li><strong>embeddingNodeProperty</strong>: Property to store vector embeddings</li>
          </ul>
          
          <h2 className="flex items-center gap-2 text-2xl font-semibold mt-10 mb-6">
            <Workflow className="h-6 w-6 text-primary" />
            Creating the Cypher Query Template
          </h2>
          
          <p>
            Cypher is Neo4j's query language. For our Tax Agent, we create a template that helps convert natural language 
            questions into structured Cypher queries that can be executed against the graph database.
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto my-6">
            <pre className="text-sm">
{`import { PromptTemplate } from "langchain/prompts";
import { GraphCypherQAChain } from "langchain/chains/graph_qa/cypher";
import { ChatOpenAI } from "langchain/chat_models/openai";

// Cypher generation prompt
const cypherPrompt = PromptTemplate.fromTemplate(
  \`You are an expert Neo4j Cypher translator who converts questions about tax data into Cypher queries.
  
  Graph schema:
  - Nodes with label TaxOrganization have properties: name, type, ein, fiscalYear, revenueTotal, expensesTotal, assetsTotal
  - Nodes with label TaxForm have properties: formType, filingStatus, submissionDate, period
  - Relationships: (TaxOrganization)-[:FILED]->(TaxForm)
  - Relationships: (TaxOrganization)-[:REPORTS]->(FinancialData)
  - Nodes with label FinancialData have properties: category, amount, year, quarter
  - Relationships: (TaxForm)-[:CONTAINS]->(ScheduleItem)
  - Nodes with label ScheduleItem have properties: schedule, part, line, description, amount
  
  Remember to use appropriate pattern matching and filtering. Return only the Cypher query without explanation.
  
  Question: {question}
  
  Cypher query:\`
);`}
            </pre>
          </div>
          
          <p>
            This PromptTemplate provides a structured way to generate Cypher queries from natural language questions. 
            The template includes:
          </p>
          
          <ul>
            <li>An overview of the expert role the model should adopt</li>
            <li>Detailed information about the graph schema (nodes, relationships, properties)</li>
            <li>Instructions for generating appropriate Cypher queries</li>
            <li>A placeholder for the user's question</li>
          </ul>
          
          <h2 className="flex items-center gap-2 text-2xl font-semibold mt-10 mb-6">
            <MessagesSquare className="h-6 w-6 text-primary" />
            Converting User Prompts to Cypher Queries
          </h2>
          
          <p>
            With the prompt template in place, we can now implement the conversion from natural language questions 
            to executable Cypher queries.
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto my-6">
            <pre className="text-sm">
{`// OpenAI model setup
const llm = new ChatOpenAI({
  modelName: "gpt-4", // Using GPT-4 for better Cypher generation
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Creating the GraphCypherQAChain
const cypherChain = GraphCypherQAChain.fromLLM({
  llm: llm,
  graph: neo4jGraph,
  cypherPrompt: cypherPrompt,
  returnDirect: false, // Set to true to return the direct result from Neo4j
  returnIntermediateSteps: true, // Set to true to return the generated Cypher query
});`}
            </pre>
          </div>
          
          <p>
            In this section, we:
          </p>
          
          <ol>
            <li>Initialize a ChatOpenAI model instance with GPT-4 (configured for precise output with temperature=0)</li>
            <li>Create a GraphCypherQAChain that combines the language model, our Neo4j graph connection, and the Cypher prompt template</li>
            <li>Configure the chain to return both the final answer and the intermediate steps (including the generated Cypher query)</li>
          </ol>
          
          <h2 className="flex items-center gap-2 text-2xl font-semibold mt-10 mb-6">
            <Sparkles className="h-6 w-6 text-primary" />
            Integrating Tools into the Tax Agent
          </h2>
          
          <p>
            Now we need to package our database querying capability as a tool that can be used by the agent.
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto my-6">
            <pre className="text-sm">
{`import { AgentExecutor } from "langchain/agents";
import { Tool } from "langchain/agents";
import { AgentType, initialize_agent } from "langchain/agents";

// Creating tools for the agent
const tools = [
  new Tool({
    name: "GraphSearch",
    description: \`Useful for questions related to tax mostly analytical data querying.
    Always have complete questions as input.\`,
    func: async (input) => {
      try {
        const result = await cypherChain.call({ question: input });
        console.log("Cypher Query:", result.intermediateSteps.cypher);
        return result.text;
      } catch (error) {
        console.error("Error querying graph database:", error);
        return "I encountered an error when searching the tax database. Please try rephrasing your question.";
      }
    },
  }),
];`}
            </pre>
          </div>
          
          <p>
            This code creates a tool called "GraphSearch" that will be used by our agent. The tool:
          </p>
          
          <ul>
            <li>Takes a natural language question as input</li>
            <li>Passes the question to our cypherChain, which converts it to a Cypher query and executes it against Neo4j</li>
            <li>Logs the generated Cypher query for debugging purposes</li>
            <li>Returns the text result from the database query</li>
            <li>Includes error handling to provide a friendly message if the query fails</li>
          </ul>
          
          <h2 className="flex items-center gap-2 text-2xl font-semibold mt-10 mb-6">
            <Bot className="h-6 w-6 text-primary" />
            Creating and Initializing the Tax Agent
          </h2>
          
          <p>
            Finally, we initialize the agent with the tools we've created. This agent will use OpenAI's function calling 
            capability to determine when to use the GraphSearch tool.
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto my-6">
            <pre className="text-sm">
{`// Initialize the agent with tools
const TaxAgent = initialize_agent(
  tools,
  new ChatOpenAI({ temperature: 0, modelName: "gpt-4" }),
  {
    agentType: AgentType.OPENAI_FUNCTIONS,
    verbose: true, // Set to true for detailed logging
  }
);

// Example of using the agent
const runAgent = async (query) => {
  try {
    console.log("Processing query:", query);
    const result = await TaxAgent.invoke({ input: query });
    console.log("Agent response:", result);
    return result.output;
  } catch (error) {
    console.error("Error running Tax Agent:", error);
    return "I encountered an error processing your query. Please try again.";
  }
};`}
            </pre>
          </div>
          
          <p>
            In this final section, we:
          </p>
          
          <ol>
            <li>Initialize the agent using LangChain's initialize_agent function</li>
            <li>Configure it to use OpenAI's function calling capability with AgentType.OPENAI_FUNCTIONS</li>
            <li>Enable verbose mode for detailed logging of the agent's thought process</li>
            <li>Create a helper function (runAgent) to invoke the agent with a user query</li>
            <li>Include proper error handling to ensure a graceful user experience</li>
          </ol>
          
          <p>
            Our Tax Agent implementation is now complete. When a user asks a question, the agent will:
          </p>
          
          <ol>
            <li>Analyze the question to determine if the GraphSearch tool is needed</li>
            <li>If so, it will pass the question to the tool, which will convert it to a Cypher query</li>
            <li>Execute the Cypher query against the Neo4j database</li>
            <li>Process the results and formulate a natural language response for the user</li>
          </ol>
        </div>
        
        <Separator className="my-10" />
        
        <h2 className="text-2xl font-semibold">Implementation in the UI</h2>
        <p className="text-muted-foreground mb-6">
          Here's how the agent is implemented in our Form 990 Filing Assistant UI:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agent Implementation</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <pre className="whitespace-pre-wrap bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto text-xs">
{`from langchain.agents import initialize_agent, Tool
from langchain.agents import AgentType

tools = [
    Tool(
        name="GraphSearch",
        func=cypher_chain.run,
        description="""Useful for questions related to tax mostly analytical data querying,
        Always have complete questions as input.
        """,
    ),
]

TaxAgent = initialize_agent(
    tools,
    ChatOpenAI(temperature=0, model_name='gpt-4'),
    agent=AgentType.OPENAI_FUNCTIONS, 
    verbose=True
)`}
              </pre>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Client-Side Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto text-xs">
{`const handleTaxAgentQuery = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!input.trim()) {
    toast.error('Please enter a query');
    return;
  }
  
  if (!isApiKeySet) {
    toast.error('Please set your OpenAI API key first');
    return;
  }
  
  const userMessage: Message = {
    content: input,
    role: 'user',
    timestamp: new Date()
  };
  
  setMessages(prev => [...prev, userMessage]);
  setInput('');
  setIsLoading(true);
  
  try {
    // In production, this would make an API call to the backend
    // where the TaxAgent is running
    // For demo purposes, we simulate the steps
    
    const simulatedSteps = [
      "I need to answer a question about tax data.",
      "I'll use the GraphSearch tool to query the Neo4j database.",
      \`Executing Cypher query to find information related to: "\${userMessage.content}"\`,
      "Processing results and formulating a response..."
    ];
    
    for (const step of simulatedSteps) {
      console.log(step);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const simulatedResponse = \`Based on the tax data in our graph database, I found that \${userMessage.content.includes('organization') ? 'organizations' : 'taxpayers'} in this category typically report an average of 15% higher deductions compared to the national average. The data shows significant regional variations, with California, New York, and Texas showing the highest volumes of such transactions.\`;
    
    const assistantMessage: Message = {
      content: simulatedResponse,
      role: 'assistant',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
  } catch (error) {
    console.error('Error processing query:', error);
    toast.error('Failed to process your query. Please try again.');
  } finally {
    setIsLoading(false);
  }
};`}
              </pre>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">Conclusion</h2>
          <p className="text-lg">
            By integrating Neo4j's graph database capabilities with the power of large language models, we've created 
            a specialized Tax Agent that can understand and answer complex questions about Form 990 filings and tax data.
            This approach allows for more nuanced and accurate responses by leveraging the structured relationships within 
            the tax domain.
          </p>
          <p className="text-lg">
            The agent's architecture is modular and can be adapted to other domains by replacing the graph schema and 
            prompt templates with domain-specific knowledge.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TaxAgentNeo4jBlog;
