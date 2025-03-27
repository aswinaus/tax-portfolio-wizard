import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Database, Loader2, Send, Code, Terminal } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Neo4jVectorSearch } from "@/utils/neo4jVectorSearch";
import neo4j from "neo4j-driver";

const apiKeySchema = z.object({
  apiKey: z.string().min(1, "OpenAI API key is required"),
});

interface Neo4jVectorSearchToolProps {
  neo4jUrl: string;
  neo4jUsername: string;
  neo4jPassword: string;
  isConnected: boolean;
  driver: neo4j.Driver | null;
}

const Neo4jVectorSearchTool = ({
  neo4jUrl,
  neo4jUsername,
  neo4jPassword,
  isConnected,
  driver
}: Neo4jVectorSearchToolProps) => {
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [vectorSearch, setVectorSearch] = useState<Neo4jVectorSearch | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [cypherQuery, setCypherQuery] = useState<string | null>(null);
  const [rawResults, setRawResults] = useState<any[] | null>(null);
  const [executionSteps, setExecutionSteps] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const apiKeyForm = useForm<z.infer<typeof apiKeySchema>>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      apiKey: "",
    },
  });

  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  useEffect(() => {
    setIsInitialized(false);
  }, [neo4jUrl, neo4jUsername, neo4jPassword]);

  useEffect(() => {
    if (apiKey && isConnected && driver && !isInitialized) {
      console.log("Initializing vector search with connection details");
      initializeVectorSearch(apiKey);
      setIsInitialized(true);
    }
  }, [apiKey, isConnected, driver, isInitialized, neo4jUrl, neo4jUsername, neo4jPassword]);

  const initializeVectorSearch = async (key: string) => {
    if (!isConnected || !driver) return;
    
    try {
      console.log("Creating Neo4jVectorSearch instance with config:", {
        url: neo4jUrl,
        username: neo4jUsername,
        indexName: "incometax"
      });
      
      const search = new Neo4jVectorSearch(key, {
        url: neo4jUrl,
        username: neo4jUsername,
        password: neo4jPassword,
        indexName: "incometax",
        nodeLabel: "__Entity__",
        textNodeProperties: ["name", "entity", "zipcode"],
        embeddingNodeProperty: "embedding"
      });
      
      await search.connect(driver);
      
      setVectorSearch(search);
      setExecutionSteps(prev => [...prev, "Vector search initialized successfully"]);
      
      toast({
        title: "Vector Search Ready",
        description: "Neo4j Vector Search tool has been initialized",
      });
    } catch (error) {
      console.error("Failed to initialize vector search:", error);
      setExecutionSteps(prev => [
        ...prev,
        `Error initializing vector search: ${error instanceof Error ? error.message : String(error)}`
      ]);
      
      toast({
        title: "Initialization Failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  const onApiKeySubmit = async (values: z.infer<typeof apiKeySchema>) => {
    localStorage.setItem('openai_api_key', values.apiKey);
    setApiKey(values.apiKey);
    setIsApiKeyDialogOpen(false);
    setIsInitialized(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    if (!vectorSearch) {
      toast({
        title: "Not Ready",
        description: "Vector search is not initialized. Please set your OpenAI API key.",
        variant: "destructive",
      });
      setIsApiKeyDialogOpen(true);
      return;
    }
    
    setIsSearching(true);
    setSearchResult(null);
    setCypherQuery(null);
    setRawResults(null);
    
    const newExecutionSteps = [`Executing search: ${searchQuery}`];
    
    try {
      const result = await vectorSearch.query(searchQuery, { includeRawResults: true });
      
      setSearchResult(result.answer);
      if (result.cypher) setCypherQuery(result.cypher);
      if (result.rawResults) setRawResults(result.rawResults);
      
      newExecutionSteps.push(`Search completed successfully`);
      if (result.cypher) newExecutionSteps.push(`Generated Cypher query: ${result.cypher}`);
    } catch (error) {
      console.error("Search failed:", error);
      
      newExecutionSteps.push(`Error executing search: ${error instanceof Error ? error.message : String(error)}`);
      
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
      setExecutionSteps(prev => [...prev, ...newExecutionSteps]);
    }
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            Neo4j Vector Search
          </CardTitle>
          <CardDescription>
            Query your Neo4j graph database with natural language
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200 text-amber-800 mb-4">
              <p className="font-medium">Database connection required</p>
              <p className="text-sm mt-1">Connect to your Neo4j database first</p>
            </div>
          ) : !apiKey ? (
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200 text-amber-800 mb-4">
              <p className="font-medium">OpenAI API key required</p>
              <p className="text-sm mt-1">
                Set your OpenAI API key to use vector search
              </p>
              <Button
                onClick={() => setIsApiKeyDialogOpen(true)}
                variant="outline"
                className="mt-2"
              >
                Set API Key
              </Button>
            </div>
          ) : (
            <div className="bg-green-50 p-4 rounded-md border border-green-200 text-green-800 mb-4">
              <p className="font-medium">Ready to search</p>
              <p className="text-sm mt-1">
                Neo4j Vector Search is configured and ready to use
              </p>
              <div className="mt-2 text-xs">
                Connected to: {neo4jUrl} as {neo4jUsername}
              </div>
            </div>
          )}

          <form onSubmit={handleSearch} className="space-y-4 mt-4">
            <div className="space-y-2">
              <FormLabel htmlFor="search">Natural Language Query</FormLabel>
              <div className="flex space-x-2">
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask a question about your data..."
                  className="flex-grow"
                  disabled={!isConnected || !apiKey || isSearching}
                />
                <Button
                  type="submit"
                  disabled={!isConnected || !apiKey || isSearching || !searchQuery.trim()}
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Search
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {(searchResult || cypherQuery || executionSteps.length > 0) && (
        <div className="space-y-6">
          {searchResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="mr-2 h-5 w-5" />
                  Answer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md">
                  {searchResult}
                </div>
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

          {rawResults && rawResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Raw Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  <code>{JSON.stringify(rawResults, null, 2)}</code>
                </pre>
              </CardContent>
            </Card>
          )}

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
        </div>
      )}

      <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set OpenAI API Key</DialogTitle>
            <DialogDescription>
              Your API key is stored locally in your browser and is never sent to our servers.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...apiKeyForm}>
            <form onSubmit={apiKeyForm.handleSubmit(onApiKeySubmit)} className="space-y-4">
              <FormField
                control={apiKeyForm.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OpenAI API Key</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="sk-..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Save API Key</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Neo4jVectorSearchTool;
