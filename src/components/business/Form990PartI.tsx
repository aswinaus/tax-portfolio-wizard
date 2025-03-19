
import { useState } from 'react';
import { 
  FileText, 
  AlertCircle, 
  Info,
  HelpCircle
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// Form schema validation using Zod
const formSchema = z.object({
  organizationName: z.string().min(1, "Organization name is required"),
  ein: z.string().min(9, "EIN must be at least 9 characters").max(10, "EIN must be at most 10 characters"),
  address: z.string().min(1, "Address is required"),
  room: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  website: z.string().url("Must be a valid URL").or(z.string().length(0)),
  nameOfOfficer: z.string().min(1, "Name of principal officer is required"),
  taxExemptStatus: z.enum(["501c3", "501c", "4947a1", "527"]),
  formOfOrganization: z.enum(["corporation", "trust", "association", "other"]),
  yearFormed: z.string()
    .refine(val => !isNaN(Number(val)) && val.length === 4, {
      message: "Year must be a 4-digit number",
    }),
  activityDescription: z.string().min(10, "Please provide a brief description of your organization's mission or most significant activities"),
  grossReceipts: z.string()
    .refine(val => !isNaN(Number(val.replace(/,/g, ''))), {
      message: "Must be a valid number",
    }),
  netAssets: z.string()
    .refine(val => !isNaN(Number(val.replace(/,/g, ''))), {
      message: "Must be a valid number",
    }),
});

type FormValues = z.infer<typeof formSchema>;

const Form990PartI = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      ein: "",
      address: "",
      room: "",
      city: "",
      state: "",
      zipCode: "",
      website: "",
      nameOfOfficer: "",
      taxExemptStatus: "501c3",
      formOfOrganization: "corporation",
      yearFormed: "",
      activityDescription: "",
      grossReceipts: "",
      netAssets: "",
    }
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    toast.success("Form data saved successfully!");
    // In a real application, this would save the data to a backend
  };

  return (
    <div className="mb-10">
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Form 990 Part I: Identification and Basic Information</CardTitle>
          </div>
          <CardDescription>
            Complete all required fields marked with an asterisk (*). This information will be used to identify your organization.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 mb-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Important Information</p>
                <p className="text-muted-foreground">
                  Part I of Form 990 includes basic organizational information and a summary of financial activities.
                  Ensure all information is accurate as this section is often reviewed by the public and the IRS.
                </p>
              </div>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Organization Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Organization Information</h3>
                
                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Official name as shown in organizing documents" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ein"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employer Identification Number (EIN) *</FormLabel>
                      <FormControl>
                        <Input placeholder="00-0000000" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your 9-digit EIN assigned by the IRS
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="Street number and name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="room"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room/Suite</FormLabel>
                        <FormControl>
                          <Input placeholder="Room or suite number (if applicable)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State *</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="ZIP Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.org" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="nameOfOfficer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name of Principal Officer *</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name of principal officer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Tax-Exempt Status Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tax-Exempt Status</h3>
                
                <FormField
                  control={form.control}
                  name="taxExemptStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax-Exempt Status *</FormLabel>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="501c3"
                            value="501c3"
                            checked={field.value === "501c3"}
                            onChange={() => field.onChange("501c3")}
                            className="h-4 w-4 rounded-full border-gray-300"
                          />
                          <label htmlFor="501c3" className="text-sm">
                            501(c)(3) exempt organization
                          </label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="501c"
                            value="501c"
                            checked={field.value === "501c"}
                            onChange={() => field.onChange("501c")}
                            className="h-4 w-4 rounded-full border-gray-300"
                          />
                          <label htmlFor="501c" className="text-sm">
                            Other 501(c) organization
                          </label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="4947a1"
                            value="4947a1"
                            checked={field.value === "4947a1"}
                            onChange={() => field.onChange("4947a1")}
                            className="h-4 w-4 rounded-full border-gray-300"
                          />
                          <label htmlFor="4947a1" className="text-sm">
                            4947(a)(1) trust
                          </label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="527"
                            value="527"
                            checked={field.value === "527"}
                            onChange={() => field.onChange("527")}
                            className="h-4 w-4 rounded-full border-gray-300"
                          />
                          <label htmlFor="527" className="text-sm">
                            527 political organization
                          </label>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Form of Organization Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Form of Organization</h3>
                
                <FormField
                  control={form.control}
                  name="formOfOrganization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Form of Organization *</FormLabel>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="corporation"
                            value="corporation"
                            checked={field.value === "corporation"}
                            onChange={() => field.onChange("corporation")}
                            className="h-4 w-4 rounded-full border-gray-300"
                          />
                          <label htmlFor="corporation" className="text-sm">
                            Corporation
                          </label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="trust"
                            value="trust"
                            checked={field.value === "trust"}
                            onChange={() => field.onChange("trust")}
                            className="h-4 w-4 rounded-full border-gray-300"
                          />
                          <label htmlFor="trust" className="text-sm">
                            Trust
                          </label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="association"
                            value="association"
                            checked={field.value === "association"}
                            onChange={() => field.onChange("association")}
                            className="h-4 w-4 rounded-full border-gray-300"
                          />
                          <label htmlFor="association" className="text-sm">
                            Association
                          </label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="other"
                            value="other"
                            checked={field.value === "other"}
                            onChange={() => field.onChange("other")}
                            className="h-4 w-4 rounded-full border-gray-300"
                          />
                          <label htmlFor="other" className="text-sm">
                            Other
                          </label>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="yearFormed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Formation *</FormLabel>
                      <FormControl>
                        <Input placeholder="YYYY" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the 4-digit year when your organization was formed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Activities and Financial Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Activities and Financial Information</h3>
                
                <FormField
                  control={form.control}
                  name="activityDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Briefly describe the organization's mission or most significant activities *
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the organization's mission or most significant activities" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="grossReceipts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gross Receipts for Tax Year *</FormLabel>
                        <FormControl>
                          <Input placeholder="$" {...field} />
                        </FormControl>
                        <FormDescription>
                          Total revenue for the tax year
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="netAssets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Net Assets or Fund Balances at End of Year *</FormLabel>
                        <FormControl>
                          <Input placeholder="$" {...field} />
                        </FormControl>
                        <FormDescription>
                          Total assets minus total liabilities
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline">
                    Save as Draft
                  </Button>
                  <Button type="submit">
                    Save and Continue
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Form990PartI;
