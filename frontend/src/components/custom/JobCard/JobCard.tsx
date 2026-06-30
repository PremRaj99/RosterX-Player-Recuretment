import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export interface Job {
  id: string;
  orgName: string;
  game: string;
  roles: string[];
  description: string;
  postedAt: string;
}

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, borderColor: '#F5410A' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-card border-border flex flex-col rounded-sm border p-5 transition-colors md:p-6"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-secondary border-border flex h-12 w-12 items-center justify-center rounded-sm border">
            <Shield className="text-muted-foreground h-6 w-6" />
          </div>
          <div>
            <h3 className="text-foreground text-lg font-bold tracking-tight">{job.orgName}</h3>
            <p className="text-muted-foreground text-sm font-medium">{job.game}</p>
          </div>
        </div>
        <span className="text-muted-foreground bg-secondary rounded-sm px-2 py-1 text-xs font-semibold">
          {job.postedAt}
        </span>
      </div>

      <p className="text-muted-foreground mb-6 line-clamp-2 flex-1 text-sm">{job.description}</p>

      <div className="mt-auto flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {job.roles.map((role) => (
            <span
              key={role}
              className="text-primary-foreground bg-secondary border-border rounded-sm border px-2.5 py-1 text-xs font-bold tracking-wide"
            >
              {role}
            </span>
          ))}
        </div>
        <Button
          onClick={() => onApply(job)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-sm font-bold tracking-wide shadow-none sm:w-auto"
        >
          QUICK APPLY
        </Button>
      </div>
    </motion.div>
  );
}
