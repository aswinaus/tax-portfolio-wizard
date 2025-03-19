
import { motion } from 'framer-motion';
import { BadgeCheck, BookOpen, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Certifications data
const certifications = [
  {
    id: 1,
    title: 'Reinforcement Learning From Human Feedback',
    organization: 'learn.deeplearning.ai',
    year: 'February 2024',
    description: 'Completed training in Reinforcement Learning From Human Feedback techniques.',
    credentialUrl: 'https://www.linkedin.com/posts/aswin-bhaskaran-39624a13_aswin-bhaskaran-congratulations-on-completing-activity-7298172024466669568-1sPB?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAK0kaIBF-Oh8fcp-MRi-MUW_nnw2axojIg'
  },
  {
    id: 2,
    title: 'Learn AI Agents',
    organization: 'Coursera',
    year: 'December 2024',
    description: 'Credential ID: US2Z0ACMYRLE',
    credentialUrl: 'https://www.coursera.org/account/accomplishments/records/US2Z0ACMYRLE'
  },
  {
    id: 3,
    title: 'Risk Management Framework for Systems and Organizations',
    organization: 'National Institute of Standards and Technology (NIST)',
    year: 'October 2024',
    description: 'Training in implementing the Risk Management Framework for Systems and Organizations.'
  },
  {
    id: 4,
    title: 'Payment Technology Fundamentals',
    organization: 'Corporate Finance Institute® (CFI)',
    year: 'August 2024',
    description: 'Credential ID: 114163005',
    credentialUrl: 'http://credentials.corporatefinanceinstitute.com/e3cf08d5-4b3d-4425-a5ba-95d65dcc5f20'
  },
  {
    id: 5,
    title: 'Cypher Fundamentals',
    organization: 'neo4j GraphAcademy',
    year: 'December 2023',
    description: 'Certificate ID: 070ec344-53ba-4969-9c7b-8157b3736103'
  },
  {
    id: 6,
    title: 'Certified Information Systems Security Professional (Online Self-Paced)',
    organization: 'ISC2 - Certificate of Course Completion',
    year: 'August 2022',
    description: 'Completed training for the CISSP certification program.',
    credentialUrl: 'https://www.linkedin.com/posts/aswin-bhaskaran-39624a13_activity-6964451739668291584-XKiG?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAK0kaIBF-Oh8fcp-MRi-MUW_nnw2axojIg'
  }
];

const Certifications = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-display font-semibold text-teal-600">Professional Certifications</h2>
      
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
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <BadgeCheck className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-teal-700">{certification.title}</CardTitle>
                  <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                    <span>{certification.organization}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{certification.year}</span>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-teal-600">{certification.description}</p>
                {certification.credentialUrl && (
                  <a 
                    href={certification.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm text-teal-600 hover:text-teal-800 underline underline-offset-4"
                  >
                    View Credential →
                  </a>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Certifications;
