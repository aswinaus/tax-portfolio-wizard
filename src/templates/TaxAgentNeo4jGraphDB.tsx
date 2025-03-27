
import React from 'react';
import { motion } from 'framer-motion';
import { Database, Bot, Workflow, MessagesSquare, Sparkles, Code, Search, FileCode } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const TaxAgentNeo4jGraphDB = () => {
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
            Building a Tax Agent with Neo4J GraphDB Integration
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A comprehensive guide to creating an intelligent Tax Agent that leverages Neo4J graph database
            for answering tax-related queries.
          </p>
          <div className="flex gap-2 pt-2">
            <Badge variant="outline">Neo4J</Badge>
            <Badge variant="outline">GraphDB</Badge>
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
            the complexities of Form 990 filing requirements. At its core, the agent uses a Neo4J graph database 
            to store and query tax-related information, combined with LangChain and OpenAI to process natural 
            language queries and generate informative responses.
          </p>
          
          <p>
            This blog post provides a detailed breakdown of the code implementation for this Tax Agent, 
            including connecting to Neo4J, creating vector indices, writing Cypher queries, and 
            integrating these components into a cohesive agent system.
          </p>
          
          <h2 className="flex items-center gap-2 text-2xl font-semibold mt-10 mb-6">
            <Database className="h-6 w-6 text-primary" />
            Step 1: Connecting to the Neo4J GraphDB
          </h2>
          
          <p>
            The first step in building our Tax Agent is to establish a connection to the Neo4J graph database.
            This connection allows us to store, retrieve, and query tax-related information efficiently.
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto my-6">
            <pre className="text-sm">
{`import { Neo4jGraphDB } from "langchain/graphs/neo4j_graph";

# Neo4j connection setup
const neo4jGraph = new Neo4jGraphDB({
  url: process.env.NEO4J_URI || "bolt://localhost:7687",
  username: process.env.NEO4J_USERNAME || "neo4j",
  password: process.env.NEO4J_PASSWORD || "password",
  database: "neo4j",
});`}
            </pre>
          </div>
          
          <p>
            Here, we're using LangChain's Neo4jGraphDB class to establish a connection to our Neo4J database. 
            The connection details (URL, username, password) can be configured via environment variables or 
            default to the provided values for local development. This connection instance will be used 
            throughout our application to interact with the graph database.
          </p>
          
          <h2 className="flex items-center gap-2 text-2xl font-semibold mt-10 mb-6">
            <Bot className="h-6 w-6 text-primary" />
            Step 2: Setting Up Vector Indexing for Neo4J
          </h2>
          
          <p>
            Vector indexing enables efficient similarity searches within our graph database. For our Tax Agent, 
            this is crucial for retrieving relevant tax information based on natural language queries.
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto my-6">
            <pre className="text-sm">
{`import { Neo4jVectorStore } from "langchain/vectorstores/neo4j_vector";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

# Vector store setup for Neo4j
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
            <li><strong>indexName</strong>: Name of the vector index in Neo4J ("tax_documents_vector_index")</li>
            <li><strong>keywordIndexName</strong>: Name of the keyword index ("tax_documents_keyword_index")</li>
            <li><strong>searchType</strong>: Set to "hybrid" to enable both vector similarity and keyword matching</li>
            <li><strong>nodeLabel</strong>: The label for nodes in the graph ("TaxDocument")</li>
            <li><strong>textNodeProperties</strong>: Node properties that contain text to be vectorized</li>
            <li><strong>embeddingNodeProperty</strong>: Property to store vector embeddings</li>
          </ul>
          
          <h2 className="flex items-center gap-2 text-2xl font-semibold mt-10 mb-6">
            <Code className="h-6 w-6 text-primary" />
            Step 3: Setting Up the Vector Store Retriever
          </h2>
          
          <p>
            After setting up the vector store, we need to create a retriever that can search for relevant documents based on queries.
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto my-6">
            <pre className="text-sm">
{`# Create a retriever from the vector store
const retriever = vectorStore.asRetriever({
  k: 5, # Number of documents to retrieve
  searchType: "hybrid", # Use both vector similarity and keyword search
  scoreThreshold: 0.7, # Minimum relevance score
});

# Function to perform a search
const searchTaxDocuments = async (query) => {
  try {
    console.log("Searching for:", query);
    const results = await retriever.getRelevantDocuments(query);
    return results.map(doc => ({
      title: doc.metadata.title || "Untitled Document",
      content: doc.pageContent,
      score: doc.metadata.score || null,
    }));
  } catch (error) {
    console.error("Error searching documents:", error);
    return [];
  }
};`}
            </pre>
          </div>
          
          <p>
            The retriever configuration includes important parameters:
          </p>
          
          <ul>
            <li><strong>k</strong>: The number of most relevant documents to retrieve (5 in this case)</li>
            <li><strong>searchType</strong>: Using "hybrid" to combine vector similarity with traditional keyword search</li>
            <li><strong>scoreThreshold</strong>: Only returning documents with a relevance score of at least 0.7</li>
          </ul>
          
          <p>
            We've also created a utility function <code>searchTaxDocuments</code> that wraps the retriever's functionality
            and formats the results in a more user-friendly way.
          </p>
          
          <h2 className="flex items-center gap-2 text-2xl font-semibold mt-10 mb-6">
            <Workflow className="h-6 w-6 text-primary" />
            Step 4: Creating the Cypher Query Template
          </h2>
          
          <p>
            Cypher is Neo4J's query language. For our Tax Agent, we create a template that helps convert natural language 
            questions into structured Cypher queries that can be executed against the graph database.
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto my-6">
            <pre className="text-sm">
{`import { PromptTemplate } from "langchain/prompts";
import { GraphCypherQAChain } from "langchain/chains/graph_qa/cypher";
import { ChatOpenAI } from "langchain/chat_models/openai";

# Cypher generation prompt
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
            <Search className="h-6 w-6 text-primary" />
            Step 5: Setting Up the Retrieval-Augmented Generation (RAG) Chain
          </h2>
          
          <p>
            To enhance our Tax Agent with document retrieval capabilities, we'll set up a Retrieval-Augmented Generation (RAG) chain.
            This will allow our agent to pull relevant information from the document database before answering questions.
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto my-6">
            <pre className="text-sm">
{`import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "langchain/prompts";

# Create a prompt template for the RAG chain
const ragPrompt = ChatPromptTemplate.fromTemplate(\`
You are a tax expert assistant. Use the following retrieved documents to answer the user's question.
If you don't know the answer based on the documents, say that you don't know but provide general tax advice.

Retrieved documents:
{context}

User question: {input}
\`);

# Create a document chain that combines retrieved documents
const documentChain = await createStuffDocumentsChain({
  llm: new ChatOpenAI({ temperature: 0, modelName: "gpt-4" }),
  prompt: ragPrompt,
});

# Create the retrieval chain
const retrievalChain = await createRetrievalChain({
  retriever,
  combineDocsChain: documentChain,
});

# Function to query the RAG system
const queryRagSystem = async (question) => {
  try {
    const response = await retrievalChain.invoke({
      input: question,
    });
    return {
      answer: response.answer,
      sourceDocuments: response.context,
    };
  } catch (error) {
    console.error("Error querying RAG system:", error);
    return {
      answer: "I encountered an error processing your query. Please try again.",
      sourceDocuments: [],
    };
  }
};`}
            </pre>
          </div>
          
          <p>
            This code sets up a Retrieval-Augmented Generation (RAG) chain with these key components:
          </p>
          
          <ul>
            <li>A chat prompt template that instructs the model to use retrieved documents to answer questions</li>
            <li>A document chain that uses the "stuff" method to combine retrieved documents (putting all retrieved content into a single prompt)</li>
            <li>A retrieval chain that connects the retriever with the document chain</li>
            <li>A utility function <code>queryRagSystem</code> that invokes the chain and returns both the answer and source documents</li>
          </ul>
          
          <h2 className="flex items-center gap-2 text-2xl font-semibold mt-10 mb-6">
            <MessagesSquare className="h-6 w-6 text-primary" />
            Step 6: Converting User Prompts to Cypher Queries
          </h2>
          
          <p>
            With the prompt template in place, we can now implement the conversion from natural language questions 
            to executable Cypher queries.
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto my-6">
            <pre className="text-sm">
{`# OpenAI model setup
const llm = new ChatOpenAI({
  modelName: "gpt-4", # Using GPT-4 for better Cypher generation
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

# Creating the GraphCypherQAChain
const cypherChain = GraphCypherQAChain.fromLLM({
  llm: llm,
  graph: neo4jGraph,
  cypherPrompt: cypherPrompt,
  returnDirect: false, # Set to true to return the direct result from Neo4j
  returnIntermediateSteps: true, # Set to true to return the generated Cypher query
});`}
            </pre>
          </div>
          
          <p>
            In this section, we:
          </p>
          
          <ol>
            <li>Initialize a ChatOpenAI model instance with GPT-4 (configured for precise output with temperature=0)</li>
            <li>Create a GraphCypherQAChain that combines the language model, our Neo4J graph connection, and the Cypher prompt template</li>
            <li>Configure the chain to return both the final answer and the intermediate steps (including the generated Cypher query)</li>
          </ol>
          
          <h2 className="flex items-center gap-2 text-2xl font-semibold mt-10 mb-6">
            <Sparkles className="h-6 w-6 text-primary" />
            Step 7: Integrating Tools into the Tax Agent
          </h2>
          
          <p>
            Now we need to package our database querying capability as a tool that can be used by the agent.
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto my-6">
            <pre className="text-sm">
{`import { AgentExecutor } from "langchain/agents";
import { Tool } from "langchain/agents";
import { AgentType, initialize_agent } from "langchain/agents";

# Creating tools for the agent
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
  new Tool({
    name: "TaxDocumentSearch",
    description: \`Useful for finding information in tax documents and publications.
    Use this for questions about tax law, regulations, and procedures.\`,
    func: async (input) => {
      try {
        const result = await queryRagSystem(input);
        return result.answer;
      } catch (error) {
        console.error("Error searching tax documents:", error);
        return "I encountered an error searching tax documents. Please try rephrasing your question.";
      }
    },
  }),
];`}
            </pre>
          </div>
          
          <p>
            This code creates two complementary tools for our agent:
          </p>
          
          <ul>
            <li><strong>GraphSearch</strong>: For querying structured tax data in the Neo4J database using Cypher</li>
            <li><strong>TaxDocumentSearch</strong>: For retrieving information from unstructured tax documents using our RAG system</li>
          </ul>
          
          <p>
            Each tool includes:
          </p>
          
          <ul>
            <li>A descriptive name and usage instructions</li>
            <li>A function that processes input and returns results</li>
            <li>Error handling to provide a friendly message if queries fail</li>
          </ul>
          
          <h2 className="flex items-center gap-2 text-2xl font-semibold mt-10 mb-6">
            <Bot className="h-6 w-6 text-primary" />
            Step 8: Creating and Initializing the Tax Agent
          </h2>
          
          <p>
            Finally, we initialize the agent with the tools we've created. This agent will use OpenAI's function calling 
            capability to determine when to use the GraphSearch tool.
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto my-6">
            <pre className="text-sm">
{`# Initialize the agent with tools
const TaxAgent = initialize_agent(
  tools,
  new ChatOpenAI({ temperature: 0, modelName: "gpt-4" }),
  {
    agentType: AgentType.OPENAI_FUNCTIONS,
    verbose: true, # Set to true for detailed logging
  }
);

# Example of using the agent
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
          
          <h2 className="flex items-center gap-2 text-2xl font-semibold mt-10 mb-6">
            <FileCode className="h-6 w-6 text-primary" />
            Step 9: Python Implementation for LangChain Tools
          </h2>
          
          <p>
            Below is a complete Python implementation for creating Neo4j-powered tools using LangChain. This code demonstrates how to implement 
            similar functionality in a Python environment, which is a common choice for AI agent development.
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto my-6">
            <pre className="text-sm">
{`# Import required libraries
import os
from langchain.chat_models import ChatOpenAI
from langchain.agents import Tool, initialize_agent, AgentType
from langchain.chains import GraphCypherQAChain
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores.neo4j_vector import Neo4jVector
from langchain.graphs import Neo4jGraph
from langchain.prompts import PromptTemplate
from langchain.chains.retrieval_qa.base import RetrievalQA

# Set environment variables
os.environ["OPENAI_API_KEY"] = "your-openai-api-key"
os.environ["NEO4J_URI"] = "bolt://localhost:7687"
os.environ["NEO4J_USERNAME"] = "neo4j"
os.environ["NEO4J_PASSWORD"] = "password"

# Connect to Neo4j
graph = Neo4jGraph(
    url=os.environ["NEO4J_URI"],
    username=os.environ["NEO4J_USERNAME"],
    password=os.environ["NEO4J_PASSWORD"]
)

# Set up embeddings
embeddings = OpenAIEmbeddings()

# Create vector store for document retrieval
vector_store = Neo4jVector.from_existing_index(
    embeddings,
    url=os.environ["NEO4J_URI"],
    username=os.environ["NEO4J_USERNAME"],
    password=os.environ["NEO4J_PASSWORD"],
    index_name="tax_documents",
    node_label="Document",
    text_node_property="content",
    embedding_node_property="embedding",
)

# Create a retriever
retriever = vector_store.as_retriever(search_kwargs={"k": 5})

# Create a RetrievalQA chain for document lookup
retrieval_qa = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(temperature=0, model_name="gpt-4"),
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True
)

# Define Cypher QA prompt template
cypher_prompt = PromptTemplate.from_template(
    """You are an expert Neo4j Cypher translator who converts questions about tax data into Cypher queries.
    
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
    
    Cypher query:"""
)

# Create GraphCypherQAChain for Cypher query generation and execution
cypher_chain = GraphCypherQAChain.from_llm(
    llm=ChatOpenAI(temperature=0, model_name="gpt-4"),
    graph=graph,
    verbose=True,
    cypher_prompt=cypher_prompt,
    return_intermediate_steps=True
)

# Define tools for the agent
tools = [
    Tool(
        name="GraphDatabaseSearch",
        func=lambda q: cypher_chain({"question": q})["result"],
        description="Useful for questions about tax organizations, their filings, financial data, and specific schedule items. Use this for analytical queries that need structured data."
    ),
    Tool(
        name="DocumentSearch",
        func=lambda q: retrieval_qa({"query": q})["result"],
        description="Useful for questions about tax regulations, procedures, form instructions, and general information that would be found in tax documents."
    )
]

# Create the agent
agent = initialize_agent(
    tools,
    ChatOpenAI(temperature=0, model_name="gpt-4"),
    agent=AgentType.OPENAI_FUNCTIONS,
    verbose=True
)

# Example function to run the agent
def run_tax_agent(query):
    try:
        response = agent.run(query)
        return response
    except Exception as e:
        print(f"Error running agent: {e}")
        return "I encountered an error processing your query. Please try again."

# Example usage
if __name__ == "__main__":
    example_questions = [
        "Which organizations had the highest revenue in 2022?",
        "What is the deadline for filing Form 990?",
        "Show me organizations that reported over $1 million in assets",
        "What are the requirements for Schedule B?"
    ]
    
    for question in example_questions:
        print(f"\nQuestion: {question}")
        answer = run_tax_agent(question)
        print(f"Answer: {answer}\n" + "-"*50)
`}
            </pre>
          </div>
          
          <p>
            This Python implementation includes:
          </p>
          
          <ul>
            <li>Neo4j graph database connection setup</li>
            <li>Vector store creation for document retrieval</li>
            <li>Cypher query generation with LLM-based translation</li>
            <li>Two specialized tools for different types of queries</li>
            <li>An agent that can intelligently choose between tools based on the query</li>
            <li>Error handling and example usage with sample questions</li>
          </ul>
          
          <p>
            The Python implementation follows the same architectural pattern as the JavaScript version, 
            making it easy to port the application between different environments.
          </p>
          
          <p>
            Our Tax Agent implementation is now complete. When a user asks a question, the agent will:
          </p>
          
          <ol>
            <li>Analyze the question to determine if the GraphSearch or TaxDocumentSearch tool is needed</li>
            <li>If GraphSearch is needed, it will pass the question to the tool, which will convert it to a Cypher query</li>
            <li>Execute the Cypher query against the Neo4J database</li>
            <li>If TaxDocumentSearch is needed, it will retrieve relevant documents using vector search</li>
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
    Tool(
        name="TaxDocumentSearch",
        func=retrieval_chain.run,
        description="""Useful for finding information in tax documents and publications.
        Use this for questions about tax law, regulations, and procedures.
        """,
    )
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
    const response = await fetch('/api/tax-agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: userMessage.content,
        apiKey: openaiApiKey,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get response from the tax agent');
    }
    
    const data = await response.json();
    
    const assistantMessage: Message = {
      content: data.response,
      role: 'assistant',
      timestamp: new Date(),
      metadata: {
        usedTool: data.tool,
        cypherQuery: data.cypherQuery,
        sourceDocuments: data.sourceDocuments,
      }
    };
    
    setMessages(prev => [...prev, assistantMessage]);
  } catch (error) {
    console.error('Error processing query:', error);
    toast.error('Failed to process your query. Please try again.');
    
    const errorMessage: Message = {
      content: "I'm sorry, I encountered an error processing your query. Please try again.",
      role: 'assistant',
      timestamp: new Date(),
      isError: true
    };
    
    setMessages(prev => [...prev, errorMessage]);
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
            By integrating Neo4J's GraphDB capabilities with the power of large language models, we've created 
            a specialized Tax Agent that can understand and answer complex questions about Form 990 filings and tax data.
            This approach allows for more nuanced and accurate responses by leveraging the structured relationships within 
            the tax domain.
          </p>
          <p className="text-lg">
            The agent's architecture is modular and can be adapted to other domains by replacing the graph schema and 
            prompt templates with domain-specific knowledge. The Python implementation provides an alternative for 
            developers who prefer Python for AI development.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TaxAgentNeo4jGraphDB;
