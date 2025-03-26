
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Database, Send } from 'lucide-react';
import { toast } from 'sonner';

const ToolsServicePage = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a query');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // In a production environment, this would be an API call to your Neo4j service
      // For demonstration purposes, we're simulating a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate a response from the Neo4j database
      const mockResponse = {
        result: `Query results for: "${query}"\n\nThe system would translate this into a Cypher query, execute it against the Neo4j database, and return formatted results here. The RAG (Retrieval-Augmented Generation) chain would process the results to provide a natural language response.`,
        cypher: `MATCH (n)-[r]->(m) WHERE n.name CONTAINS "${query}" RETURN n, r, m LIMIT 5`
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
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This tool translates natural language questions into Cypher queries, executes them against a Neo4j graph database, and provides formatted results.
              </p>
              
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
                        placeholder="e.g., Find connections between Product A and Customer B"
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

              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Processing query...</span>
                </div>
              )}

              {result && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 p-4 bg-muted rounded-md"
                >
                  <h3 className="font-medium mb-2">Results</h3>
                  <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> This is a demonstration interface. In a production environment, 
                this would connect to a real Neo4j database and execute actual Cypher queries using 
                RAG (Retrieval-Augmented Generation) techniques.
              </p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                <li>Your natural language question is processed by a language model</li>
                <li>The question is translated into a Cypher query for Neo4j</li>
                <li>The Cypher query is executed against the graph database</li>
                <li>Results are retrieved and formatted into a human-readable answer</li>
                <li>The system uses a RAG chain to enhance the quality of responses</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Example Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="p-2 bg-muted rounded cursor-pointer hover:bg-muted/80" 
                    onClick={() => setQuery("What products are connected to Customer X?")}>
                  What products are connected to Customer X?
                </li>
                <li className="p-2 bg-muted rounded cursor-pointer hover:bg-muted/80"
                    onClick={() => setQuery("Find all suppliers for Product Y")}>
                  Find all suppliers for Product Y
                </li>
                <li className="p-2 bg-muted rounded cursor-pointer hover:bg-muted/80"
                    onClick={() => setQuery("What is the relationship between Department A and Project B?")}>
                  What is the relationship between Department A and Project B?
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default ToolsServicePage;
