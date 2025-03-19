
import { motion } from 'framer-motion';
import { Award, Trophy, BadgeCheck, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Achievements data
const achievements = [
  {
    id: 1,
    title: 'Hexaware High Performers Club 2021-2022',
    organization: 'Hexaware Technologies',
    year: 'December 2021',
    description: 'Recognized as a top performer for outstanding contributions and excellence in performance.',
    icon: Star
  },
  {
    id: 2,
    title: 'Winner of Hackathon - Hexaware North America',
    organization: 'Hexaware Technologies',
    year: 'October 2018',
    description: 'Designed and architected a cloud solution utilizing machine learning algorithms to detect anomalies in the Tax Form990 dataset. This solution has been implemented to validate business rules for 990 Tax Forms.',
    links: [
      {
        text: 'Case Study',
        url: 'https://hexaware.com/case-study/intelligent-automated-platform-for-hassle-free-compliance-process/'
      },
      {
        text: 'Project Details',
        url: 'http://abtechnet.com/Azure/AzureLogicApps.html'
      }
    ],
    icon: Trophy
  },
  {
    id: 3,
    title: 'Certificate of Recognition',
    organization: 'Hexaware Technologies',
    year: 'September 2018',
    description: 'Awarded for distinguished talent and outstanding performance for the year 2017-2018.',
    icon: BadgeCheck
  },
  {
    id: 4,
    title: 'Winner of Hexaware BrainBox Trophy',
    organization: 'Hexaware Technologies',
    year: 'September 2015',
    description: 'Recognized for excellence in providing value-added solutions that saved effort/cost and introduced best practices/innovative solutions as enablers for customer business practices. Selected as one of the best Value Adds on a quarterly basis based on usage across Hexaware and measurable savings.',
    icon: Award
  }
];

const Achievements = () => {
  return (
    <section>
      <h2 className="text-2xl font-display font-semibold mb-6">Awards & Recognitions</h2>
      
      <div className="space-y-6">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-border/60">
              <CardHeader className="pb-3 flex flex-row items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center flex-shrink-0">
                  {achievement.icon && <achievement.icon className="h-6 w-6 text-primary" />}
                </div>
                <div>
                  <CardTitle className="text-xl">{achievement.title}</CardTitle>
                  <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                    <span>{achievement.organization}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{achievement.year}</span>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{achievement.description}</p>
                
                {achievement.links && achievement.links.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {achievement.links.map((link, i) => (
                      <a 
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:text-primary/80 underline underline-offset-4"
                      >
                        {link.text} →
                      </a>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Achievements;
