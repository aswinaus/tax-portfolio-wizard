
import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Certifications data
const certifications = [
  {
    id: 1,
    title: 'Certified Public Accountant (CPA)',
    organization: 'American Institute of CPAs',
    year: 2015,
    description: 'Licensed CPA with expertise in tax accounting and financial reporting.'
  },
  {
    id: 2,
    title: 'Chartered Financial Analyst (CFA)',
    organization: 'CFA Institute',
    year: 2017,
    description: 'Designation focused on investment analysis, portfolio management, and advanced financial concepts.'
  },
  {
    id: 3,
    title: 'Certified Information Systems Auditor (CISA)',
    organization: 'ISACA',
    year: 2019,
    description: 'Specialization in information systems auditing, control, and security.'
  }
];

const Certifications = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-display font-semibold">Professional Certifications</h2>
      
      <div className="space-y-4">
        {certifications.map((certification, index) => (
          <motion.div
            key={certification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-border/60">
              <CardHeader className="pb-3 flex flex-row items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center flex-shrink-0">
                  <BadgeCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{certification.title}</CardTitle>
                  <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                    <span>{certification.organization}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{certification.year}</span>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{certification.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Certifications;
