
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Import refactored components
import FormTypes from '@/components/business/form990/FormTypes';
import MyForms from '@/components/business/form990/MyForms';
import FormFill from '@/components/business/form990/FormFill';
import HelpResources from '@/components/business/form990/HelpResources';
import ChatAssistant from '@/components/business/form990/ChatAssistant';
import FloatingChat from '@/components/business/form990/FloatingChat';

const Form990 = () => {
  const [selectedFormType, setSelectedFormType] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  // Count of pending submissions (in a real app, this would come from an API)
  const pendingSubmissionsCount = 2;
  
  const handleCreateForm = () => {
    if (!selectedFormType) {
      toast.error('Please select a form type first');
      return;
    }
    
    toast.success(`Starting new Form ${selectedFormType} filing`);
    setShowForm(true);
    // In a real app, this would redirect to the form editor
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto"
    >
      <div className="mb-4">
        <Badge variant="outline" className="mb-2">Business</Badge>
        <h1 className="text-3xl font-display font-semibold">Tax Form 990 Filing</h1>
        <p className="text-muted-foreground mt-1">
          Complete and submit your Form 990 tax forms to the IRS
        </p>
      </div>
      
      {pendingSubmissionsCount > 0 && (
        <Alert variant="warning" className="mb-6 border-amber-200 bg-amber-50 text-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Attention Required</AlertTitle>
          <AlertDescription>
            You have {pendingSubmissionsCount} form{pendingSubmissionsCount !== 1 ? 's' : ''} pending submission to the IRS. 
            Please review and submit them before their due dates.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Floating AI Assistant component */}
      <FloatingChat />
      
      <Tabs defaultValue={showForm ? "fill" : "forms"} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="forms" className="text-sm">
            My Forms
            {pendingSubmissionsCount > 0 && (
              <Badge variant="outline" className="ml-2 bg-amber-500/10 text-amber-700 border-amber-200">
                {pendingSubmissionsCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="create" className="text-sm">Create New Form</TabsTrigger>
          <TabsTrigger value="fill" className="text-sm">Fill Form</TabsTrigger>
          <TabsTrigger value="help" className="text-sm">Help & Resources</TabsTrigger>
          <TabsTrigger value="assistant" className="text-sm">AI Assistant</TabsTrigger>
        </TabsList>
        
        {/* My Forms Tab */}
        <TabsContent value="forms" className="space-y-6">
          <MyForms />
        </TabsContent>
        
        {/* Create New Form Tab */}
        <TabsContent value="create" className="space-y-8">
          <FormTypes 
            selectedFormType={selectedFormType} 
            setSelectedFormType={setSelectedFormType}
            handleCreateForm={handleCreateForm}
          />
        </TabsContent>
        
        {/* Fill Form Tab */}
        <TabsContent value="fill" className="space-y-6">
          <FormFill showForm={showForm} />
        </TabsContent>
        
        {/* Help & Resources Tab */}
        <TabsContent value="help" className="space-y-8">
          <HelpResources />
        </TabsContent>
        
        {/* AI Assistant Tab */}
        <TabsContent value="assistant" className="space-y-6">
          <ChatAssistant />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Form990;
