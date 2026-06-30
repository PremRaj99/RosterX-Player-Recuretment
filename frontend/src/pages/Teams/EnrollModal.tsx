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
import { type TeamSummary } from './TeamCard';

interface EnrollModalProps {
  team: TeamSummary | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EnrollModal({ team, isOpen, onClose }: EnrollModalProps) {
  const enrollMutation = useMutation({
    mutationFn: async (teamId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Enrolled in talent pool for team: ${teamId}`);
      return true;
    },
    onSuccess: () => {
      onClose();
      // Trigger success toast here in production
    },
  });

  const handleEnroll = () => {
    if (team) enrollMutation.mutate(team.id);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !enrollMutation.isPending) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-card border-border rounded-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight uppercase">
            Join Talent Pool
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            You are submitting your RosterX player profile to{' '}
            <strong className="text-foreground">{team?.name}</strong>. If they open a position
            matching your roles, they will contact you directly.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={enrollMutation.isPending}
            className="border-border w-full rounded-sm text-xs font-bold tracking-widest uppercase sm:w-auto"
          >
            CANCEL
          </Button>
          <Button
            onClick={handleEnroll}
            disabled={enrollMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-sm text-xs font-bold tracking-widest uppercase sm:w-auto"
          >
            {enrollMutation.isPending ? 'SUBMITTING...' : 'CONFIRM ENROLLMENT'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
