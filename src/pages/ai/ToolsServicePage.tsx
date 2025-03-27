import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Database, Send, Code, Terminal, Info, AlertTriangle, RefreshCw, Globe, ExternalLink, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
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
import { Textarea } from "@/components/ui/textarea";

type Neo4jCredentials = {
  url: string;
  username: string;
  password: string;
};

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
  const [useDummyResponse, setUseDummyResponse] = useState(true);
  const [isServerlessFunctionAvailable, setIsServerlessFunctionAvailable] = useState(false);
  const [serverlessEndpoint, setServerlessEndpoint] = useState('https://aswin-langchain-neo4j.netlify.app/.netlify/functions');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('query');
  const [useCorsProxy, setUseCorsProxy] = useState(false);
  const [corsProxyUrl, setCorsProxyUrl] = useState(CORS_PROXIES[0].url);
  const [selectedProxy, setSelectedProxy] = useState(0);
  const [isAzureFunction, setIsAzureFunction] = useState(true);
  const [azureFunctionEndpoint, setAzureFunctionEndpoint] = useState('https://taxaiagents.azurewebsites.net');

  const credentialsForm = useForm<Neo4jCredentials>({
    defaultValues: {
      url: 'neo4j+s://4e3ae988.databases.neo4j.io',
      username: 'neo4j',
      password: 'IW-f8cEGGxYRnVZHHpksq3j7-pkSl_cae27zXSt8eb8',
    },
  });

  const queryForm = useForm({
    defaultValues: {
      queryText: '',
    }
  });

  const databaseSchema = `
Node labels: 
- __Entity__ (Properties: name, entity, zipcode, embedding)

Relationship types:
- HAS_RELATIONSHIP_WITH
- FILED_IN
- BELONGS_TO
`;

  const getServerlessEndpoint = () => {
    let endpoint = isAzureFunction ? azureFunctionEndpoint : serverlessEndpoint;
    
    if (isAzureFunction && !endpoint.startsWith('http')) {
      endpoint = `https://${endpoint}`;
    }
    
    if (endpoint.endsWith('/')) {
      endpoint = endpoint.slice(0, -1);
    }
    
    return endpoint;
  };

  const getFetchUrl = (url: string) => {
    if (!useCorsProxy) return url;
    
    try {
      new URL(url);
      return `${corsProxyUrl}${encodeURIComponent(url)}`;
    } catch (e) {
      console.error("Invalid URL:", url, e);
      toast.error("Invalid URL format");
      return url;
    }
  };

  const safeFetch = async (url: string, options: RequestInit = {}) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const fetchUrl = getFetchUrl(url);
      console.log(`Fetching URL: ${fetchUrl}`);
      console.log(`Using CORS proxy: ${useCorsProxy ? 'Yes' : 'No'}`);
      
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

  useEffect(() => {
    const checkServerlessAvailability = async () => {
      try {
        const baseEndpoint = getServerlessEndpoint();
        const endpoint = isAzureFunction 
          ? `${baseEndpoint}/api/ping` 
          : `${baseEndpoint}/ping`;
          
        console.log(`Checking serverless function availability at: ${endpoint}`);
        console.log(`Using CORS proxy: ${useCorsProxy ? corsProxyUrl : 'No proxy'}`);
        
        setExecutionSteps(prev => [...prev, `Pinging serverless function at ${endpoint}...`]);
        
        await new Promise(r => setTimeout(r, 500));
        
        try {
          const response = await safeFetch(endpoint, { 
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json',
            }
          });
          
          const responseData = await response.text();
          console.log('Ping response:', response.status, responseData);
          
          const isSuccessResponse = response.ok && !responseData.includes('<!DOCTYPE html>');
          
          setIsServerlessFunctionAvailable(isSuccessResponse);
          setDebugInfo({
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries([...response.headers]),
            data: responseData.substring(0, 500),
            usingProxy: useCorsProxy,
            proxyUrl: corsProxyUrl,
            isAzure: isAzureFunction,
            baseUrl: baseEndpoint
          });
          
          if (!isSuccessResponse) {
            console.warn('Serverless function is not available: Response contains HTML or has error status');
            setExecutionSteps(prev => [...prev, `Server responded but with invalid format or error status: ${response.status}`]);
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
          isAzure: isAzureFunction,
          endpoint: getServerlessEndpoint()
        });
        setIsServerlessFunctionAvailable(false);
        setUseDummyResponse(true);
      }
    };
    
    checkServerlessAvailability();
  }, [serverlessEndpoint, useCorsProxy, corsProxyUrl, isAzureFunction, azureFunctionEndpoint]);

  useEffect(() => {
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
    
    if (!isServerlessFunctionAvailable) {
      console.log('Serverless function is not available, using demo mode');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUseDummyResponse(true);
      setIsConnected(true);
      setExecutionSteps(prev => [...prev, "Using demo mode (serverless function unavailable)"]);
      toast.info('Using demo mode with sample data (serverless function unavailable)');
      setIsLoading(false);
      return;
    }
    
    try {
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
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setExecutionSteps(prev => [...prev, "Generating Cypher query from natural language..."]);
        const dummyCypher = `MATCH (e:__Entity__)
WHERE e.entity CONTAINS 'NON-PROFIT' AND e.zipcode STARTS WITH '9'
RETURN e.name, e.entity, e.zipcode
LIMIT 5`;
        
        setCypherQuery(dummyCypher);
        
        setExecutionSteps(prev => [...prev, "Executing Cypher query against Neo4j database..."]);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
        const { url, username, password } = credentialsForm.getValues();
        
        setExecutionSteps(prev => [...prev, "Generating Cypher query from natural language..."]);
        
        try {
          const baseEndpoint = getServerlessEndpoint();
          const executeQueryEndpoint = isAzureFunction 
            ? `${baseEndpoint}/api/executeQuery` 
            : `${baseEndpoint}/executeQuery`;
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
            
            if (errorText.includes('<!DOCTYPE html>')) {
              throw new Error(`API endpoint not found or not accessible. Please check the endpoint configuration.`);
            }
            
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

vector_index = Neo4jVector.from_existing_graph(
    OpenAIEmbeddings(),
    url=url,
    username=username,
    password=password,
    index_name='incometax',
    node_label="__Entity__",
    text_node_properties=['name', 'entity', 'zipcode'],
    embedding_node_property='embedding'
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
            <FormLabel htmlFor="endpoint">{isAzureFunction ? "Azure Function Endpoint" : "Netlify Function Endpoint"}</FormLabel>
            <div className="flex gap-2">
              <Input 
                id="endpoint"
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
                <FormLabel htmlFor="use-cors">Use CORS Proxy</FormLabel>
                <p className="text-xs text-muted-foreground">Routes API requests through a CORS proxy to avoid CORS restrictions</p>
              </div>
              <Switch 
                id="use-cors"
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
                  <FormLabel htmlFor="custom-proxy">Custom CORS Proxy URL (Advanced)</FormLabel>
                  <div className="flex gap-2">
                    <Input 
                      id="custom-proxy"
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
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Direct Connection Active</AlertTitle>
            <AlertDescription>
              <p>Your application is configured to connect directly to the serverless function without using a CORS proxy.</p>
            </AlertDescription>
          </Alert>
          
          <Alert variant={isServerlessFunctionAvailable ? "default" : "destructive"}>
            {isServerlessFunctionAvailable ? (
              <Info className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertTitle>
              {isServerlessFunctionAvailable 
                ? "Serverless Function Available" 
                : "Serverless Function Unavailable"
              }
            </AlertTitle>
            <AlertDescription>
              {isServerlessFunctionAvailable
                ? "The serverless function is accessible and responding correctly."
                : "The serverless function is not responding or returned an error. The application will use demo mode with sample data."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  };

  return (
    <motion.div className="flex flex-col">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tools Service</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('query')}
              className={activeTab === 'query' ? 'bg-blue-500 text-white' : ''}
            >
              Query
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('settings')}
              className={activeTab === 'settings' ? 'bg-blue-500 text-white' : ''}
            >
              Settings
            </Button>
          </div>
        </div>
        
        {activeTab === 'query' && (
          <div className="flex flex-col space-y-4">
            <form onSubmit={credentialsForm.handleSubmit(handleCredentialsSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={credentialsForm.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Neo4j URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="neo4j+s://4e3ae988.databases.neo4j.io" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={credentialsForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Neo4j Username</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="neo4j" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={credentialsForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Neo
