import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Database, Send, Code, Terminal, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  
  const credentialsForm = useForm<Neo4jCredentials>({
    defaultValues: {
      url: '',
      username: '',
      password: '',
    },
  });

  // Simplified database schema for UI representation
  const databaseSchema = `
Node labels: 
- __Entity__ (Properties: name, entity, zipcode, embedding)

Relationship types:
- HAS_RELATIONSHIP_WITH
- FILED_IN
- BELONGS_TO
`;

  const handleCredentialsSubmit = (values: Neo4jCredentials) => {
    if (!values.url || !values.username || !values.password) {
      toast.error('Please fill in all Neo4j credentials');
      return;
    }
    
    setIsLoading(true);
    setExecutionSteps([
      "Connecting to Neo4j database...",
      "Establishing connection to Neo4j graph database",
      "Creating Neo4jGraph instance and refreshing schema"
    ]);
    
    // Simulate connection to Neo4j
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
      setExecutionSteps(prev => [...prev, "Connection established successfully"]);
      toast.success('Connected to Neo4j database successfully');
    }, 1500);
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
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
      // In a production environment, this would call your API that uses GraphCypherQAChain
      setTimeout(() => {
        // Simulate steps in GraphCypherQAChain execution
        setExecutionSteps(prev => [...prev, "Generating Cypher query from natural language..."]);
        
        // Generate a sample Cypher query based on the question
        const sampleCypherQuery = `MATCH (e:__Entity__)
WHERE e.name CONTAINS "${query}" OR e.entity CONTAINS "${query}" OR e.zipcode CONTAINS "${query}"
RETURN e.name, e.entity, e.zipcode
LIMIT 5`;
        
        setCypherQuery(sampleCypherQuery);
        setExecutionSteps(prev => [...prev, "Executing Cypher query against Neo4j database..."]);
        
        setTimeout(() => {
          setExecutionSteps(prev => [...prev, "Processing results through CYPHER_QA_PROMPT..."]);
          
          // Simulate a response from the GraphCypherQAChain
          const mockResponse = {
            result: `Based on the query "${query}", I found the following information in the graph database:

Entities matching your criteria include tax-exempt organizations located in the specified area with related fiscal information. The vector search using the 'incometax' index has retrieved the most relevant nodes based on their name, entity type, and zipcode properties as configured in the Neo4j database.`
          };
          
          setTimeout(() => {
            setExecutionSteps(prev => [...prev, "Query completed successfully"]);
            
            setResult(mockResponse.result);
            setIsLoading(false);
            toast.success('Query executed successfully');
          }, 800);
        }, 1200);
      }, 1000);
    } catch (error) {
      console.error('Error executing query:', error);
      toast.error('Failed to execute query. Please try again.');
      setResult('An error occurred while processing your query.');
      setExecutionSteps(prev => [...prev, "Error: Failed to complete query execution"]);
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    credentialsForm.reset();
    setCypherQuery(null);
    setResult(null);
    setExecutionSteps([]);
    toast.success('Disconnected from Neo4j database');
  };

  const codeBlocks = {
    vectorIndex: `
from langchain.vectorstores.neo4j_vector import Neo4jVector
from langchain.embeddings.openai import OpenAIEmbeddings

vector_index = Neo4jVector.from_existing_graph(
    OpenAIEmbeddings(),
    url=url,
    username=username,
    password=password,
    index_name='incometax',
    node_label="__Entity__",
    text_node_properties=['name', 'entity', 'zipcode'],
    embedding_node_property='embedding',
)`,
    promptTemplates: `
from langchain.prompts import PromptTemplate

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

CYPHER_GENERATION_PROMPT = PromptTemplate(
    input_variables=["schema", "question"], template=CYPHER_GENERATION_TEMPLATE
)

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
                  </form>
                </Form>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Connected to Neo4j database ({credentialsForm.getValues().url})</span>
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
                <strong>Note:</strong> This interface demonstrates how the backend would use LangChain with Neo4j. 
                In a production environment, it would connect to a real Neo4j database using GraphCypherQAChain.
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
