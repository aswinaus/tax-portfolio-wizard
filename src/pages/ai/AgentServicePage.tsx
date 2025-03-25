
import { motion } from 'framer-motion';
import { Bot, Workflow, Zap, MessagesSquare, Sparkles, ArrowRight, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LyzrAgentChat from '@/components/business/LyzrAgentChat';

const AgentServicePage = () => {
  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold tracking-tight mb-2">
            Agent as a Service
          </h1>
          <p className="text-muted-foreground">
            Discover AI agents that can handle tasks and workflows autonomously
          </p>
        </div>

        {/* Form 990 Tax Assistant Featured Card */}
        <Card className="bg-primary/5 border-primary/10 mb-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-10 w-10 text-primary" />
              <div>
                <CardTitle className="text-xl">Form 990 Tax Filing Assistant</CardTitle>
                <CardDescription className="text-base">
                  Our specialized agent for tax filing assistance
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The Form 990 Tax Filing Assistant helps nonprofits navigate the complexities of IRS Form 990 filings.
              Ask questions about filing requirements, deadlines, extensions, and get step-by-step guidance.
            </p>
            
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="chat" className="text-sm">Chat with Agent</TabsTrigger>
                <TabsTrigger value="features" className="text-sm">Features</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="space-y-4">
                <div className="h-[500px]">
                  <LyzrAgentChat />
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card rounded-lg p-4 border">
                    <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" /> Filing Requirements
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Get clear guidance on which Form 990 version your organization needs to file.
                    </p>
                  </div>
                  
                  <div className="bg-card rounded-lg p-4 border">
                    <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" /> Deadline Management
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Stay informed about filing deadlines and extension opportunities.
                    </p>
                  </div>
                  
                  <div className="bg-card rounded-lg p-4 border">
                    <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" /> Documentation Guidance
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Learn which documents and records you need to prepare for accurate filing.
                    </p>
                  </div>
                  
                  <div className="bg-card rounded-lg p-4 border">
                    <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" /> Compliance Assistance
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Get help ensuring your organization meets all IRS compliance requirements.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <div className="flex justify-between items-center w-full">
              <Badge variant="outline" className="text-primary border-primary/30">
                Available Now
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <a href="/business/form990">
                  Form 990 Filing Page <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <Bot className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Specialized Agents</CardTitle>
              <CardDescription>
                Purpose-built AI assistants for specific domains and tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>Form 990 filing assistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>Transfer pricing documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>LLM safety and security advisors</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Badge variant="outline" className="text-primary border-primary/30">
                Coming Soon
              </Badge>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <Workflow className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Workflow Automation</CardTitle>
              <CardDescription>
                Automate repetitive tasks with intelligent agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>Document processing pipelines</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>Multi-step data analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>Report generation and distribution</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Badge variant="outline" className="text-primary border-primary/30">
                Coming Soon
              </Badge>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <MessagesSquare className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Conversational AI</CardTitle>
              <CardDescription>
                Natural language interfaces for complex systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>Contextual knowledge bases</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>Integration with enterprise systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>Multi-turn reasoning capabilities</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Badge variant="outline" className="text-primary border-primary/30">
                Coming Soon
              </Badge>
            </CardFooter>
          </Card>
        </div>
        
        <Separator className="my-16" />
        
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-display font-semibold">How It Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-primary/10 text-primary font-semibold rounded-full w-8 h-8 flex items-center justify-center mb-4">1</div>
              <h3 className="text-lg font-medium mb-2">Define Your Needs</h3>
              <p className="text-muted-foreground text-sm">
                Specify the tasks, knowledge domains, and integration points for your custom AI agent.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-primary/10 text-primary font-semibold rounded-full w-8 h-8 flex items-center justify-center mb-4">2</div>
              <h3 className="text-lg font-medium mb-2">Configure & Deploy</h3>
              <p className="text-muted-foreground text-sm">
                We'll build, test, and deploy your agent with the right capabilities and safeguards.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-primary/10 text-primary font-semibold rounded-full w-8 h-8 flex items-center justify-center mb-4">3</div>
              <h3 className="text-lg font-medium mb-2">Continuous Improvement</h3>
              <p className="text-muted-foreground text-sm">
                Your agent learns and improves over time based on feedback and new requirements.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-secondary/30 p-8 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Ready to get started?</h3>
            <p className="text-muted-foreground">
              Contact us to discuss how our AI agents can transform your business processes.
            </p>
          </div>
          <Button size="lg" className="whitespace-nowrap">
            Contact Sales
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AgentServicePage;
