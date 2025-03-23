
import { FC, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  User,
  Briefcase,
  Award,
  Github,
  FileText,
  BarChart2,
  Newspaper,
  BookOpen,
  ChevronDown,
  ArrowUpRight,
  BadgeCheck,
  Trophy,
  Folder,
  ChevronRight,
  Brain,
  Bot,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Sidebar item interface
interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive: boolean;
  external?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

// Sidebar section interface
interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
}

const SidebarItem: FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  to,
  isActive,
  external = false,
  onClick,
  children
}) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
      return;
    }
    
    if (external) return;
    
    e.preventDefault();
    
    if (to.includes('#')) {
      const [path, hash] = to.split('#');
      
      navigate(path);
      
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      navigate(to);
    }
  };
  
  const content = (
    <>
      <div 
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group w-full", 
          isActive 
            ? "bg-primary/10 text-primary hover:bg-primary/15" 
            : "hover:bg-secondary text-foreground/80 hover:text-foreground"
        )}
      >
        <Icon 
          size={18} 
          className={cn(
            "shrink-0",
            isActive ? "text-primary" : "text-foreground/70 group-hover:text-foreground"
          )} 
        />
        <span className="text-sm font-medium truncate flex-1">{label}</span>
        {external && <ArrowUpRight size={14} className="shrink-0 opacity-70" />}
      </div>
      {children}
    </>
  );

  if (external) {
    return (
      <a 
        href={to} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block"
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <a href={to} className="block" onClick={handleClick}>
      {content}
    </a>
  );
};

const SidebarSection: FC<SidebarSectionProps> = ({ title, children, collapsible = false }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  if (collapsible) {
    return (
      <div className="py-2">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="mb-2 px-3">
            <CollapsibleTrigger className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-foreground/50 hover:text-foreground/70 transition-colors">
              <h3>{title}</h3>
              {isOpen ? 
                <ChevronDown size={14} className="text-foreground/50" /> : 
                <ChevronRight size={14} className="text-foreground/50" />
              }
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="space-y-1">
              {children}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }
  
  return (
    <div className="py-2">
      <div className="mb-2 px-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
          {title}
        </h3>
      </div>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

export const MainSidebar: FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const hash = location.hash;

  return (
    <div className="flex flex-col h-full p-3">
      <div className="flex flex-col items-center justify-center py-6 space-y-2 border-b border-border mb-4">
        <div className="w-12 h-12 rounded-full glass flex items-center justify-center bg-primary/5">
          <User size={24} className="text-primary" />
        </div>
        <div className="text-center">
          <h1 className="font-display font-medium">Aswin Bhaskaran</h1>
          <p className="text-xs text-foreground/60">Portfolio & Business Tools</p>
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        <SidebarSection title="Portfolio" collapsible={true}>
          <SidebarItem 
            icon={User} 
            label="About Me" 
            to="/portfolio" 
            isActive={pathname === "/portfolio" && !hash} 
          />
          <SidebarItem 
            icon={Trophy} 
            label="Achievements" 
            to="/portfolio#achievements" 
            isActive={pathname === "/portfolio" && hash === "#achievements"} 
          />
          <SidebarItem 
            icon={BadgeCheck} 
            label="Certifications" 
            to="/portfolio#certifications" 
            isActive={pathname === "/portfolio" && hash === "#certifications"} 
          />
          <SidebarItem 
            icon={Newspaper} 
            label="Blogs" 
            to="/portfolio/blogs" 
            isActive={pathname.startsWith("/portfolio/blogs")} 
          />
          <SidebarItem 
            icon={Github} 
            label="GitHub Repos" 
            to="/portfolio#github" 
            isActive={pathname === "/portfolio" && hash === "#github"} 
          />
        </SidebarSection>

        <SidebarSection title="Business" collapsible={true}>
          <SidebarItem 
            icon={Folder} 
            label="My Documents Repository" 
            to="/" 
            isActive={pathname === "/"} 
          />
          <SidebarItem 
            icon={FileText} 
            label="Form 990" 
            to="/business/form990" 
            isActive={pathname === "/business/form990"} 
          />
          <SidebarItem 
            icon={BarChart2} 
            label="Transfer Pricing" 
            to="/business/transfer-pricing" 
            isActive={pathname === "/business/transfer-pricing"} 
          />
        </SidebarSection>
        
        {/* New AI Section */}
        <SidebarSection title="AI" collapsible={true}>
          <SidebarItem 
            icon={Bot} 
            label="Agent as a Service" 
            to="/ai/agent" 
            isActive={pathname === "/ai/agent"} 
          />
          <SidebarItem 
            icon={Wrench} 
            label="Tools as a Service" 
            to="/ai/tools" 
            isActive={pathname === "/ai/tools"} 
          />
        </SidebarSection>
      </div>

      <div className="mt-auto pt-4 border-t border-border">
        <div className="text-xs text-foreground/50 px-3 pb-2">
          &copy; {new Date().getFullYear()} Aswin Bhaskaran
        </div>
      </div>
    </div>
  );
};
