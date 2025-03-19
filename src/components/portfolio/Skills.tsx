
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

// Skills data
const skills = [
  { name: 'Web Development', category: 'technical' },
  { name: 'Data Analysis', category: 'technical' },
  { name: 'React', category: 'technical' },
  { name: 'Python', category: 'technical' },
  { name: 'TypeScript', category: 'technical' },
  { name: 'Project Management', category: 'soft' },
  { name: 'Leadership', category: 'soft' },
  { name: 'Strategic Planning', category: 'soft' },
  { name: 'Problem Solving', category: 'soft' },
  { name: 'Tax & Accounting', category: 'technical' },
  { name: 'Financial Analysis', category: 'technical' },
  { name: 'Business Strategy', category: 'soft' }
];

const Skills = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-display font-semibold">Skills & Expertise</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Badge 
              variant={skill.category === 'technical' ? 'default' : 'secondary'}
              className="py-1"
            >
              {skill.name}
            </Badge>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
