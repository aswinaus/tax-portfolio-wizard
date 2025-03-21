import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, X, Image as ImageIcon, Tag as TagIcon, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { createBlogPost } from '@/services/blogService';
import { useQueryClient } from '@tanstack/react-query';

const CreateBlog = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isLLMEvalsTemplate, setIsLLMEvalsTemplate] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/portfolio/blogs/create') && window.location.search.includes('template=llm-evals')) {
      populateLLMEvalsTemplate();
      setIsLLMEvalsTemplate(true);
    }
  }, []);

  const populateLLMEvalsTemplate = () => {
    setTitle("LLM Evals: A Comprehensive Guide to Evaluating Language Models");
    setExcerpt("Explore the essential frameworks and metrics for evaluating Large Language Models (LLMs), understanding why robust evaluation matters, and how to prepare effective datasets for testing.");
    setTags(["AI", "Machine Learning", "LLM", "Evaluation", "NLP"]);
    setImageUrl("https://images.unsplash.com/photo-1518770660439-4636190af475");
    
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
    
    setContent(llmEvalsContent);
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title for your blog post');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please enter content for your blog post');
      return;
    }
    
    const newBlog = createBlogPost({
      title,
      excerpt,
      content,
      author: "Aswin Bhaskaran",
      tags,
      image: imageUrl,
      category: "technology"
    });
    
    queryClient.invalidateQueries({ queryKey: ['blogs'] });
    
    toast.success('Blog post created successfully!');
    navigate('/portfolio/blogs');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="container max-w-4xl mx-auto px-4 py-8"
    >
      <div className="flex items-center justify-between mb-8">
        <Link to="/portfolio/blogs" className="text-muted-foreground hover:text-foreground flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Blogs
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Create New Blog Post</h1>
        <p className="text-muted-foreground mt-1">
          Share your thoughts, insights, and expertise
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter a descriptive title for your blog post"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="excerpt">
            Excerpt <span className="text-muted-foreground text-xs">(Brief summary)</span>
          </Label>
          <Textarea
            id="excerpt"
            placeholder="Write a short summary of your blog post (appears in blog listings)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="w-full resize-none"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Write your blog content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            You can use HTML tags to format your content. For example, &lt;h2&gt; for headings, &lt;p&gt; for paragraphs, &lt;ul&gt; and &lt;li&gt; for lists.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="imageUrl" className="flex items-center">
            <ImageIcon className="h-4 w-4 mr-2" /> 
            Featured Image URL
          </Label>
          <Input
            id="imageUrl"
            placeholder="Enter an image URL for the blog post (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full"
          />
          {imageUrl && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-2">Preview:</p>
              <div 
                className="w-full h-40 bg-cover bg-center rounded-md overflow-hidden"
                style={{ backgroundImage: `url(${imageUrl})` }}
              ></div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center">
            <TagIcon className="h-4 w-4 mr-2" /> 
            Tags
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add tags (press Enter to add)"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="outline"
              onClick={addTag}
              disabled={!currentTag.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1 pl-2">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-secondary-foreground/10"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {tags.length === 0 && (
              <span className="text-xs text-muted-foreground">
                No tags added yet. Tags help categorize your blog and make it more discoverable.
              </span>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/portfolio/blogs')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Publish Blog Post
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateBlog;

