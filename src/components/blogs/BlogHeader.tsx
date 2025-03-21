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

  const createTemplatePost = (template: string) => {
    if (template === 'llm-evals') {
      // Create the LLM Evals blog post directly
      const llmEvalsContent = `
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
    } else if (template === 'owasp-llm') {
      // Use the existing OWASP blog post (ID 5) as a template
      // Navigate to the existing blog post
      toast.success("Navigating to the OWASP Top 10 for LLMs blog post!");
      navigate(`/portfolio/blogs/5`);
    } else if (template === 'reinforcement-learning') {
      // Use the existing Reinforcement Learning blog post (ID 6) as a template
      // Navigate to the existing blog post
      toast.success("Navigating to the Reinforcement Learning blog post!");
      navigate(`/portfolio/blogs/6`);
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
              <DropdownMenuItem onClick={() => createTemplatePost('owasp-llm')}>
                OWASP Top 10 for LLMs
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => createTemplatePost('reinforcement-learning')}>
                Reinforcement Learning & MDPs
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
