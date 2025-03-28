
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, User, FileText, BarChart2, Folder } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 space-y-12">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center space-y-6"
        >
          <span className="inline-block px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
            Welcome to my Digital Space
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight">
            Portfolio & Business Tools
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore my portfolio, use specialized business tools for Form 990 submissions, 
            and access transfer pricing benchmarking resources.
          </p>
        </motion.div>
      </section>

      {/* My Forms Section */}
      <section className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-display font-medium flex items-center gap-2">
            <Folder className="h-6 w-6 text-primary" />
            My Forms
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Form 990
                </CardTitle>
                <CardDescription>
                  Tax-exempt organization income tax return
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground pb-3">
                Complete and submit your Form 990 tax forms to the IRS with our streamlined process.
              </CardContent>
              <CardFooter>
                <Link to="/business/form990" className="w-full">
                  <Button variant="outline" className="w-full group">
                    <span>Access Form</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Main Content Sections */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
        {/* Portfolio Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full overflow-hidden hover:shadow-md transition-shadow border-border/60">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-3">
                <User className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-display">My Portfolio</CardTitle>
              <CardDescription>
                Discover my professional journey, achievements, and writings
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Professional background and expertise</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Awards and achievements showcase</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Blog articles and thought leadership</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Github integration and project highlights</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link to="/portfolio" className="w-full">
                <Button variant="outline" className="w-full group">
                  <span>View Portfolio</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Form 990 Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full overflow-hidden hover:shadow-md transition-shadow border-border/60">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-display">Tax Form 990</CardTitle>
              <CardDescription>
                Complete and submit Tax Form 990 to the IRS with ease
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Step-by-step form completion</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Comprehensive form validation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Guided submission process</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Access to all Form 990 variants</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link to="/business/form990" className="w-full">
                <Button variant="outline" className="w-full group">
                  <span>Access Form 990</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Transfer Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full overflow-hidden hover:shadow-md transition-shadow border-border/60">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-3">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-display">Transfer Pricing</CardTitle>
              <CardDescription>
                Simplify the transfer pricing benchmarking process
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Data-driven benchmarking tools</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Comprehensive analysis framework</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Visual reporting and dashboards</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Compliance guidance and best practices</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link to="/business/transfer-pricing" className="w-full">
                <Button variant="outline" className="w-full group">
                  <span>Explore Transfer Pricing</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
