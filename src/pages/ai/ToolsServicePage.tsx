
import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Database, Server, Settings, Terminal, Code, Send, Loader2 } from "lucide-react";
import * as z from "zod";
import neo4j from 'neo4j-driver';
import { toast } from "@/components/ui/use-toast";
import Neo4jVectorSearchTool from "@/components/ai/Neo4jVectorSearchTool";

const ToolsServicePage = () => {
  const [activeTab, setActiveTab] = useState<'neo4j' | 'vector-search' | 'settings'>('neo4j');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [cypherQuery, setCypherQuery] = useState<string | null>(null);
  const [executionSteps, setExecutionSteps] = useState<string[]>([]);
  const driverRef = useRef<neo4j.Driver | null>(null);
  const [connectionDetails, setConnectionDetails] = useState({
    url: "neo4j+s://demo.neo4jlabs.com:7687",
    username: "movies",
    password: "",
  });
  
  // Form schema for Neo4j credentials
  const formSchema = z.object({
    url: z.string().url("Please enter a valid URL"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  });

  // Create form
  const credentialsForm = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      url: "neo4j+s://demo.neo4jlabs.com:7687",
      username: "movies",
      password: "",
    },
  });

  // Cleanup the driver when the component unmounts
  useEffect(() => {
    return () => {
      if (driverRef.current) {
        driverRef.current.close();
      }
    };
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setIsLoading(true);
    
    try {
      // Close any existing connection
      if (driverRef.current) {
        await driverRef.current.close();
        driverRef.current = null;
      }
      
      // Add connection message to execution steps
      setExecutionSteps(prev => [
        ...prev,
        `Connecting to Neo4j database at ${values.url} with username ${values.username}...`
      ]);
      
      // Create a new driver instance
      const driver = neo4j.driver(
        values.url,
        neo4j.auth.basic(values.username, values.password),
        { disableLosslessIntegers: true }
      );
      
      // Verify the connection
      const session = driver.session();
      try {
        await session.run('RETURN 1 AS result');
        driverRef.current = driver;
        setIsConnected(true);
        setConnectionDetails(values);
        
        // Add success message to execution steps
        setExecutionSteps(prev => [
          ...prev,
          `Connected successfully to Neo4j database!`
        ]);
        
        toast({
          title: "Connection Successful",
          description: "Successfully connected to Neo4j database.",
          variant: "default",
        });
      } catch (error) {
        console.error('Connection error:', error);
        setExecutionSteps(prev => [
          ...prev,
          `Error connecting to database: ${error instanceof Error ? error.message : String(error)}`
        ]);
        
        toast({
          title: "Connection Failed",
          description: error instanceof Error ? error.message : String(error),
          variant: "destructive",
        });
      } finally {
        await session.close();
      }
    } catch (error) {
      console.error('Driver creation error:', error);
      setExecutionSteps(prev => [
        ...prev,
        `Error creating driver: ${error instanceof Error ? error.message : String(error)}`
      ]);
      
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    if (!driverRef.current) {
      toast({
        title: "Not Connected",
        description: "Please connect to a Neo4j database first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      // First, we'll convert natural language to Cypher
      // For now we're doing a simple simulation
      // In a real app, you'd use an LLM API to convert natural language to Cypher
      const generatedCypher = generateSimpleCypher(query);
      setCypherQuery(generatedCypher);
      
      // Add query to execution steps
      setExecutionSteps(prev => [
        ...prev,
        `Executing query: ${query}`,
        `Generated Cypher query: ${generatedCypher}`
      ]);
      
      // Now execute the Cypher query
      const session = driverRef.current.session();
      try {
        const queryResult = await session.run(generatedCypher);
        
        // Format the results
        const formattedResult = formatNeo4jResults(queryResult);
        setResult(formattedResult);
        
        // Add completion to execution steps
        setExecutionSteps(prev => [
          ...prev,
          `Query completed successfully. Retrieved ${queryResult.records.length} records.`
        ]);
      } catch (error) {
        console.error('Query execution error:', error);
        setExecutionSteps(prev => [
          ...prev,
          `Error executing query: ${error instanceof Error ? error.message : String(error)}`
        ]);
        
        toast({
          title: "Query Failed",
          description: error instanceof Error ? error.message : String(error),
          variant: "destructive",
        });
      } finally {
        await session.close();
      }
    } catch (error) {
      console.error('Query processing error:', error);
      setExecutionSteps(prev => [
        ...prev,
        `Error processing query: ${error instanceof Error ? error.message : String(error)}`
      ]);
      
      toast({
        title: "Query Failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to generate a simple Cypher query based on natural language
  const generateSimpleCypher = (naturalLanguage: string): string => {
    const normalizedQuery = naturalLanguage.toLowerCase();
    
    if (normalizedQuery.includes('movie') || normalizedQuery.includes('film')) {
      if (normalizedQuery.includes('actor') || normalizedQuery.includes('acted')) {
        return `MATCH (m:Movie)<-[:ACTED_IN]-(p:Person)
WHERE m.title CONTAINS '${naturalLanguage.replace(/'/g, "\\'")}'
RETURN m.title AS Movie, p.name AS Actor
LIMIT 5`;
      } else {
        return `MATCH (m:Movie)
WHERE m.title CONTAINS '${naturalLanguage.replace(/'/g, "\\'")}'
RETURN m.title AS Movie, m.released AS Released, m.tagline AS Tagline
LIMIT 5`;
      }
    } else if (normalizedQuery.includes('person') || normalizedQuery.includes('actor') || normalizedQuery.includes('director')) {
      return `MATCH (p:Person)
WHERE p.name CONTAINS '${naturalLanguage.replace(/'/g, "\\'")}'
RETURN p.name AS Name, p.born AS Born
LIMIT 5`;
    } else {
      // Default query
      return `MATCH (n)
WHERE toString(n) CONTAINS '${naturalLanguage.replace(/'/g, "\\'")}'
RETURN labels(n) AS Labels, n.name AS Name
LIMIT 5`;
    }
  };
  
  // Helper function to format Neo4j results into a readable string
  const formatNeo4jResults = (queryResult: neo4j.QueryResult): string => {
    if (queryResult.records.length === 0) {
      return "No results found.";
    }
    
    // Get column keys from the first record
    const keys = queryResult.records[0].keys;
    
    // Calculate column widths
    const columnWidths: Record<string, number> = {};
    keys.forEach(key => {
      columnWidths[key] = key.length;
      
      // Check the width needed for each value
      queryResult.records.forEach(record => {
        const valueStr = String(record.get(key) ?? '');
        columnWidths[key] = Math.max(columnWidths[key], valueStr.length);
      });
      
      // Add some padding
      columnWidths[key] += 2;
    });
    
    // Build the header
    let result = '';
    keys.forEach(key => {
      result += key.padEnd(columnWidths[key], ' ');
      result += '| ';
    });
    result += '\n';
    
    // Add separator line
    keys.forEach(key => {
      result += '-'.repeat(columnWidths[key]);
      result += '+-';
    });
    result += '\n';
    
    // Add data rows
    queryResult.records.forEach(record => {
      keys.forEach(key => {
        const valueStr = String(record.get(key) ?? '');
        result += valueStr.padEnd(columnWidths[key], ' ');
        result += '| ';
      });
      result += '\n';
    });
    
    return result;
  };

  const renderSettingsTabContent = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Settings</CardTitle>
            <CardDescription>
              Configure your Neo4j database connection settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeout">Connection Timeout (seconds)</Label>
                <Input
                  id="timeout"
                  type="number"
                  defaultValue={30}
                  min={1}
                  max={300}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="poolSize">Connection Pool Size</Label>
                <Input
                  id="poolSize"
                  type="number"
                  defaultValue={100}
                  min={10}
                  max={1000}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="encryption">Encryption</Label>
                <select
                  id="encryption"
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="REQUIRED"
                >
                  <option value="REQUIRED">Required</option>
                  <option value="OPTIONAL">Optional</option>
                  <option value="DISABLED">Disabled</option>
                </select>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button>Save Settings</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>
              Configure advanced Neo4j driver settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxTransactionRetryTime">
                  Max Transaction Retry Time (ms)
                </Label>
                <Input
                  id="maxTransactionRetryTime"
                  type="number"
                  defaultValue={30000}
                  min={1000}
                  max={120000}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxConnectionLifetime">
                  Max Connection Lifetime (ms)
                </Label>
                <Input
                  id="maxConnectionLifetime"
                  type="number"
                  defaultValue={3600000}
                  min={60000}
                  max={86400000}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="logging"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  defaultChecked
                />
                <Label htmlFor="logging" className="text-sm font-medium">
                  Enable Debug Logging
                </Label>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button>Save Advanced Settings</Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tools Service</h1>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'neo4j' | 'vector-search' | 'settings')}>
            <TabsList>
              <TabsTrigger value="neo4j" className="flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Neo4j
              </TabsTrigger>
              <TabsTrigger value="vector-search" className="flex items-center">
                <Bot className="h-4 w-4 mr-2" />
                Vector Search
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {activeTab === 'neo4j' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="mr-2 h-5 w-5" />
                  Neo4j Connection
                </CardTitle>
                <CardDescription>
                  Connect to your Neo4j database to execute queries
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isConnected ? (
                  <div className="bg-green-50 p-4 rounded-md border border-green-200 text-green-800 mb-4">
                    <p className="font-medium">Successfully connected to Neo4j database</p>
                    <p className="text-sm mt-1">You can now execute queries below</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
            
            <Form {...credentialsForm}>
              <form onSubmit={credentialsForm.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={credentialsForm.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Neo4j URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="neo4j+s://demo.neo4jlabs.com:7687" />
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
                        <FormLabel>Neo4j Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" placeholder="your-password-here" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Connecting...
                      </>
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
            
            <div className="flex flex-col space-y-4 mt-4">
              <form onSubmit={handleQuerySubmit}>
                <div className="space-y-4">
                  <div>
                    <FormLabel htmlFor="query">Query</FormLabel>
                    <div className="flex space-x-2">
                      <Input 
                        id="query"
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter your query here (e.g., 'Show me movies with Tom Hanks')" 
                        className="flex-grow"
                      />
                      <Button type="submit" disabled={isLoading || !isConnected}>
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Send className="h-4 w-4 mr-2" />
                        )}
                        Execute
                      </Button>
                    </div>
                  </div>
                </div>
              </form>

              {(result || cypherQuery || executionSteps.length > 0) && (
                <div className="mt-6 space-y-6">
                  {executionSteps.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Terminal className="mr-2 h-5 w-5" />
                          Execution Log
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-2 ml-6 list-decimal">
                          {executionSteps.map((step, index) => (
                            <li key={index} className="text-sm">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  )}

                  {cypherQuery && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Code className="mr-2 h-5 w-5" />
                          Generated Cypher Query
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                          <code>{cypherQuery}</code>
                        </pre>
                      </CardContent>
                    </Card>
                  )}

                  {result && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Database className="mr-2 h-5 w-5" />
                          Result
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="whitespace-pre-line bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto">
                          {result}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'vector-search' && (
          <Neo4jVectorSearchTool
            neo4jUrl={connectionDetails.url}
            neo4jUsername={connectionDetails.username}
            neo4jPassword={connectionDetails.password}
            isConnected={isConnected}
            driver={driverRef.current}
          />
        )}
        
        {activeTab === 'settings' && renderSettingsTabContent()}
      </div>
    </div>
  );
};

export default ToolsServicePage;
