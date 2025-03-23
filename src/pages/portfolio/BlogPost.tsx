
import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Calendar, Clock, User, ArrowLeft, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { fetchBlogById } from '@/services/blogService';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Fetch specific blog post using React Query
  const { 
    data: blog, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => fetchBlogById(id!),
    enabled: !!id
  });

  // Special case for LLM Evals blog post (id: 5)
  const getLLMEvalsContent = () => {
    if (id === '5') {
      return `
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
    }
    return blog?.content || '';
  };
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const handleDelete = () => {
    // In a real app, this would make an API call to delete the blog
    toast.success("Blog post deleted successfully");
    navigate('/portfolio/blogs');
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-64 w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }
  
  // Error State
  if (isError || !blog) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-display font-semibold mb-4">Blog post not found</h2>
        <p className="text-muted-foreground mb-6">
          The blog post you're looking for doesn't exist or couldn't be loaded from abtechnet.com.
        </p>
        <Button asChild>
          <Link to="/portfolio/blogs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="container max-w-4xl mx-auto px-4 py-8"
    >
      {/* Back Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/portfolio/blogs" className="text-muted-foreground hover:text-foreground flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Blogs
        </Link>
        
        <div className="flex items-center gap-2">
          {blog.url && (
            <Button variant="outline" size="sm" asChild>
              <a href={blog.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                View Original
              </a>
            </Button>
          )}
          
          <Button variant="outline" size="sm" asChild>
            <Link to={`/portfolio/blogs/edit/${blog.id}`}>
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit
            </Link>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/10">
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the blog post 
                  and remove the data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      {/* Blog Header */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-3">
          {blog.tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
          {blog.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            {blog.author}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {formatDate(blog.date)}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            {blog.readTime}
          </div>
        </div>
      </div>
      
      {/* Featured Image */}
      {blog.image && (
        <div className="mb-8">
          <div 
            className="w-full h-64 md:h-96 bg-cover bg-center rounded-lg overflow-hidden shadow-md"
            style={{ backgroundImage: `url(${blog.image})` }}
          ></div>
        </div>
      )}
      
      {/* Blog Content */}
      <article className="prose prose-gray dark:prose-invert prose-headings:font-display prose-headings:font-semibold prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-a:text-primary hover:prose-a:text-primary/80 prose-a:transition-colors prose-img:rounded-md max-w-none mb-8">
        <div 
          dangerouslySetInnerHTML={{ __html: id === '5' ? getLLMEvalsContent() : blog.content }}
          className="blog-content"
        />
      </article>
      
      <Separator className="my-8" />
      
      {/* Author Section */}
      <div className="bg-secondary/30 rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start gap-4 mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center md:text-left">
          <h3 className="font-medium text-lg">About {blog.author}</h3>
          <p className="text-muted-foreground mt-2">
            Technology professional with expertise in software development and business solutions. 
            Passionate about sharing knowledge and insights on various technical and business topics.
          </p>
        </div>
      </div>
      
      {/* Next/Previous Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-12">
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link to="/portfolio/blogs" className="flex items-center justify-center">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to All Blogs
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default BlogPost;
