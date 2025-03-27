
import { Link } from 'react-router-dom';
import { ChevronLeft, PlusCircle, Presentation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { BlogPost, createBlogPost } from '@/services/blogService';
import { useQueryClient } from '@tanstack/react-query';

const BlogHeader = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // This array ensures these critical metrics are always included in the blog template
  const criticalEvalMetrics = [
    "Context Precision",
    "Context Recall", 
    "Faithfulness",
    "Answer Relevancy"
  ];

  const createTemplatePost = (template: string) => {
    if (template === 'llm-evals') {
      // Create the LLM Evals blog post directly
      let llmEvalsContent = `
<h2>What is LLM Evals?</h2>
<p>LLM Evals (Language Model Evaluations) refers to the systematic process and methodologies used to assess the performance, capabilities, and limitations of Large Language Models. These evaluations help us understand how well a model performs across various tasks, from simple text completion to complex reasoning, ensuring the model meets specific quality standards before deployment.</p>
<p>Evaluation frameworks provide structured approaches to measure different aspects of language models, including:</p>
<ul>
  <li>Technical performance (accuracy, precision, etc.)</li>
  <li>Safety and alignment with human values</li>
  <li>Robustness against adversarial inputs</li>
  <li>Fairness and bias mitigation</li>
  <li>Ability to follow instructions and complete complex tasks</li>
</ul>

<h2>Why do we need LLM Evals?</h2>
<p>As language models become increasingly powerful and integrated into critical systems, robust evaluation becomes essential for several reasons:</p>
<ul>
  <li><strong>Quality Assurance</strong>: Ensuring models perform as expected before deployment</li>
  <li><strong>Safety</strong>: Identifying potential harmful outputs or vulnerabilities</li>
  <li><strong>Benchmark Progress</strong>: Measuring improvements between model versions</li>
  <li><strong>Comparative Analysis</strong>: Understanding how different models perform on the same tasks</li>
  <li><strong>Alignment Verification</strong>: Confirming models behave according to human preferences and values</li>
  <li><strong>Capability Mapping</strong>: Identifying a model's strengths and weaknesses across different domains</li>
</ul>
<p>Without thorough evaluation, we risk deploying models that may produce misleading information, exhibit biases, or fail in critical scenarios.</p>

<h2>Popular Frameworks for LLM Evals</h2>
<p>Several frameworks have emerged to standardize and streamline the evaluation of language models:</p>
<ol>
  <li><strong>HELM (Holistic Evaluation of Language Models)</strong> - Stanford's comprehensive benchmark suite covering 42 scenarios across 7 capabilities</li>
  <li><strong>Eleuther AI's LM Evaluation Harness</strong> - Open-source tool supporting over 200 tasks and benchmarks</li>
  <li><strong>OpenAI Evals</strong> - Framework to evaluate both the capabilities and limitations of language models</li>
  <li><strong>LangSmith</strong> - Developed by LangChain, provides tooling for testing, monitoring, and improving LLM applications in production with detailed tracing and evaluation capabilities</li>
  <li><strong>Ragas</strong> - Framework specifically designed for evaluating Retrieval Augmented Generation (RAG) systems, measuring retrieval quality, answer relevance, and faithfulness</li>
  <li><strong>BIG-bench</strong> - Collaborative benchmark with 204 tasks designed to probe model capabilities beyond standard benchmarks</li>
  <li><strong>MMLU (Massive Multitask Language Understanding)</strong> - Tests knowledge across 57 subjects from elementary to professional levels</li>
  <li><strong>HumanEval</strong> - Focuses on code generation capabilities</li>
  <li><strong>TruthfulQA</strong> - Measures a model's tendency to reproduce falsehoods commonly believed by humans</li>
</ol>

<h2>Pre-requisites for LLM Evals: Dataset Preparation</h2>
<p>Effective evaluation requires carefully constructed datasets. Key considerations include:</p>
<ul>
  <li><strong>Diversity</strong> - Ensuring datasets cover a wide range of topics, domains, and difficulty levels</li>
  <li><strong>Representative Samples</strong> - Including examples that reflect real-world use cases</li>
  <li><strong>Gold Standards</strong> - Creating high-quality reference answers for comparison</li>
  <li><strong>Adversarial Examples</strong> - Including edge cases designed to challenge the model</li>
  <li><strong>Demographic Balance</strong> - Ensuring datasets don't overrepresent certain groups or perspectives</li>
  <li><strong>Task-Specific Customization</strong> - Tailoring datasets to the specific capabilities being evaluated</li>
</ul>
<p>Dataset preparation often requires significant human effort, especially for tasks requiring expert knowledge or nuanced judgments.</p>

<h2>Key Metrics in LLM Evaluation</h2>

<h3>Truthfulness</h3>
<p>Measures how factually accurate the model's outputs are, particularly important for knowledge-intensive tasks. Frameworks like TruthfulQA specifically test a model's tendency to generate false information. Evaluators often use:</p>
<ul>
  <li>Fact verification against reliable sources</li>
  <li>Consistency checks across related questions</li>
  <li>Hallucination detection metrics</li>
</ul>

<h3>Groundedness</h3>
<p>Assesses whether model outputs are properly supported by provided context or source materials. Ungrounded responses may be plausible-sounding but disconnected from the input information. Evaluation typically involves:</p>
<ul>
  <li>Attribution accuracy</li>
  <li>Source-output alignment scoring</li>
  <li>Citation precision</li>
</ul>

<h3>Context Precision</h3>
<p>Measures how precisely the model uses the provided context when generating responses. High context precision indicates that the model is effectively using the most relevant parts of the available information. Key aspects include:</p>
<ul>
  <li>Ability to identify and extract relevant information from the context</li>
  <li>Avoidance of using irrelevant context that might lead to misleading answers</li>
  <li>Proper weighting of information based on its relevance to the query</li>
</ul>
<p>Low context precision might indicate that the model is using too much irrelevant information, which can dilute the quality of responses.</p>

<h3>Context Recall</h3>
<p>Evaluates how comprehensively the model captures and utilizes all relevant information from the provided context. High context recall demonstrates that the model isn't missing crucial information when formulating its response. This involves measuring:</p>
<ul>
  <li>Completeness of information used from available context</li>
  <li>Ability to identify and incorporate all relevant details</li>
  <li>Coverage of multiple relevant aspects in the response</li>
</ul>
<p>Poor context recall might result in incomplete answers that miss important details present in the context.</p>

<h3>Faithfulness</h3>
<p>Assesses how accurately the model's response aligns with the facts presented in the provided context, without introducing unsubstantiated information. Faithful responses stick strictly to what can be inferred from the given context. Evaluation approaches include:</p>
<ul>
  <li>Identifying statements in the response that cannot be verified by the context</li>
  <li>Measuring the rate of hallucinated or fabricated details</li>
  <li>Analyzing semantic consistency between the response and context</li>
</ul>
<p>Faithfulness is particularly crucial for applications like summarization, question answering, and information retrieval where trustworthiness is essential.</p>

<h3>Answer Relevancy</h3>
<p>Determines how well the model's response addresses the specific question or task posed by the user. Highly relevant answers directly respond to the user's query without tangential information. Key considerations include:</p>
<ul>
  <li>Alignment between the query intent and response content</li>
  <li>Directness of the answer to the specific question asked</li>
  <li>Appropriate level of detail based on the query complexity</li>
</ul>
<p>Low answer relevancy might indicate that the model is generating responses that, while possibly accurate, don't actually address what the user was asking about.</p>

<h3>Toxicity</h3>
<p>Evaluates the model's tendency to generate harmful, offensive, or inappropriate content. Toxicity checks are crucial for ensuring safe deployment. Common approaches include:</p>
<ul>
  <li>Content policy violation detection</li>
  <li>Hate speech and offensive language metrics</li>
  <li>Safety classifiers</li>
</ul>

<h3>Robustness</h3>
<p>Tests how consistently a model performs when inputs are slightly modified or when presented with adversarial examples. Strong models maintain performance despite input variations. Measurement involves:</p>
<ul>
  <li>Performance under input perturbations</li>
  <li>Consistency across paraphrased queries</li>
  <li>Resistance to prompt injection and jailbreaking attempts</li>
</ul>

<h3>Fairness and Bias</h3>
<p>Examines whether model outputs show systematic differences across demographic groups or perpetuate stereotypes. Bias evaluation helps ensure models don't discriminate. Key metrics include:</p>
<ul>
  <li>Disparate performance across groups</li>
  <li>Stereotype reinforcement measurement</li>
  <li>Representation balance in generated content</li>
</ul>

<h3>Reasoning and Problem-solving</h3>
<p>Evaluates a model's ability to follow logical steps, solve complex problems, and demonstrate understanding. This often involves:</p>
<ul>
  <li>Multi-step reasoning tasks</li>
  <li>Mathematical problem solving</li>
  <li>Chain-of-thought evaluation</li>
</ul>

<h2>Conclusion</h2>
<p>LLM evaluation is an evolving field, with new frameworks and metrics constantly being developed to keep pace with rapidly improving models. As language models continue to advance in capabilities and find new applications, robust evaluation becomes increasingly critical to ensure they perform reliably, safely, and ethically.</p>
<p>Organizations developing or deploying language models should invest in comprehensive evaluation strategies that address the full spectrum of potential risks and performance requirements. By combining established frameworks with custom evaluations tailored to specific use cases, we can better ensure that language models deliver on their promise while minimizing potential harms.</p>
`;

      // Verify that all critical metrics are included in the content
      const contentLower = llmEvalsContent.toLowerCase();
      const missingMetrics = criticalEvalMetrics.filter(metric => 
        !contentLower.includes(metric.toLowerCase())
      );
      
      // If any critical metrics are missing, add them to the content
      if (missingMetrics.length > 0) {
        console.warn(`Adding missing critical metrics: ${missingMetrics.join(', ')}`);
        let metricsSection = `<h2>Additional Critical Evaluation Metrics</h2>`;
        
        if (!contentLower.includes("context precision")) {
          metricsSection += `
<h3>Context Precision</h3>
<p>Measures how precisely the model uses the provided context when generating responses. High context precision indicates that the model is effectively using the most relevant parts of the available information. Key aspects include:</p>
<ul>
  <li>Ability to identify and extract relevant information from the context</li>
  <li>Avoidance of using irrelevant context that might lead to misleading answers</li>
  <li>Proper weighting of information based on its relevance to the query</li>
</ul>
<p>Low context precision might indicate that the model is using too much irrelevant information, which can dilute the quality of responses.</p>`;
        }
        
        if (!contentLower.includes("context recall")) {
          metricsSection += `
<h3>Context Recall</h3>
<p>Evaluates how comprehensively the model captures and utilizes all relevant information from the provided context. High context recall demonstrates that the model isn't missing crucial information when formulating its response. This involves measuring:</p>
<ul>
  <li>Completeness of information used from available context</li>
  <li>Ability to identify and incorporate all relevant details</li>
  <li>Coverage of multiple relevant aspects in the response</li>
</ul>
<p>Poor context recall might result in incomplete answers that miss important details present in the context.</p>`;
        }
        
        if (!contentLower.includes("faithfulness")) {
          metricsSection += `
<h3>Faithfulness</h3>
<p>Assesses how accurately the model's response aligns with the facts presented in the provided context, without introducing unsubstantiated information. Faithful responses stick strictly to what can be inferred from the given context. Evaluation approaches include:</p>
<ul>
  <li>Identifying statements in the response that cannot be verified by the context</li>
  <li>Measuring the rate of hallucinated or fabricated details</li>
  <li>Analyzing semantic consistency between the response and context</li>
</ul>
<p>Faithfulness is particularly crucial for applications like summarization, question answering, and information retrieval where trustworthiness is essential.</p>`;
        }
        
        if (!contentLower.includes("answer relevancy")) {
          metricsSection += `
<h3>Answer Relevancy</h3>
<p>Determines how well the model's response addresses the specific question or task posed by the user. Highly relevant answers directly respond to the user's query without tangential information. Key considerations include:</p>
<ul>
  <li>Alignment between the query intent and response content</li>
  <li>Directness of the answer to the specific question asked</li>
  <li>Appropriate level of detail based on the query complexity</li>
</ul>
<p>Low answer relevancy might indicate that the model is generating responses that, while possibly accurate, don't actually address what the user was asking about.</p>`;
        }
        
        // Add the missing metrics before the conclusion
        if (missingMetrics.length > 0) {
          const conclusionIndex = llmEvalsContent.indexOf("<h2>Conclusion</h2>");
          if (conclusionIndex !== -1) {
            llmEvalsContent = 
              llmEvalsContent.substring(0, conclusionIndex) + 
              metricsSection + 
              llmEvalsContent.substring(conclusionIndex);
          } else {
            // If no conclusion, add to the end
            llmEvalsContent += metricsSection;
          }
        }
      }

      const newBlog = createBlogPost({
        title: "LLM Evals: A Comprehensive Guide to Evaluating Language Models",
        excerpt: "Explore the essential frameworks and metrics for evaluating Large Language Models (LLMs), understanding why robust evaluation matters, and how to prepare effective datasets for testing.",
        content: llmEvalsContent,
        author: "Aswin Bhaskaran",
        tags: ["AI", "Machine Learning", "LLM", "Evaluation", "NLP"],
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        category: "technology"
      });

      // Invalidate the blogs query to force a refetch
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      
      // Navigate to the newly created blog post
      toast.success("LLM Evals blog post created successfully!");
      navigate(`/portfolio/blogs/${newBlog.id}`);
    } else if (template === 'tax-agent-neo4j') {
      // Create the Tax Agent Neo4j blog post
      const taxAgentContent = `
<h2>Building a Tax Agent with Neo4j Graph Database Integration</h2>
<p>A comprehensive guide to creating an intelligent Tax Agent that leverages Neo4j graph database
for answering tax-related queries.</p>

<h2>Introduction to the Tax Agent System</h2>
<p>The Form 990 Filing Assistant is a specialized AI-powered agent designed to help users navigate 
the complexities of Form 990 filing requirements. At its core, the agent uses a Neo4j graph database 
to store and query tax-related information, combined with LangChain and OpenAI to process natural 
language queries and generate informative responses.</p>
<p>This guide provides a detailed breakdown of the code implementation for this Tax Agent, 
including connecting to Neo4j, creating vector indices, writing Cypher queries, and 
integrating these components into a cohesive agent system.</p>

<h2>Connecting to the Neo4j Graph Database</h2>
<p>The first step in building our Tax Agent is to establish a connection to the Neo4j graph database.
This connection allows us to store, retrieve, and query tax-related information efficiently.</p>

<pre>
import { Neo4jGraphDB } from "langchain/graphs/neo4j_graph";

// Neo4j connection setup
const neo4jGraph = new Neo4jGraphDB({
  url: process.env.NEO4J_URI || "bolt://localhost:7687",
  username: process.env.NEO4J_USERNAME || "neo4j",
  password: process.env.NEO4J_PASSWORD || "password",
  database: "neo4j",
});
</pre>

<p>Here, we're using LangChain's Neo4jGraphDB class to establish a connection to our Neo4j database. 
The connection details (URL, username, password) can be configured via environment variables or 
default to the provided values for local development. This connection instance will be used 
throughout our application to interact with the graph database.</p>

<h2>Setting Up Vector Indexing for Neo4j</h2>
<p>Vector indexing enables efficient similarity searches within our graph database. For our Tax Agent, 
this is crucial for retrieving relevant tax information based on natural language queries.</p>

<pre>
import { Neo4jVectorStore } from "langchain/vectorstores/neo4j_vector";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

// Vector store setup for Neo4j
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
);
</pre>

<p>In this code snippet, we're setting up a vector store using Neo4jVectorStore from LangChain. We're using 
OpenAI's embedding model to convert text into vector representations. The configuration includes:</p>

<ul>
  <li><strong>indexName</strong>: Name of the vector index in Neo4j ("tax_documents_vector_index")</li>
  <li><strong>keywordIndexName</strong>: Name of the keyword index ("tax_documents_keyword_index")</li>
  <li><strong>searchType</strong>: Set to "hybrid" to enable both vector similarity and keyword matching</li>
  <li><strong>nodeLabel</strong>: The label for nodes in the graph ("TaxDocument")</li>
  <li><strong>textNodeProperties</strong>: Node properties that contain text to be vectorized</li>
  <li><strong>embeddingNodeProperty</strong>: Property to store vector embeddings</li>
</ul>

<h2>Creating the Cypher Query Template</h2>
<p>Cypher is Neo4j's query language. For our Tax Agent, we create a template that helps convert natural language 
questions into structured Cypher queries that can be executed against the graph database.</p>

<pre>
import { PromptTemplate } from "langchain/prompts";
import { GraphCypherQAChain } from "langchain/chains/graph_qa/cypher";
import { ChatOpenAI } from "langchain/chat_models/openai";

// Cypher generation prompt
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
);
</pre>

<p>This PromptTemplate provides a structured way to generate Cypher queries from natural language questions. 
The template includes:</p>

<ul>
  <li>An overview of the expert role the model should adopt</li>
  <li>Detailed information about the graph schema (nodes, relationships, properties)</li>
  <li>Instructions for generating appropriate Cypher queries</li>
  <li>A placeholder for the user's question</li>
</ul>

<h2>Converting User Prompts to Cypher Queries</h2>
<p>With the prompt template in place, we can now implement the conversion from natural language questions 
to executable Cypher queries.</p>

<pre>
// OpenAI model setup
const llm = new ChatOpenAI({
  modelName: "gpt-4", // Using GPT-4 for better Cypher generation
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Creating the GraphCypherQAChain
const cypherChain = GraphCypherQAChain.fromLLM({
  llm: llm,
  graph: neo4jGraph,
  cypherPrompt: cypherPrompt,
  returnDirect: false, // Set to true to return the direct result from Neo4j
  returnIntermediateSteps: true, // Set to true to return the generated Cypher query
});
</pre>

<p>In this section, we:</p>

<ol>
  <li>Initialize a ChatOpenAI model instance with GPT-4 (configured for precise output with temperature=0)</li>
  <li>Create a GraphCypherQAChain that combines the language model, our Neo4j graph connection, and the Cypher prompt template</li>
  <li>Configure the chain to return both the final answer and the intermediate steps (including the generated Cypher query)</li>
</ol>

<h2>Integrating Tools into the Tax Agent</h2>
<p>Now we need to package our database querying capability as a tool that can be used by the agent.</p>

<pre>
import { AgentExecutor } from "langchain/agents";
import { Tool } from "langchain/agents";
import { AgentType, initialize_agent } from "langchain/agents";

// Creating tools for the agent
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
];
</pre>

<p>This code creates a tool called "GraphSearch" that will be used by our agent. The tool:</p>

<ul>
  <li>Takes a natural language question as input</li>
  <li>Passes the question to our cypherChain, which converts it to a Cypher query and executes it against Neo4j</li>
  <li>Logs the generated Cypher query for debugging purposes</li>
  <li>Returns the text result from the database query</li>
  <li>Includes error handling to provide a friendly message if the query fails</li>
</ul>

<h2>Creating and Initializing the Tax Agent</h2>
<p>Finally, we initialize the agent with the tools we've created. This agent will use OpenAI's function calling 
capability to determine when to use the GraphSearch tool.</p>

<pre>
// Initialize the agent with tools
const TaxAgent = initialize_agent(
  tools,
  new ChatOpenAI({ temperature: 0, modelName: "gpt-4" }),
  {
    agentType: AgentType.OPENAI_FUNCTIONS,
    verbose: true, // Set to true for detailed logging
  }
);

// Example of using the agent
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
};
</pre>

<p>In this final section, we:</p>

<ol>
  <li>Initialize the agent using LangChain's initialize_agent function</li>
  <li>Configure it to use OpenAI's function calling capability with AgentType.OPENAI_FUNCTIONS</li>
  <li>Enable verbose mode for detailed logging of the agent's thought process</li>
  <li>Create a helper function (runAgent) to invoke the agent with a user query</li>
  <li>Include proper error handling to ensure a graceful user experience</li>
</ol>

<h2>Conclusion</h2>
<p>By integrating Neo4j's graph database capabilities with the power of large language models, we've created 
a specialized Tax Agent that can understand and answer complex questions about Form 990 filings and tax data.
This approach allows for more nuanced and accurate responses by leveraging the structured relationships within 
the tax domain.</p>

<p>The agent's architecture is modular and can be adapted to other domains by replacing the graph schema and 
prompt templates with domain-specific knowledge.</p>
`;

      const newBlog = createBlogPost({
        title: "Building a Tax Agent with Neo4J GraphDB Integration",
        excerpt: "A comprehensive guide to creating an intelligent Tax Agent that leverages Neo4J GraphDB for answering tax-related queries with code examples for implementation.",
        content: taxAgentContent,
        author: "Aswin Bhaskaran",
        tags: ["Neo4J", "GraphDB", "Tax", "LangChain", "OpenAI"],
        image: "https://images.unsplash.com/photo-1616077168087-712f9c233d07?q=80&w=1280",
        category: "technology"
      });

      // Invalidate the blogs query to force a refetch
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      
      // Navigate to the newly created blog post
      toast.success("Tax Agent Neo4J GraphDB blog post created successfully!");
      navigate(`/portfolio/blogs/${newBlog.id}`);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-2">
        <Link to="/portfolio" className="text-muted-foreground hover:text-foreground flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Portfolio
        </Link>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-2">Blog</Badge>
          <h1 className="text-3xl font-display font-bold">My Blog Posts</h1>
          <p className="text-muted-foreground mt-1">
            Thoughts, insights, and expertise from abtechnet.com
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Presentation className="mr-2 h-4 w-4" />
                Templates
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => createTemplatePost('llm-evals')}>
                LLM Evals Presentation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => createTemplatePost('tax-agent-neo4j')}>
                Tax Agent Neo4j Presentation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/portfolio/blogs/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Post
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogHeader;
