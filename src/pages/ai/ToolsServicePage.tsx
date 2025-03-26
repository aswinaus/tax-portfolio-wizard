
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Database, Send, Code, Terminal, Info, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Neo4jCredentials = {
  url: string;
  username: string;
  password: string;
};

const ToolsServicePage = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [cypherQuery, setCypherQuery] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<string[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [useDummyResponse, setUseDummyResponse] = useState(false);
  
  const credentialsForm = useForm<Neo4jCredentials>({
    defaultValues: {
      url: 'neo4j+s://4e3ae988.databases.neo4j.io',
      username: 'neo4j',
      password: 'IW-f8cEGGxYRnVZHHpksq3j7-pkSl_cae27zXSt8eb8',
    },
  });

  const databaseSchema = `
Node labels: 
- __Entity__ (Properties: name, entity, zipcode, embedding)

Relationship types:
- HAS_RELATIONSHIP_WITH
- FILED_IN
- BELONGS_TO
`;

  useEffect(() => {
    // Auto-connect on component mount if credentials are present
    const { url, username, password } = credentialsForm.getValues();
    if (url && username && password) {
      handleCredentialsSubmit(credentialsForm.getValues());
    }
  }, []);

  const handleCredentialsSubmit = async (values: Neo4jCredentials) => {
    if (!values.url || !values.username || !values.password) {
      toast.error('Please fill in all Neo4j credentials');
      return;
    }
    
    setIsLoading(true);
    setConnectionError(null);
    setExecutionSteps([
      "Connecting to Neo4j database...",
      "Establishing connection to Neo4j graph database",
      "Creating Neo4jGraph instance and refreshing schema"
    ]);
    
    try {
      // Try to connect to the serverless function
      let connected = false;
      
      try {
        // Test connection using a simple Cypher query
        const response = await fetch('https://aswin-langchain-neo4j.netlify.app/.netlify/functions/testConnection', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: values.url,
            username: values.username,
            password: values.password,
          }),
        });
        
        if (response.ok) {
          connected = true;
          const data = await response.json();
          setExecutionSteps(prev => [...prev, "Connection established successfully"]);
        } else {
          throw new Error('Server returned an error');
        }
      } catch (error) {
        console.error('Connection error:', error);
        // Fall back to dummy mode due to CORS or network issues
        setExecutionSteps(prev => [...prev, "Could not connect to serverless function - using demo mode"]);
        setUseDummyResponse(true);
        connected = true; // We're "connected" in dummy mode
      }
      
      if (connected) {
        setIsConnected(true);
        toast.success(useDummyResponse 
          ? 'Using demo mode (serverless function unavailable)' 
          : 'Connected to Neo4j database successfully');
      } else {
        throw new Error('Failed to connect to Neo4j database');
      }
    } catch (error) {
      console.error('Connection error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setConnectionError(`${errorMessage}. The serverless function might be unavailable or there could be CORS issues.`);
      setExecutionSteps(prev => [...prev, `Error: ${errorMessage}`]);
      toast.error(`Failed to connect: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a query');
      return;
    }

    if (!isConnected) {
      toast.error('Please connect to Neo4j database first');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setCypherQuery(null);
    setExecutionSteps([
      "Initializing GraphCypherQAChain...",
      "Processing query through CYPHER_GENERATION_PROMPT...",
    ]);

    try {
      if (useDummyResponse) {
        // Use dummy data for demo mode
        await new Promise(resolve => setTimeout(resolve, 1500)); // Add a delay for realism
        
        setExecutionSteps(prev => [...prev, "Generating Cypher query from natural language..."]);
        const dummyCypher = `MATCH (e:__Entity__)
WHERE e.entity CONTAINS 'NON-PROFIT' AND e.zipcode STARTS WITH '9'
RETURN e.name, e.entity, e.zipcode
LIMIT 5`;
        
        setCypherQuery(dummyCypher);
        
        setExecutionSteps(prev => [...prev, "Executing Cypher query against Neo4j database..."]);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Add a delay for realism
        
        setExecutionSteps(prev => [...prev, "Processing results through CYPHER_QA_PROMPT..."]);
        
        setResult(`Based on the provided information, here are several non-profit organizations in California:

1. CALIFORNIA COALITION FOR RURAL HOUSING (Entity: 501(C)(3) NON-PROFIT, Zipcode: 95814)
2. CALIFORNIA STATE HORSEMENS ASSOCIATION INC (Entity: 501(C)(3) NON-PROFIT, Zipcode: 95864)
3. CALIFORNIA DENTAL ASSOCIATION (Entity: 501(C)(6) NON-PROFIT, Zipcode: 95814)
4. BETTER HOUSE FOUNDATION (Entity: 501(C)(3) NON-PROFIT, Zipcode: 91335)
5. GOLDEN STATE MANUFACTURED-HOME OWNERS LEAGUE (Entity: 501(C)(4) NON-PROFIT, Zipcode: 92806)`);
        
        setExecutionSteps(prev => [...prev, "Query completed successfully"]);
        toast.success('Query executed successfully (demo mode)');
      } else {
        // Make a real API call to our serverless function
        const { url, username, password } = credentialsForm.getValues();
        
        setExecutionSteps(prev => [...prev, "Generating Cypher query from natural language..."]);
        
        try {
          const response = await fetch('https://aswin-langchain-neo4j.netlify.app/.netlify/functions/executeQuery', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url,
              username,
              password,
              query: query,
              schema: databaseSchema
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to execute query');
          }
          
          const data = await response.json();
          
          setExecutionSteps(prev => [...prev, "Executing Cypher query against Neo4j database..."]);
          
          if (data.generatedCypher) {
            setCypherQuery(data.generatedCypher);
            setExecutionSteps(prev => [...prev, "Processing results through CYPHER_QA_PROMPT..."]);
          }
          
          if (data.result) {
            setResult(data.result);
            setExecutionSteps(prev => [...prev, "Query completed successfully"]);
            toast.success('Query executed successfully');
          } else {
            throw new Error('No results returned from the query');
          }
        } catch (error) {
          console.error('API error:', error);
          // Fall back to demo mode
          setUseDummyResponse(true);
          toast.error('Serverless function unavailable, falling back to demo mode');
          handleQuerySubmit(e); // Retry with dummy mode
          return;
        }
      }
    } catch (error) {
      console.error('Error executing query:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to execute query: ${errorMessage}`);
      setResult(`An error occurred while processing your query: ${errorMessage}`);
      setExecutionSteps(prev => [...prev, `Error: ${errorMessage}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setConnectionError(null);
    setCypherQuery(null);
    setResult(null);
    setExecutionSteps([]);
    setUseDummyResponse(false);
    toast.success('Disconnected from Neo4j database');
  };

  const codeBlocks = {
    vectorIndex: `
import os
from langchain.vectorstores.neo4j_vector import Neo4jVector
from langchain.embeddings.openai import OpenAIEmbeddings

#Initialize a Neo4jVector object and assigns it to the variable vector_index. It leverages the from_existing_graph method, indicating that it's working with an already populated Neo4j graph
vector_index = Neo4jVector.from_existing_graph(
    #This part specifies that the index will utilize OpenAI's embeddings.
    OpenAIEmbeddings(),
    #These parameters provide the connection details for the Neo4j database. url points to the database's address, while username and password are used for authentication.
    url=url,
    username=username,
    password=password,
    #This sets the name of the vector index to 'incometax'. This name will be used to refer to the index within Neo4j.
    index_name='incometax',
    #This indicates that the vector index should be built on nodes with the label "__Entity__" in the graph. In Neo4j, labels categorize nodes with similar characteristics.
    node_label="__Entity__",
    #Use the values stored in the 'name', 'entity', and 'zipcode' properties of each node to generate embeddings."
    text_node_properties=['name', 'entity', 'zipcode'],
    embedding_node_property='embedding',
)`,
    promptTemplates: `
from langchain.prompts import PromptTemplate
#This template provides clear instructions to the LLM, emphasizing that it should only use the schema provided and strictly focus on generating a Cypher query.
#Placeholders below
#{schema}: This will be replaced with the actual schema of the database.
#{question}: This will be replaced with the user's question.
CYPHER_GENERATION_TEMPLATE = """Task:Generate Cypher statement to query a graph database.
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

Cypher Query:
"""

#This template guides the LLM to format the answer nicely and instructs it to rely solely on the provided context (results from the Cypher query) without using its own knowledge.
#It includes placeholders: {context}: This will be replaced with the data retrieved from the database.
#{question}: This will be replaced with the original user question.
CYPHER_QA_TEMPLATE = """You are an AI assistant that helps to form nice and human understandable answers.
The information part contains the provided information that you must use to construct an answer.
The provided information is authoritative, you must never doubt it or try to use your internal knowledge to correct it.
Make the answer sound as a response to the question. Do not mention that you based the result on the given information.
Here is an example:

Question: Which state has the maximum number of returns?
Context:[{{'STATE': 'CA'}}, {{'No_of_return': '5506120'}}]
Helpful Answer: The state CA has the maximum number of returns with 5506120

Follow this example when generating answers.
If the provided information is empty, say that you don't know the answer.

Information:
{context}

Question: {question}
Helpful Answer:"""
#This prompt is designed to instruct the LLM to generate a Cypher query (Neo4j's query language) based on a user's question and a provided schema of the graph database.
#create the CYPHER_GENERATION_PROMPT object using the PromptTemplate class.
CYPHER_GENERATION_PROMPT = PromptTemplate(
    #Use the CYPHER_GENERATION_TEMPLATE as the base structure.
    input_variables=["schema", "question"], template=CYPHER_GENERATION_TEMPLATE
)
#This prompt is used to instruct the LLM to generate a human-readable answer based on the results returned from the Cypher query.
CYPHER_QA_PROMPT = PromptTemplate(
    input_variables=["context", "question"], template=CYPHER_QA_TEMPLATE
)`,
    graphChain: `
from langchain.chains import GraphCypherQAChain
from langchain.graphs import Neo4jGraph

graph = Neo4jGraph(
    url=url,
    username=username,
    password=password,
    enhanced_schema=True
)
#refresh the schema to latest
graph.refresh_schema()

cypher_chain = GraphCypherQAChain.from_llm(
    cypher_llm = ChatOpenAI(temperature=0, model_name='gpt-4'),
    qa_llm = ChatOpenAI(temperature=0),
    graph=graph,
    verbose=True,
    qa_prompt=CYPHER_QA_PROMPT,
    cypher_prompt=CYPHER_GENERATION_PROMPT
)`
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold tracking-tight mb-2">
            Neo4j Graph Database QA Tool
          </h1>
          <p className="text-muted-foreground">
            Ask questions about your graph data using natural language
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Neo4j Graph Database QA
              </CardTitle>
              <CardDescription>
                This tool uses GraphCypherQAChain with the 'incometax' vector index on '__Entity__' nodes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Ask questions about your graph data and get natural language responses using LangChain and Neo4j.
              </p>
              
              {!isConnected ? (
                <Form {...credentialsForm}>
                  <form onSubmit={credentialsForm.handleSubmit(handleCredentialsSubmit)} className="space-y-4 p-4 border rounded-md">
                    <h3 className="font-semibold">Connect to Neo4j Database</h3>
                    
                    <Alert variant="warning" className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Backend Connection Notice</AlertTitle>
                      <AlertDescription>
                        This demo attempts to connect to a serverless function at aswin-langchain-neo4j.netlify.app.
                        If connection fails, it will fall back to demo mode.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid gap-4">
                      <FormField
                        control={credentialsForm.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Neo4j URL</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g., bolt://localhost:7687"
                                disabled={isLoading}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          control={credentialsForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="neo4j"
                                  disabled={isLoading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={credentialsForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="password"
                                  placeholder="Your password"
                                  disabled={isLoading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Database className="h-4 w-4 mr-2" />
                            Connect
                          </>
                        )}
                      </Button>
                    </div>

                    {connectionError && (
                      <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
                        <p className="font-medium">Connection Error:</p>
                        <p>{connectionError}</p>
                      </div>
                    )}
                  </form>
                </Form>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">
                        {useDummyResponse 
                          ? "Using demo mode (serverless function unavailable)" 
                          : `Connected to Neo4j database (${credentialsForm.getValues().url})`}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleDisconnect}>
                      Disconnect
                    </Button>
                  </div>
                  
                  <form onSubmit={handleQuerySubmit} className="mt-4">
                    <div className="flex flex-col space-y-4">
                      <div>
                        <label htmlFor="query" className="block text-sm font-medium mb-1">
                          Ask a question about your graph data
                        </label>
                        <div className="flex gap-2">
                          <Input
                            id="query"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g., Show me non-profit organizations in California"
                            className="flex-grow"
                            disabled={isLoading}
                          />
                          <Button type="submit" disabled={isLoading || !query.trim()}>
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Send className="h-4 w-4 mr-2" />
                            )}
                            Query
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </>
              )}

              {isLoading && executionSteps.length > 0 && (
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Execution Progress
                  </h3>
                  <div className="space-y-2">
                    {executionSteps.map((step, index) => (
                      <div 
                        key={index} 
                        className="flex items-center"
                      >
                        {index === executionSteps.length - 1 && isLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-2 text-primary" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        )}
                        <p className="text-sm">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cypherQuery && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      Generated Cypher Query
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(cypherQuery);
                        toast.success('Cypher query copied to clipboard');
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <pre className="whitespace-pre-wrap text-sm p-2 bg-slate-100 dark:bg-slate-800 rounded overflow-x-auto">
                    {cypherQuery}
                  </pre>
                </motion.div>
              )}

              {result && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 p-4 bg-muted rounded-md"
                >
                  <h3 className="font-medium mb-2 flex items-center">
                    <Terminal className="h-4 w-4 mr-2" />
                    Results
                  </h3>
                  <div className="whitespace-pre-wrap text-sm">{result}</div>
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> This tool {useDummyResponse ? 'is running in demo mode with sample data.' : 'uses serverless functions to connect to your Neo4j database.'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Serverless function endpoint: https://aswin-langchain-neo4j.netlify.app/.netlify/functions/
              </p>
            </CardFooter>
          </Card>

          <div className="col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Your question is processed by LangChain's CYPHER_GENERATION_PROMPT</li>
                  <li>The prompt converts your natural language into a Cypher query</li>
                  <li>GraphCypherQAChain executes the query against Neo4j</li>
                  <li>Results are formatted using CYPHER_QA_PROMPT for human readability</li>
                  <li>The system uses OpenAI embeddings and the 'incometax' vector index</li>
                </ol>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Implementation Code</CardTitle>
                <CardDescription>
                  Python code used on the backend
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="vector-index">
                    <AccordionTrigger className="text-sm">Vector Index Setup</AccordionTrigger>
                    <AccordionContent>
                      <pre className="text-xs whitespace-pre-wrap bg-slate-100 dark:bg-slate-800 p-2 rounded overflow-x-auto">
                        {codeBlocks.vectorIndex}
                      </pre>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="prompt-templates">
                    <AccordionTrigger className="text-sm">Prompt Templates</AccordionTrigger>
                    <AccordionContent>
                      <pre className="text-xs whitespace-pre-wrap bg-slate-100 dark:bg-slate-800 p-2 rounded overflow-x-auto">
                        {codeBlocks.promptTemplates}
                      </pre>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="graph-chain">
                    <AccordionTrigger className="text-sm">GraphCypherQAChain</AccordionTrigger>
                    <AccordionContent>
                      <pre className="text-xs whitespace-pre-wrap bg-slate-100 dark:bg-slate-800 p-2 rounded overflow-x-auto">
                        {codeBlocks.graphChain}
                      </pre>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="mt-4 p-2 bg-slate-100 dark:bg-slate-800 rounded">
                  <h3 className="text-sm font-semibold mb-1">Database Schema</h3>
                  <pre className="text-xs whitespace-pre-wrap">{databaseSchema}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ToolsServicePage;
