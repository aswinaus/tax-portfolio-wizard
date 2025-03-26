
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Database, Send, Code, Terminal, Info, AlertTriangle, RefreshCw, Globe, ExternalLink } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

type Neo4jCredentials = {
  url: string;
  username: string;
  password: string;
};

// List of reliable CORS proxies
const CORS_PROXIES = [
  { name: 'corsproxy.io', url: 'https://corsproxy.io/?' },
  { name: 'cors-anywhere', url: 'https://cors-anywhere.herokuapp.com/' },
  { name: 'all-origins', url: 'https://api.allorigins.win/raw?url=' },
  { name: 'thingproxy', url: 'https://thingproxy.freeboard.io/fetch/' },
];

const ToolsServicePage = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [cypherQuery, setCypherQuery] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<string[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [useDummyResponse, setUseDummyResponse] = useState(true); // Default to true for better UX
  const [isServerlessFunctionAvailable, setIsServerlessFunctionAvailable] = useState(false);
  const [serverlessEndpoint, setServerlessEndpoint] = useState('https://aswin-langchain-neo4j.netlify.app/.netlify/functions');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('query');
  const [useCorsProxy, setUseCorsProxy] = useState(false); // Default to false (no proxy)
  const [corsProxyUrl, setCorsProxyUrl] = useState(CORS_PROXIES[0].url);
  const [selectedProxy, setSelectedProxy] = useState(0);
  const [isAzureFunction, setIsAzureFunction] = useState(true); // Set default to Azure
  const [azureFunctionEndpoint, setAzureFunctionEndpoint] = useState('taxaiagents.azurewebsites.net');
  
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

  // Update the serverless endpoint based on service type
  const getServerlessEndpoint = () => {
    if (isAzureFunction) {
      return azureFunctionEndpoint;
    }
    return serverlessEndpoint;
  };

  // Utility function to handle CORS proxy
  const getFetchUrl = (url: string) => {
    if (!useCorsProxy) return url;
    
    // Make sure the URL is properly encoded
    try {
      // Ensure the URL is valid before encoding
      new URL(url);
      return `${corsProxyUrl}${encodeURIComponent(url)}`;
    } catch (e) {
      console.error("Invalid URL:", url, e);
      toast.error("Invalid URL format");
      return url;
    }
  };

  // Safely make fetch requests with proper error handling
  const safeFetch = async (url: string, options: RequestInit = {}) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const fetchUrl = getFetchUrl(url);
      console.log(`Fetching URL: ${fetchUrl}`);
      
      const response = await fetch(fetchUrl, {
        ...options,
        signal: controller.signal,
        mode: 'cors',
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      console.error(`Fetch error for ${url}:`, error);
      throw error;
    }
  };

  // Check if the serverless function is available
  useEffect(() => {
    const checkServerlessAvailability = async () => {
      try {
        const endpoint = isAzureFunction 
          ? `${azureFunctionEndpoint}/api/ping` 
          : `${serverlessEndpoint}/ping`;
          
        console.log(`Checking serverless function availability at: ${endpoint}`);
        console.log(`Using CORS proxy: ${useCorsProxy ? corsProxyUrl : 'No proxy'}`);
        
        setExecutionSteps(prev => [...prev, `Pinging serverless function at ${endpoint}...`]);
        
        await new Promise(r => setTimeout(r, 500)); // Small delay for UI update
        
        try {
          const response = await safeFetch(endpoint, { 
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json',
            }
          });
          
          const responseData = await response.text();
          console.log('Ping response:', response.status, responseData);
          
          setIsServerlessFunctionAvailable(response.ok);
          setDebugInfo({
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries([...response.headers]),
            data: responseData,
            usingProxy: useCorsProxy,
            proxyUrl: corsProxyUrl,
            isAzure: isAzureFunction
          });
          
          if (!response.ok) {
            console.warn('Serverless function is not available:', response.status, response.statusText);
            setExecutionSteps(prev => [...prev, `Server responded with status ${response.status}: ${response.statusText}`]);
            setUseDummyResponse(true);
          } else {
            setExecutionSteps(prev => [...prev, `Server is available! Response: ${responseData}`]);
            setUseDummyResponse(false);
          }
        } catch (error) {
          console.error('Error during fetch:', error);
          setExecutionSteps(prev => [...prev, `Connection failed: ${error instanceof Error ? error.message : String(error)}`]);
          setUseDummyResponse(true);
          throw error;
        }
      } catch (error) {
        console.error('Error checking serverless function availability:', error);
        setExecutionSteps(prev => [...prev, `Error connecting to server: ${error instanceof Error ? error.message : String(error)}`]);
        setDebugInfo({
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          usingProxy: useCorsProxy,
          proxyUrl: corsProxyUrl,
          isAzure: isAzureFunction
        });
        setIsServerlessFunctionAvailable(false);
        setUseDummyResponse(true);
      }
    };
    
    checkServerlessAvailability();
  }, [serverlessEndpoint, useCorsProxy, corsProxyUrl, isAzureFunction, azureFunctionEndpoint]);

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
    
    // Use demo mode by default for better UX since the serverless function is likely unavailable
    if (!isServerlessFunctionAvailable) {
      console.log('Serverless function is not available, using demo mode');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Add a delay for realism
      setUseDummyResponse(true);
      setIsConnected(true);
      setExecutionSteps(prev => [...prev, "Using demo mode (serverless function unavailable)"]);
      toast.info('Using demo mode with sample data (serverless function unavailable)');
      setIsLoading(false);
      return;
    }
    
    try {
      // Try to connect to the serverless function
      setExecutionSteps(prev => [...prev, "Attempting to connect to Neo4j database via serverless function..."]);
      
      const testConnectionEndpoint = isAzureFunction 
        ? `${azureFunctionEndpoint}/api/testConnection` 
        : `${serverlessEndpoint}/testConnection`;
      console.log(`Sending connection test to: ${testConnectionEndpoint}`);
      
      try {
        const response = await safeFetch(testConnectionEndpoint, {
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
          const data = await response.json();
          setExecutionSteps(prev => [...prev, "Connection established successfully"]);
          setIsConnected(true);
          toast.success('Connected to Neo4j database successfully');
          setUseDummyResponse(false);
        } else {
          const errorText = await response.text();
          console.error('Connection error response:', response.status, errorText);
          
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.error || `Server returned status ${response.status}`);
          } catch (parseError) {
            throw new Error(`Server returned status ${response.status}: ${errorText}`);
          }
        }
      } catch (error) {
        console.error('Connection error:', error);
        
        // Check if error is due to timeout or network
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        const isTimeoutOrNetworkError = 
          errorMessage.includes('timeout') || 
          errorMessage.includes('network') ||
          errorMessage.includes('fetch') ||
          error.name === 'AbortError';
        
        if (isTimeoutOrNetworkError) {
          setExecutionSteps(prev => [...prev, "Connection timeout - serverless function is unreachable"]);
          setConnectionError("Cannot reach the serverless function. This could be due to CORS restrictions or network issues. Using demo mode instead.");
          toast.info('Using demo mode with sample data due to connection issues');
          setUseDummyResponse(true);
          setIsConnected(true);
        } else {
          setExecutionSteps(prev => [...prev, `Error: ${errorMessage}`]);
          setConnectionError(`Failed to connect to Neo4j: ${errorMessage}`);
          toast.error(`Connection failed: ${errorMessage}`);
          setIsConnected(false);
        }
      }
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
          const executeQueryEndpoint = isAzureFunction 
            ? `${azureFunctionEndpoint}/api/executeQuery` 
            : `${serverlessEndpoint}/executeQuery`;
          console.log(`Executing query at: ${executeQueryEndpoint}`);
          
          const response = await safeFetch(executeQueryEndpoint, {
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
            const errorText = await response.text();
            console.error('Query error response:', response.status, errorText);
            
            try {
              const errorData = JSON.parse(errorText);
              throw new Error(errorData.error || `Failed to execute query: server returned status ${response.status}`);
            } catch (parseError) {
              throw new Error(`Failed to execute query: server returned status ${response.status}: ${errorText}`);
            }
          }
          
          const data = await response.json();
          console.log('Query response data:', data);
          
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
          
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          const isTimeoutOrNetworkError = 
            errorMessage.includes('timeout') || 
            errorMessage.includes('network') ||
            errorMessage.includes('fetch') ||
            error.name === 'AbortError';
          
          if (isTimeoutOrNetworkError) {
            setExecutionSteps(prev => [...prev, "Connection timeout - falling back to demo mode"]);
            toast.info('Serverless function unreachable, falling back to demo mode');
            setUseDummyResponse(true);
            // Retry with dummy mode immediately
            await new Promise(resolve => setTimeout(resolve, 500));
            handleQuerySubmit(e);
            return;
          } else {
            setExecutionSteps(prev => [...prev, `Error: ${errorMessage}`]);
            toast.error(`Failed to execute query: ${errorMessage}`);
            setResult(`An error occurred while processing your query: ${errorMessage}`);
          }
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

  const handleServerlessEndpointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServerlessEndpoint(e.target.value);
  };

  const checkServerlessConnection = async () => {
    setExecutionSteps([`Pinging serverless function...`]);
    setIsLoading(true);
    setDebugInfo(null);
    
    try {
      const endpoint = isAzureFunction 
        ? `${azureFunctionEndpoint}/api/ping` 
        : `${serverlessEndpoint}/ping`;
        
      console.log(`Testing connection to: ${endpoint}`);
      console.log(`Using CORS proxy: ${useCorsProxy ? corsProxyUrl : 'No proxy'}`);
      
      const response = await safeFetch(endpoint, { 
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
        }
      });
      
      const responseData = await response.text();
      console.log('Ping response:', response.status, responseData);
      
      setDebugInfo({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers]),
        data: responseData,
        usingProxy: useCorsProxy,
        proxyUrl: corsProxyUrl,
        isAzure: isAzureFunction
      });
      
      setIsServerlessFunctionAvailable(response.ok);
      
      if (response.ok) {
        setExecutionSteps(prev => [...prev, `Connection successful! Response: ${responseData}`]);
        toast.success('Successfully connected to serverless function!');
        setUseDummyResponse(false);
      } else {
        setExecutionSteps(prev => [...prev, `Server responded with status ${response.status}: ${response.statusText}`]);
        toast.error(`Server error: ${response.status} ${response.statusText}`);
        setUseDummyResponse(true);
      }
    } catch (error) {
      console.error('Error checking serverless function:', error);
      setExecutionSteps(prev => [...prev, `Connection error: ${error instanceof Error ? error.message : String(error)}`]);
      setDebugInfo({
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        usingProxy: useCorsProxy,
        proxyUrl: corsProxyUrl,
        isAzure: isAzureFunction
      });
      toast.error(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsServerlessFunctionAvailable(false);
      setUseDummyResponse(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCorsProxyChange = (checked: boolean) => {
    setUseCorsProxy(checked);
    setExecutionSteps([]);
    // Reset connection state when changing CORS settings
    if (isConnected) {
      handleDisconnect();
    }
  };

  const changeProxy = (index: number) => {
    if (index >= 0 && index < CORS_PROXIES.length) {
      setSelectedProxy(index);
      setCorsProxyUrl(CORS_PROXIES[index].url);
      toast.info(`Switched to ${CORS_PROXIES[index].name} proxy`);
    }
  };

  const tryDirectConnection = () => {
    setUseCorsProxy(false);
    setExecutionSteps([]);
    toast.info("Trying direct connection without CORS proxy");
    if (isConnected) {
      handleDisconnect();
    }
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

  // Update the settings tab content to include Azure Function options
  const renderSettingsTabContent = () => {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Serverless Function Settings</CardTitle>
          <CardDescription>
            Configure connection to the serverless function that handles Neo4j database operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-0.5">
              <FormLabel>Function Type</FormLabel>
              <p className="text-xs text-muted-foreground">Select the type of serverless function to use</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={isAzureFunction ? "outline" : "default"}
                size="sm"
                onClick={() => {
                  setIsAzureFunction(false);
                  setExecutionSteps([]);
                }}
              >
                Netlify
              </Button>
              <Button
                variant={isAzureFunction ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsAzureFunction(true);
                  setExecutionSteps([]);
                }}
              >
                Azure
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <FormLabel>{isAzureFunction ? "Azure Function Endpoint" : "Netlify Function Endpoint"}</FormLabel>
            <div className="flex gap-2">
              <Input 
                value={isAzureFunction ? azureFunctionEndpoint : serverlessEndpoint} 
                onChange={(e) => {
                  if (isAzureFunction) {
                    setAzureFunctionEndpoint(e.target.value);
                  } else {
                    setServerlessEndpoint(e.target.value);
                  }
                }} 
                placeholder={isAzureFunction ? 
                  "e.g., taxaiagents.azurewebsites.net" : 
                  "e.g., https://aswin-langchain-neo4j.netlify.app/.netlify/functions"
                }
                className="flex-grow"
              />
              <Button onClick={checkServerlessConnection} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Test Connection
              </Button>
            </div>
            <div className="flex items-center">
              <p className="text-xs text-muted-foreground">
                {isAzureFunction ? 
                  "The base URL for your Azure Function App (without /api)" : 
                  "The base URL for the serverless function endpoints (without /ping, /testConnection, etc.)"
                }
              </p>
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 ml-2"
                onClick={() => window.open(`https://${isAzureFunction ? azureFunctionEndpoint : serverlessEndpoint}`, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open
              </Button>
            </div>
          </div>
          
          <div className="space-y-4 border p-4 rounded-md">
            <h3 className="text-sm font-medium mb-4">CORS Proxy Settings</h3>
            
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-0.5">
                <FormLabel>Use CORS Proxy</FormLabel>
                <p className="text-xs text-muted-foreground">Routes API requests through a CORS proxy to avoid CORS restrictions</p>
              </div>
              <Switch 
                checked={useCorsProxy} 
                onCheckedChange={handleUseCorsProxyChange}
              />
            </div>
            
            {useCorsProxy && (
              <>
                <div className="space-y-2">
                  <FormLabel>Selected CORS Proxy</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {CORS_PROXIES.map((proxy, index) => (
                      <Badge 
                        key={proxy.name}
                        variant={selectedProxy === index ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => changeProxy(index)}
                      >
                        {proxy.name}
                      </Badge>
                    ))}
                    <Badge 
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={tryDirectConnection}
                    >
                      No Proxy
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current proxy: <code className="bg-muted p-1 rounded">{corsProxyUrl}</code>
                  </p>
                </div>
                
                <div className="space-y-2 mt-4">
                  <FormLabel>Custom CORS Proxy URL (Advanced)</FormLabel>
                  <div className="flex gap-2">
                    <Input 
                      value={corsProxyUrl} 
                      onChange={(e) => setCorsProxyUrl(e.target.value)} 
                      placeholder="e.g., https://corsproxy.io/?"
                      className="flex-grow"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        setCorsProxyUrl(CORS_PROXIES[0].url);
                        toast.info('Reset to default CORS proxy');
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the URL of a CORS proxy service. The target URL will be appended to this proxy URL.
                  </p>
                </div>
              </>
            )}
          </div>
          
          <Alert variant={isServerlessFunctionAvailable ? "default" : "destructive"}>
            <AlertTitle>Connection Status</AlertTitle>
            <AlertDescription>
              {isServerlessFunctionAvailable 
                ? `${isAzureFunction ? "Azure" : "Netlify"} function is reachable and responding properly.` 
                : `${isAzureFunction ? "Azure" : "Netlify"} function is not responding. Check the URL and network configuration.`}
            </AlertDescription>
          </Alert>
          
          {isAzureFunction && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Azure Function Configuration</AlertTitle>
              <AlertDescription>
                <p className="mb-2">For Azure Functions to work correctly:</p>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>Make sure your Azure Function has CORS properly configured</li>
                  <li>Ensure route templates are set with /api prefix in host.json</li>
                  <li>Your functions should return proper headers for CORS</li>
                </ol>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="p-3 bg-muted rounded-md">
            <h3 className="text-sm font-medium mb-2">Troubleshooting Steps</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Verify that the serverless function is deployed and running</li>
              <li>Try different CORS proxy options from the list above</li>
              <li>Check for CORS issues - the server must allow requests from your domain</li>
              <li>Use browser developer tools to inspect network requests for more details</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-6 max-w-7xl">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Neo4j Graph Tools</h1>
        <p className="text-muted-foreground">Query your Neo4j graph database using natural language</p>
      </div>
      
      <Tabs defaultValue="query" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-4">
          <TabsTrigger value="query">Query</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="code">Code Samples</TabsTrigger>
        </TabsList>
        
        <TabsContent value="query" className="space-y-4">
          {/* Neo4j Credentials Form */}
          {!isConnected ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Neo4j Database Connection
                </CardTitle>
                <CardDescription>
                  Connect to your Neo4j database to query it using natural language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCredentialsSubmit(credentialsForm.getValues());
                }} className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <FormLabel>Database URL</FormLabel>
                      <Input
                        id="url"
                        placeholder="neo4j+s://your-instance.databases.neo4j.io"
                        {...credentialsForm.register('url')}
                      />
                      <p className="text-xs text-muted-foreground">
                        Format: neo4j+s://instance.databases.neo4j.io for Neo4j Aura or bolt://localhost:7687 for local
                      </p>
                    </div>
                    
                    <div className="grid gap-2">
                      <FormLabel>Username</FormLabel>
                      <Input
                        id="username"
                        placeholder="neo4j"
                        {...credentialsForm.register('username')}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <FormLabel>Password</FormLabel>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Your Neo4j password"
                        {...credentialsForm.register('password')}
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setUseDummyResponse(!useDummyResponse)}
                >
                  {useDummyResponse ? "Use Real Connection" : "Use Demo Mode"}
                </Button>
                <Button
                  onClick={() => handleCredentialsSubmit(credentialsForm.getValues())}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Connected to Neo4j
                </Badge>
                {useDummyResponse && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Demo Mode
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
          )}
          
          {/* Query Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Natural Language Query
              </CardTitle>
              <CardDescription>
                Ask a question about your Neo4j graph data in plain English
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleQuerySubmit} className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex gap-2">
                    <Input
                      id="query"
                      placeholder="e.g., Find all non-profit organizations in California"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      disabled={!isConnected || isLoading}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={!isConnected || isLoading || !query.trim()}
                      className="shrink-0"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Try: "What non-profit organizations are in California?", "Find all 501(c)(3) organizations in zip code 95814"
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Connection Error */}
          {connectionError && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>{connectionError}</AlertDescription>
            </Alert>
          )}
          
          {/* Execution Steps */}
          {executionSteps.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Execution Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-1 text-sm list-decimal list-inside pl-2">
                  {executionSteps.map((step, index) => (
                    <li key={index} className="text-muted-foreground">
                      {index === executionSteps.length - 1 && isLoading ? (
                        <span className="flex items-center">
                          <Loader2 className="h-3 w-3 animate-spin mr-2" />
                          {step}
                        </span>
                      ) : (
                        step
                      )}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}
          
          {/* Cypher Query Result */}
          {cypherQuery && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Code className="h-4 w-4" /> Generated Cypher Query
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded-md font-mono text-sm overflow-x-auto">
                  {cypherQuery}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Query Result */}
          {result && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line">{result}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="settings">
          {renderSettingsTabContent()}
          
          {/* Debug Information Card */}
          {debugInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Debug Information</CardTitle>
                <CardDescription>Technical details about the serverless function connection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded-md overflow-auto max-h-60">
                  <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle>Code Samples</CardTitle>
              <CardDescription>
                Python code samples for setting up Neo4j with LangChain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="vector-index">
                  <AccordionTrigger className="text-left font-medium">
                    Setting up Neo4j Vector Index
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm overflow-x-auto whitespace-pre">
                      {codeBlocks.vectorIndex}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="prompt-templates">
                  <AccordionTrigger className="text-left font-medium">
                    Creating Prompt Templates
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm overflow-x-auto whitespace-pre">
                      {codeBlocks.promptTemplates}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="graph-chain">
                  <AccordionTrigger className="text-left font-medium">
                    Setting up GraphCypherQAChain
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm overflow-x-auto whitespace-pre">
                      {codeBlocks.graphChain}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ToolsServicePage;
