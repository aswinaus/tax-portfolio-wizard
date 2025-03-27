
import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Database, Server, Settings, Terminal, Code, Send, Loader2, Bot } from "lucide-react";
import * as z from "zod";
import { Driver, QueryResult, Record as Neo4jRecord } from 'neo4j-driver';
import neo4j from 'neo4j-driver';
import { toast } from "@/components/ui/use-toast";
import Neo4jVectorSearchTool from "@/components/ai/Neo4jVectorSearchTool";
import { useIsMobile } from "@/hooks/use-mobile";

interface Neo4jQueryResult {
  records: Neo4jRecord[];
}

const ToolsServicePage = () => {
  const [activeTab, setActiveTab] = useState<'neo4j' | 'vector-search' | 'settings'>('neo4j');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [cypherQuery, setCypherQuery] = useState<string | null>(null);
  const [executionSteps, setExecutionSteps] = useState<string[]>([]);
  const driverRef = useRef<Driver | null>(null);
  const isMobile = useIsMobile();
  const [connectionDetails, setConnectionDetails] = useState({
    url: "neo4j+s://4e3ae988.databases.neo4j.io",
    username: "neo4j",
    password: "",
  });
  
  const formSchema = z.object({
    url: z.string().url("Please enter a valid URL"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  });

  const credentialsForm = useForm<z.infer<typeof formSchema>>({
    defaultValues: connectionDetails,
  });

  useEffect(() => {
    credentialsForm.reset(connectionDetails);
  }, [connectionDetails, credentialsForm]);

  useEffect(() => {
    return () => {
      if (driverRef.current) {
        driverRef.current.close();
      }
    };
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Connecting with values:", values);
    setIsLoading(true);
    
    const newExecutionSteps: string[] = [];
    newExecutionSteps.push(`Connecting to Neo4j database at ${values.url} with username ${values.username}...`);
    
    try {
      if (driverRef.current) {
        await driverRef.current.close();
        driverRef.current = null;
      }
      
      const driver = neo4j.driver(
        values.url,
        neo4j.auth.basic(values.username, values.password),
        { disableLosslessIntegers: true }
      );
      
      const session = driver.session();
      try {
        await session.run('RETURN 1 AS result');
        driverRef.current = driver;
        setIsConnected(true);
        setConnectionDetails({
          url: values.url,
          username: values.username,
          password: values.password,
        });
        
        newExecutionSteps.push(`Connected successfully to Neo4j database!`);
        
        toast({
          title: "Connection Successful",
          description: "Successfully connected to Neo4j database.",
          variant: "default",
        });
      } catch (error) {
        console.error('Connection error:', error);
        newExecutionSteps.push(`Error connecting to database: ${error instanceof Error ? error.message : String(error)}`);
        
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
      newExecutionSteps.push(`Error creating driver: ${error instanceof Error ? error.message : String(error)}`);
      
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setExecutionSteps(prev => [...prev, ...newExecutionSteps]);
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
    
    const newExecutionSteps: string[] = [];
    newExecutionSteps.push(`Executing query: ${query}`);
    
    try {
      const generatedCypher = generateTaxDataCypher(query);
      setCypherQuery(generatedCypher);
      
      newExecutionSteps.push(`Generated Cypher query: ${generatedCypher}`);
      
      const session = driverRef.current.session();
      try {
        const queryResult: QueryResult = await session.run(generatedCypher);
        
        const formattedResult = formatNeo4jResults(queryResult);
        setResult(formattedResult);
        
        newExecutionSteps.push(`Query completed successfully. Retrieved ${queryResult.records.length} records.`);
      } catch (error) {
        console.error('Query execution error:', error);
        newExecutionSteps.push(`Error executing query: ${error instanceof Error ? error.message : String(error)}`);
        
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
      newExecutionSteps.push(`Error processing query: ${error instanceof Error ? error.message : String(error)}`);
      
      toast({
        title: "Query Failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setExecutionSteps(prev => [...prev, ...newExecutionSteps]);
    }
  };

  const generateTaxDataCypher = (naturalLanguage: string): string => {
    const normalizedQuery = naturalLanguage.toLowerCase();
    
    if (normalizedQuery.includes('return') || normalizedQuery.includes('filing')) {
      if (normalizedQuery.includes('state') || normalizedQuery.includes('states')) {
        return `MATCH (r:Return)-[:FILED_IN]->(s:State)
WHERE s.name CONTAINS '${naturalLanguage.replace(/'/g, "\\'")}'
RETURN s.name AS State, count(r) AS ReturnCount, 
       sum(r.singleReturns) AS SingleReturns, 
       sum(r.jointReturns) AS JointReturns
LIMIT 10`;
      } else {
        return `MATCH (r:Return)
WHERE r.type CONTAINS '${naturalLanguage.replace(/'/g, "\\'")}'
RETURN r.type AS ReturnType, count(r) AS Count, 
       avg(r.amount) AS AvgAmount
LIMIT 10`;
      }
    } else if (normalizedQuery.includes('income') || normalizedQuery.includes('bracket')) {
      return `MATCH (i:Income)
WHERE i.bracket CONTAINS '${naturalLanguage.replace(/'/g, "\\'")}'
RETURN i.bracket AS IncomeBracket, count(i) AS Count,
       sum(i.taxPaid) AS TotalTaxPaid
LIMIT 10`;
    } else {
      return `MATCH (n)
WHERE (n.name CONTAINS '${naturalLanguage.replace(/'/g, "\\'")}' OR 
       n.type CONTAINS '${naturalLanguage.replace(/'/g, "\\'")}' OR 
       n.category CONTAINS '${naturalLanguage.replace(/'/g, "\\'")}')
RETURN labels(n)[0] AS Type, COALESCE(n.name, n.type, n.category) AS Name
LIMIT 10`;
    }
  };

  const formatNeo4jResults = (queryResult: QueryResult): string => {
    if (queryResult.records.length === 0) {
      return "No results found.";
    }
    
    const keys = queryResult.records[0].keys;
    
    const columnWidths: Record<string, number> = {};
    for (const key of keys) {
      if (typeof key === 'string') {
        columnWidths[key] = key.length;
        
        queryResult.records.forEach(record => {
          const valueStr = String(record.get(key) ?? '');
          columnWidths[key] = Math.max(columnWidths[key], valueStr.length);
        });
        
        columnWidths[key] += 2;
      }
    }
    
    let result = '';
    for (const key of keys) {
      if (typeof key === 'string') {
        result += key.padEnd(columnWidths[key], ' ');
        result += '| ';
      }
    }
    result += '\n';
    
    for (const key of keys) {
      if (typeof key === 'string') {
        result += '-'.repeat(columnWidths[key]);
        result += '+-';
      }
    }
    result += '\n';
    
    queryResult.records.forEach(record => {
      for (const key of keys) {
        if (typeof key === 'string') {
          const valueStr = String(record.get(key) ?? '');
          result += valueStr.padEnd(columnWidths[key], ' ');
          result += '| ';
        }
      }
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
    <div className="container px-4 py-6 mx-auto">
      <div className="flex flex-col space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Tax Data Tools</h1>
          <p className="text-muted-foreground">
            Professional tools for analyzing and querying tax data with Neo4j database
          </p>
        </header>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'neo4j' | 'vector-search' | 'settings')}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-3 md:w-auto md:inline-flex">
                <TabsTrigger value="neo4j" className="flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Neo4j Query</span>
                  <span className="sm:hidden">Query</span>
                </TabsTrigger>
                <TabsTrigger value="vector-search" className="flex items-center">
                  <Bot className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Vector Search</span>
                  <span className="sm:hidden">Search</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Settings</span>
                  <span className="sm:hidden">Config</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="neo4j" className="mt-6">
                <div className="grid gap-6">
                  <Card className="overflow-hidden shadow-sm border-2 border-primary/10">
                    <CardHeader className="bg-muted/50">
                      <CardTitle className="flex items-center text-xl">
                        <Server className="mr-2 h-5 w-5 text-primary" />
                        Neo4j Tax Database Connection
                      </CardTitle>
                      <CardDescription>
                        Connect to your Neo4j tax database to execute queries
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {isConnected ? (
                        <div className="bg-green-50 p-4 rounded-md border border-green-200 text-green-800 mb-4">
                          <p className="font-medium">Successfully connected to Neo4j database</p>
                          <p className="text-sm mt-1">You can now execute tax data queries below</p>
                        </div>
                      ) : null}
                      
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
                                    <Input {...field} placeholder="neo4j+s://your-tax-db.neo4j.io:7687" />
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
                                    <Input {...field} placeholder="taxdata" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="md:col-span-2 lg:col-span-1">
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
                            </div>
                            <div className="flex justify-start md:justify-end md:items-end md:self-end">
                              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
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
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl">Execute Query</CardTitle>
                      <CardDescription>
                        Enter a natural language query to query your tax database
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleQuerySubmit} className="space-y-4">
                        <div>
                          <FormLabel htmlFor="query">Query</FormLabel>
                          <div className="flex flex-col sm:flex-row gap-2 mt-2">
                            <Input 
                              id="query"
                              value={query} 
                              onChange={(e) => setQuery(e.target.value)}
                              placeholder="Enter your query here (e.g., 'Show me tax returns from California')" 
                              className="flex-grow"
                            />
                            <Button 
                              type="submit" 
                              disabled={isLoading || !isConnected || !query.trim()}
                              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Executing...
                                </>
                              ) : (
                                <>
                                  <Send className="h-4 w-4 mr-2" />
                                  Execute
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {(result || cypherQuery || executionSteps.length > 0) && (
                    <div className="space-y-6">
                      {cypherQuery && (
                        <Card className="shadow-sm border-primary/10">
                          <CardHeader className="bg-muted/50 pb-2">
                            <CardTitle className="flex items-center text-lg font-medium">
                              <Code className="mr-2 h-5 w-5 text-primary" />
                              Generated Cypher Query
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="overflow-x-auto">
                              <pre className="bg-muted p-4 rounded-b-md text-xs sm:text-sm whitespace-pre-wrap sm:whitespace-pre">
                                <code>{cypherQuery}</code>
                              </pre>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {result && (
                        <Card className="shadow-sm border-primary/10">
                          <CardHeader className="bg-muted/50 pb-2">
                            <CardTitle className="flex items-center text-lg font-medium">
                              <Database className="mr-2 h-5 w-5 text-primary" />
                              Query Results
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="overflow-x-auto">
                              <div className="whitespace-pre font-mono text-xs sm:text-sm bg-muted p-4 rounded-b-md">
                                {result}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {executionSteps.length > 0 && (
                        <Card className="shadow-sm">
                          <CardHeader className="bg-muted/50 pb-2">
                            <CardTitle className="flex items-center text-lg font-medium">
                              <Terminal className="mr-2 h-5 w-5 text-primary" />
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
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="vector-search" className="mt-6">
                <Neo4jVectorSearchTool
                  neo4jUrl={connectionDetails.url}
                  neo4jUsername={connectionDetails.username}
                  neo4jPassword={connectionDetails.password}
                  isConnected={isConnected}
                  driver={driverRef.current}
                />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-6">
                {renderSettingsTabContent()}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsServicePage;
