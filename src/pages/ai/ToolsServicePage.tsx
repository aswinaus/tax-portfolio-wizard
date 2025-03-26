
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Database, Send, Code, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';

const ToolsServicePage = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [cypherQuery, setCypherQuery] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [neo4jCredentials, setNeo4jCredentials] = useState({
    url: '',
    username: '',
    password: '',
  });
  const [isConnected, setIsConnected] = useState(false);

  // Simplified database schema for UI representation
  const databaseSchema = `
Node labels: 
- __Entity__ (Properties: name, entity, zipcode, embedding)

Relationship types:
- HAS_RELATIONSHIP_WITH
- FILED_IN
- BELONGS_TO
`;

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!neo4jCredentials.url || !neo4jCredentials.username || !neo4jCredentials.password) {
      toast.error('Please fill in all Neo4j credentials');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate connection to Neo4j
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
      toast.success('Connected to Neo4j database successfully');
    }, 1000);
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

    try {
      // In a production environment, this would call your API that runs the Python code
      // with the CYPHER_GENERATION_PROMPT and CYPHER_QA_PROMPT
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a sample Cypher query based on the question
      // This simulates what CYPHER_GENERATION_PROMPT would produce
      const sampleCypherQuery = `MATCH (e:__Entity__)
WHERE e.name CONTAINS "${query}" OR e.entity CONTAINS "${query}" OR e.zipcode CONTAINS "${query}"
RETURN e.name, e.entity, e.zipcode
LIMIT 5`;
      
      setCypherQuery(sampleCypherQuery);
      
      // Simulate a response from the Neo4j database and processed through CYPHER_QA_PROMPT
      const mockResponse = {
        result: `Based on the query "${query}", I found the following information in the graph database:

Entities matching your criteria include tax-exempt organizations located in the specified area with related fiscal information. The vector search using the 'incometax' index has retrieved the most relevant nodes based on their name, entity type, and zipcode properties as configured in the Neo4j database.`
      };
      
      setResult(mockResponse.result);
      toast.success('Query executed successfully');
    } catch (error) {
      console.error('Error executing query:', error);
      toast.error('Failed to execute query. Please try again.');
      setResult('An error occurred while processing your query.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setNeo4jCredentials({
      url: '',
      username: '',
      password: '',
    });
    setCypherQuery(null);
    setResult(null);
    toast.success('Disconnected from Neo4j database');
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
            Tools as a Service
          </h1>
          <p className="text-muted-foreground">
            Access powerful AI-powered tools to streamline your business processes
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Neo4j Graph Database Query
              </CardTitle>
              <CardDescription>
                This tool uses the 'incometax' vector index on '__Entity__' nodes, utilizing the name, entity, and zipcode properties.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This tool translates natural language questions into Cypher queries using LangChain prompts, executes them against a Neo4j graph database, and provides formatted results.
              </p>
              
              {!isConnected ? (
                <form onSubmit={handleCredentialsSubmit} className="space-y-4 p-4 border rounded-md">
                  <h3 className="font-semibold">Connect to Neo4j Database</h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 gap-2">
                      <label htmlFor="url" className="text-sm font-medium">
                        Neo4j URL
                      </label>
                      <Input
                        id="url"
                        value={neo4jCredentials.url}
                        onChange={(e) => setNeo4jCredentials({...neo4jCredentials, url: e.target.value})}
                        placeholder="e.g., bolt://localhost:7687"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="username" className="text-sm font-medium">
                          Username
                        </label>
                        <Input
                          id="username"
                          value={neo4jCredentials.username}
                          onChange={(e) => setNeo4jCredentials({...neo4jCredentials, username: e.target.value})}
                          placeholder="neo4j"
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label htmlFor="password" className="text-sm font-medium">
                          Password
                        </label>
                        <Input
                          id="password"
                          type="password"
                          value={neo4jCredentials.password}
                          onChange={(e) => setNeo4jCredentials({...neo4jCredentials, password: e.target.value})}
                          placeholder="Your password"
                          disabled={isLoading}
                        />
                      </div>
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
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Connected to Neo4j database ({neo4jCredentials.url})</span>
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

              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Processing query...</span>
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
                In a production environment, it would connect to a real Neo4j database using the Python code with 
                OpenAI embeddings on the 'incometax' vector index.
              </p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                <li>Your question is processed by LangChain with the CYPHER_GENERATION_PROMPT</li>
                <li>The prompt converts your natural language into a Cypher query</li>
                <li>The query runs against Neo4j using the 'incometax' vector index</li>
                <li>Results are formatted using the CYPHER_QA_PROMPT for human readability</li>
                <li>The system uses OpenAI embeddings to find semantically relevant information</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prompt Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-1">CYPHER_GENERATION_PROMPT</h3>
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded text-xs overflow-hidden">
                  <p>Converts questions to Cypher queries using the database schema</p>
                  <p className="text-muted-foreground mt-1">Uses schema and question as input variables</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-1">CYPHER_QA_PROMPT</h3>
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded text-xs overflow-hidden">
                  <p>Formats Neo4j query results into human-readable answers</p>
                  <p className="text-muted-foreground mt-1">Uses context and question as input variables</p>
                </div>
              </div>
              
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                <h3 className="text-sm font-semibold mb-1">Database Schema</h3>
                <pre className="text-xs whitespace-pre-wrap">{databaseSchema}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default ToolsServicePage;
