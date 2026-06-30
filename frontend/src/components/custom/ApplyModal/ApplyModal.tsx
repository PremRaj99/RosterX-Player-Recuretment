import { useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Job } from '../JobCard/JobCard';

interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyModal({ job, isOpen, onClose }: ApplyModalProps) {
  const applyMutation = useMutation({
    mutationFn: async (jobId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Applied to job: ${jobId}`);
      return true;
    },
    onSuccess: () => {
      onClose();
      // In a real app, you'd trigger a toast notification here
    },
  });

  const handleApply = () => {
    if (job) applyMutation.mutate(job.id);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !applyMutation.isPending) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-card border-border rounded-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Confirm Application
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            You are applying to <strong className="text-foreground">{job?.orgName}</strong>. Your
            RosterX player profile, stats, and contact info will be shared with the organization.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-secondary border-border my-4 rounded-sm border p-3">
          <p className="text-sm font-semibold">Roles requested:</p>
          <p className="text-primary mt-1 text-sm">{job?.roles.join(', ')}</p>
        </div>

        <DialogFooter className="mt-2 flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={applyMutation.isPending}
            className="border-border w-full rounded-sm font-semibold sm:w-auto"
          >
            CANCEL
          </Button>
          <Button
            onClick={handleApply}
            disabled={applyMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-sm font-semibold sm:w-auto"
          >
            {applyMutation.isPending ? 'SUBMITTING...' : 'CONFIRM & APPLY'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
