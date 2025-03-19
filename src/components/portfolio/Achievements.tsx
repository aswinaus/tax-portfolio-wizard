
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Achievements data
const achievements = [
  {
    id: 1,
    title: 'Excellence in Innovation Award',
    organization: 'Tech Innovators Association',
    year: 2023,
    description: 'Recognized for outstanding contributions to technological innovation in the field of data science.'
  },
  {
    id: 2,
    title: 'Leadership Recognition',
    organization: 'Business Leaders Forum',
    year: 2022,
    description: 'Awarded for exemplary leadership in digital transformation initiatives.'
  },
  {
    id: 3,
    title: 'Project Management Professional (PMP)',
    organization: 'Project Management Institute',
    year: 2021,
    description: 'Obtained professional certification for project management excellence.'
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
                  <Award className="h-6 w-6 text-primary" />
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
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Achievements;
