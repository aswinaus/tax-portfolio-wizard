
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  FileSpreadsheet, 
  PieChart, 
  Settings, 
  Upload, 
  Download, 
  Info, 
  CheckSquare, 
  ChevronRight,
  FileQuestion,
  Globe,
  Filter,
  Search,
  ArrowRight,
  BarChart,
  LineChart,
  RefreshCw,
  Info as InfoIcon
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PieChart as RechartsSimplePieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { toast } from 'sonner';

// Sample data for analysis visualization
const industryComparison = [
  { name: 'Q1', company: 4.5, industry: 5.2, segment: 4.8 },
  { name: 'Q2', company: 5.2, industry: 5.7, segment: 5.5 },
  { name: 'Q3', company: 5.8, industry: 5.5, segment: 5.3 },
  { name: 'Q4', company: 6.0, industry: 5.8, segment: 5.9 },
];

const profitabilityData = [
  { name: 'Operating Margin', value: 18 },
  { name: 'Net Margin', value: 12 },
  { name: 'Return on Assets', value: 22 },
  { name: 'EBITDA Margin', value: 25 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Industry codes
const industryCodes = [
  { value: '31-33', label: 'Manufacturing' },
  { value: '42', label: 'Wholesale Trade' },
  { value: '44-45', label: 'Retail Trade' },
  { value: '51', label: 'Information' },
  { value: '52', label: 'Finance and Insurance' },
  { value: '54', label: 'Professional, Scientific, and Technical Services' },
];

// Company sizes
const companySizes = [
  { value: 'small', label: 'Small (< $10M revenue)' },
  { value: 'medium', label: 'Medium ($10M - $100M revenue)' },
  { value: 'large', label: 'Large ($100M - $1B revenue)' },
  { value: 'enterprise', label: 'Enterprise (> $1B revenue)' },
];

// Recent analyses
const recentAnalyses = [
  {
    id: 'analysis-1',
    name: 'Q4 2023 Benchmarking Analysis',
    date: '2023-12-15T14:45:00Z',
    industry: 'Manufacturing',
    entities: 3,
    status: 'complete'
  },
  {
    id: 'analysis-2',
    name: '2023 Annual Transfer Pricing Report',
    date: '2023-11-28T09:30:00Z',
    industry: 'Finance and Insurance',
    entities: 5,
    status: 'in_progress'
  }
];

const TransferPricing = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [industryFilter, setIndustryFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [loading, setLoading] = useState(false);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const handleStartAnalysis = () => {
    if (!industryFilter) {
      toast.error('Please select an industry first');
      return;
    }
    
    setLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      setActiveTab('results');
      toast.success('Benchmark analysis complete!');
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto"
    >
      <div className="mb-8">
        <Badge variant="outline" className="mb-2">Business</Badge>
        <h1 className="text-3xl font-display font-semibold">Transfer Pricing Benchmarking</h1>
        <p className="text-muted-foreground mt-1">
          Analyze and compare company profitability metrics against industry benchmarks
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto overflow-auto mb-6">
          <TabsTrigger value="dashboard" className="text-sm">Dashboard</TabsTrigger>
          <TabsTrigger value="benchmark" className="text-sm">New Benchmark</TabsTrigger>
          <TabsTrigger value="results" className="text-sm">Analysis Results</TabsTrigger>
          <TabsTrigger value="reports" className="text-sm">Reports</TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-primary" />
                  Recent Benchmarks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-display font-bold">{recentAnalyses.length}</div>
                <p className="text-sm text-muted-foreground">
                  Benchmarking analyses conducted in the last 90 days
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('reports')}>
                  View All Reports
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-display font-bold">62</div>
                <p className="text-sm text-muted-foreground">
                  Countries with available benchmarking data
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  View Coverage Map
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-primary" />
                  Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-display font-bold">14.2M</div>
                <p className="text-sm text-muted-foreground">
                  Company records available for comparison
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('benchmark')}>
                  New Benchmark
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-display font-medium">Recent Analyses</h2>
            
            {recentAnalyses.length > 0 ? (
              <div className="space-y-4">
                {recentAnalyses.map((analysis) => (
                  <Card key={analysis.id} className="border-border/60 hover:shadow-sm transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{analysis.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {formatDate(analysis.date)} • {analysis.industry} • {analysis.entities} entities
                          </CardDescription>
                        </div>
                        <Badge 
                          variant={analysis.status === 'complete' ? 'default' : 'outline'}
                          className={analysis.status === 'complete' ? 'bg-green-500 hover:bg-green-500/90' : ''}
                        >
                          {analysis.status === 'complete' ? 'Complete' : 'In Progress'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardFooter className="pt-2">
                      <Button variant="outline" size="sm" className="mr-2">
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Export
                      </Button>
                      <Button size="sm" onClick={() => setActiveTab('results')}>
                        <BarChart2 className="h-3.5 w-3.5 mr-1.5" />
                        View Analysis
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary/40 rounded-lg">
                <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No recent analyses</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You haven't conducted any benchmarking analyses yet. Create a new benchmark to get started.
                </p>
                <Button onClick={() => setActiveTab('benchmark')}>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Create New Benchmark
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* New Benchmark Tab */}
        <TabsContent value="benchmark" className="space-y-8">
          <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-base mb-1">About Benchmarking</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Transfer pricing benchmarking identifies comparable companies to establish an arm's length range for controlled transactions. This helps ensure compliance with tax regulations and minimize audit risk.
                </p>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                    <span>Select industry and filters to find comparable companies</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                    <span>Analyze profitability ratios and other financial metrics</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                    <span>Generate reports for documentation and compliance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-display font-medium">Configure Benchmark Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Selection Criteria */}
              <div className="space-y-6">
                <Card className="border-border/60">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Filter className="h-5 w-5 text-primary" />
                      Selection Criteria
                    </CardTitle>
                    <CardDescription>
                      Define parameters for comparable companies
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="analysis-name">Analysis Name</Label>
                      <Input id="analysis-name" placeholder="e.g., Q1 2024 Manufacturing Benchmark" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="industry-code">Industry</Label>
                      <Select value={industryFilter} onValueChange={setIndustryFilter}>
                        <SelectTrigger id="industry-code">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industryCodes.map((industry) => (
                            <SelectItem key={industry.value} value={industry.value}>
                              {industry.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company-size">Company Size</Label>
                      <Select value={sizeFilter} onValueChange={setSizeFilter}>
                        <SelectTrigger id="company-size">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          {companySizes.map((size) => (
                            <SelectItem key={size.value} value={size.value}>
                              {size.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Select>
                        <SelectTrigger id="region">
                          <SelectValue placeholder="All regions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="global">Global</SelectItem>
                          <SelectItem value="north-america">North America</SelectItem>
                          <SelectItem value="europe">Europe</SelectItem>
                          <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                          <SelectItem value="latin-america">Latin America</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time-period">Time Period</Label>
                      <Select>
                        <SelectTrigger id="time-period">
                          <SelectValue placeholder="Most recent fiscal year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recent">Most recent fiscal year</SelectItem>
                          <SelectItem value="3-year">3-year average</SelectItem>
                          <SelectItem value="5-year">5-year average</SelectItem>
                          <SelectItem value="custom">Custom period</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-border/60">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5 text-primary" />
                      Advanced Filters (Optional)
                    </CardTitle>
                    <CardDescription>
                      Further refine your comparable companies
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profitability">Profitability Indicators</Label>
                      <Select>
                        <SelectTrigger id="profitability">
                          <SelectValue placeholder="Operating Margin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="operating-margin">Operating Margin</SelectItem>
                          <SelectItem value="net-margin">Net Margin</SelectItem>
                          <SelectItem value="roa">Return on Assets</SelectItem>
                          <SelectItem value="berry">Berry Ratio</SelectItem>
                          <SelectItem value="cost-plus">Cost Plus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="independence">Independence Criteria</Label>
                      <Select>
                        <SelectTrigger id="independence">
                          <SelectValue placeholder="Include all companies" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Include all companies</SelectItem>
                          <SelectItem value="independent">Independent companies only</SelectItem>
                          <SelectItem value="listed">Publicly listed only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="functions">Key Functions</Label>
                      <Select>
                        <SelectTrigger id="functions">
                          <SelectValue placeholder="Select functions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="distribution">Distribution</SelectItem>
                          <SelectItem value="research">Research & Development</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="marketing">Marketing & Sales</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right Column - Company Data and Actions */}
              <div className="space-y-6">
                <Card className="border-border/60">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Upload className="h-5 w-5 text-primary" />
                      Your Company Data
                    </CardTitle>
                    <CardDescription>
                      Upload or enter your company data for comparison
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:bg-primary/5 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-primary/60 mb-2" />
                      <h3 className="text-sm font-medium mb-1">Upload Financial Data</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        Drag and drop your Excel or CSV file, or click to browse
                      </p>
                      <Button variant="outline" size="sm">Browse Files</Button>
                    </div>
                    
                    <Separator>
                      <span className="text-xs text-muted-foreground px-2">or enter manually</span>
                    </Separator>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="revenue">Revenue (USD)</Label>
                        <Input id="revenue" placeholder="0.00" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="operating-profit">Operating Profit (USD)</Label>
                        <Input id="operating-profit" placeholder="0.00" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="total-assets">Total Assets (USD)</Label>
                        <Input id="total-assets" placeholder="0.00" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="operating-expenses">Operating Expenses (USD)</Label>
                        <Input id="operating-expenses" placeholder="0.00" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-border/60">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Analysis Options
                    </CardTitle>
                    <CardDescription>
                      Configure your benchmark analysis settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="interquartile-range">Interquartile Range</Label>
                      <Select>
                        <SelectTrigger id="interquartile-range">
                          <SelectValue placeholder="Full range (0-100%)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full range (0-100%)</SelectItem>
                          <SelectItem value="interquartile">Interquartile range (25-75%)</SelectItem>
                          <SelectItem value="custom">Custom range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="report-format">Report Format</Label>
                      <Select>
                        <SelectTrigger id="report-format">
                          <SelectValue placeholder="Comprehensive (PDF + Excel)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="comprehensive">Comprehensive (PDF + Excel)</SelectItem>
                          <SelectItem value="pdf">PDF Report only</SelectItem>
                          <SelectItem value="excel">Excel Data only</SelectItem>
                          <SelectItem value="presentation">Presentation (PowerPoint)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      onClick={handleStartAnalysis}
                      className="w-full"
                      disabled={loading || !industryFilter}
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <BarChart2 className="mr-2 h-4 w-4" />
                          Run Benchmark Analysis
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Analysis Results Tab */}
        <TabsContent value="results" className="space-y-8">
          <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <Badge className="mb-2">Analysis Complete</Badge>
                <h2 className="text-xl font-display font-medium mb-1">
                  {industryFilter ? industryCodes.find(i => i.value === industryFilter)?.label : 'Manufacturing'} Benchmark Analysis
                </h2>
                <p className="text-sm text-muted-foreground">
                  42 comparable companies identified • Analysis date: {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
                <Button size="sm">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Metrics */}
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  Key Metrics
                </CardTitle>
                <CardDescription>
                  Statistical analysis of comparable companies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Operating Margin</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          5.8%
                        </Badge>
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                      </div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="flex h-full">
                        <div className="h-full bg-muted-foreground/30 w-[25%]"></div>
                        <div className="h-full bg-primary w-[50%]"></div>
                        <div className="h-full bg-muted-foreground/30 w-[25%]"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Min: 3.2%</span>
                      <span>Median: 5.5%</span>
                      <span>Max: 8.1%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Return on Assets</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          7.2%
                        </Badge>
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                      </div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="flex h-full">
                        <div className="h-full bg-muted-foreground/30 w-[25%]"></div>
                        <div className="h-full bg-primary w-[50%]"></div>
                        <div className="h-full bg-muted-foreground/30 w-[25%]"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Min: 4.8%</span>
                      <span>Median: 7.0%</span>
                      <span>Max: 9.5%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Berry Ratio</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          1.21
                        </Badge>
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                      </div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="flex h-full">
                        <div className="h-full bg-muted-foreground/30 w-[25%]"></div>
                        <div className="h-full bg-primary w-[50%]"></div>
                        <div className="h-full bg-muted-foreground/30 w-[25%]"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Min: 1.08</span>
                      <span>Median: 1.18</span>
                      <span>Max: 1.34</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Net Cost Plus</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          6.5%
                        </Badge>
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                      </div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="flex h-full">
                        <div className="h-full bg-muted-foreground/30 w-[25%]"></div>
                        <div className="h-full bg-primary w-[50%]"></div>
                        <div className="h-full bg-muted-foreground/30 w-[25%]"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Min: 4.1%</span>
                      <span>Median: 6.2%</span>
                      <span>Max: 8.7%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Industry Comparison */}
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  Industry Comparison
                </CardTitle>
                <CardDescription>
                  Your company vs. industry benchmarks
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={industryComparison}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="company" name="Your Company" fill="#0088FE" />
                    <Bar dataKey="industry" name="Industry Avg" fill="#00C49F" />
                    <Bar dataKey="segment" name="Market Segment" fill="#FFBB28" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Profitability Distribution */}
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Profitability Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown of profitability metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsSimplePieChart>
                    <Pie
                      data={profitabilityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {profitabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </RechartsSimplePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Compliance Assessment */}
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  Compliance Assessment
                </CardTitle>
                <CardDescription>
                  Transfer pricing compliance evaluation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Compliance:</span>
                  <Badge className="bg-green-500 hover:bg-green-500/90">Strong</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <CheckSquare className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Within Arm's Length Range</p>
                      <p className="text-xs text-muted-foreground">Your profitability indicators fall within the interquartile range of comparable companies.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <CheckSquare className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Documentation Support</p>
                      <p className="text-xs text-muted-foreground">This analysis provides strong support for transfer pricing documentation requirements.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <InfoIcon className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Consider Function Analysis</p>
                      <p className="text-xs text-muted-foreground">A detailed functional analysis may further strengthen your position.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <CheckSquare className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Defensible Position</p>
                      <p className="text-xs text-muted-foreground">Results indicate a defensible transfer pricing position for audit purposes.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setActiveTab('benchmark')}>
              <Settings className="mr-2 h-4 w-4" />
              Modify Analysis
            </Button>
            <Button>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Generate Full Report
            </Button>
          </div>
        </TabsContent>
        
        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-display font-medium">Saved Reports</h2>
              <p className="text-sm text-muted-foreground">
                Access your previously generated benchmark reports
              </p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search reports..." className="pl-10 w-64" />
              </div>
              <Button onClick={() => setActiveTab('benchmark')}>
                <BarChart2 className="mr-2 h-4 w-4" />
                New Analysis
              </Button>
            </div>
          </div>
          
          {recentAnalyses.length > 0 ? (
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <Card key={analysis.id} className="border-border/60 hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{analysis.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {formatDate(analysis.date)} • {analysis.industry} • {analysis.entities} entities
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={analysis.status === 'complete' ? 'default' : 'outline'}
                        className={analysis.status === 'complete' ? 'bg-green-500 hover:bg-green-500/90' : ''}
                      >
                        {analysis.status === 'complete' ? 'Complete' : 'In Progress'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <Button variant="outline" size="sm" className="mr-2">
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="mr-2">
                      <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />
                      View Report
                    </Button>
                    <Button size="sm" onClick={() => setActiveTab('results')}>
                      <BarChart2 className="h-3.5 w-3.5 mr-1.5" />
                      View Analysis
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <div className="text-center p-4 border border-dashed border-border rounded-lg mt-6">
                <p className="text-sm text-muted-foreground">
                  Looking for older reports? <Button variant="link" className="p-0 h-auto text-primary">View archive</Button>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-secondary/40 rounded-lg">
              <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No reports found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You haven't generated any benchmark reports yet. Create a new analysis to get started.
              </p>
              <Button onClick={() => setActiveTab('benchmark')}>
                <BarChart2 className="mr-2 h-4 w-4" />
                Create New Analysis
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default TransferPricing;
