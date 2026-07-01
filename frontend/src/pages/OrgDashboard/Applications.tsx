import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BadgeCheck, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { userApi, orgApi, applicationApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

export default function OrgApplicationsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: userApi.getMe,
  });

  const org = user?.organizations?.[0];

  const { data: applications = [], isLoading: isLoadingApps } = useQuery({
    queryKey: ['orgApps', org?.id],
    queryFn: () => orgApi.getApplications(org.id),
    enabled: !!org?.id,
  });

  const decideMutation = useMutation({
    mutationFn: async (payload: { id: string; status: 'accepted' | 'rejected' }) => {
      return applicationApi.decide(payload.id, { status: payload.status });
    },
    onSuccess: (_, variables) => {
      toast.success(`Application has been ${variables.status}!`);
      queryClient.invalidateQueries({ queryKey: ['orgApps', org?.id] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update application');
    },
  });

  if (isLoading || isLoadingApps) {
    return (
      <div className="text-muted-foreground flex justify-center py-20 text-sm font-bold tracking-widest uppercase animate-pulse">
        SYNCING APPLICATIONS...
      </div>
    );
  }

  if (!org) {
    return (
      <div className="text-center py-20">
        <h2 className="text-foreground text-2xl font-bold">No Organization Set Up</h2>
        <Button onClick={() => navigate('/onboarding')} className="mt-4 rounded-sm">
          Complete Onboarding
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/org/dashboard')}
          className="border-border rounded-sm shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">Review Applications</h1>
          <p className="text-muted-foreground text-sm font-medium">
            Review requests to join your rosters. Accept or reject candidates.
          </p>
        </div>
      </div>

      <FadeInUp className="bg-card border border-border overflow-hidden rounded-sm">
        <div className="overflow-x-auto">
          {applications.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground font-semibold">
              No applications submitted yet. Open postings to receive requests.
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-foreground font-bold">PLAYER</TableHead>
                  <TableHead className="text-foreground font-bold">GAME & RANK</TableHead>
                  <TableHead className="text-foreground font-bold">COVER MESSAGE</TableHead>
                  <TableHead className="text-foreground font-bold">STATUS</TableHead>
                  <TableHead className="text-foreground text-right font-bold">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app: any) => (
                  <TableRow key={app.id} className="border-border hover:bg-secondary/30 transition-colors">
                    <TableCell className="py-4">
                      <Link
                        to={`/player/profile/${app.playerId}`}
                        className="text-foreground hover:text-primary font-bold transition-colors flex items-center gap-1.5"
                      >
                        {app.player?.user?.displayName || 'Unknown Player'}
                        {app.player?.verified && <BadgeCheck className="text-primary h-4.5 w-4.5 shrink-0" />}
                      </Link>
                      <span className="text-muted-foreground text-[10px] block mt-0.5 font-semibold">
                        Role: {app.player?.primaryRole}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <span className="text-foreground font-semibold block text-sm">
                        {app.player?.mainGame}
                      </span>
                      <span className="text-[10px] block mt-0.5 font-bold uppercase">
                        {app.player?.rank}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs font-semibold text-xs truncate" title={app.message}>
                      {app.message || 'No message provided.'}
                    </TableCell>
                    <TableCell>
                      {app.status === 'pending' && (
                        <span className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-yellow-500 uppercase">
                          <Clock className="h-3.5 w-3.5" /> Pending
                        </span>
                      )}
                      {app.status === 'accepted' && (
                        <span className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-green-500 uppercase">
                          <CheckCircle className="h-3.5 w-3.5" /> Accepted
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                          <XCircle className="h-3.5 w-3.5" /> Rejected
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {app.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => decideMutation.mutate({ id: app.id, status: 'accepted' })}
                              disabled={decideMutation.isPending}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white rounded-sm font-bold text-xs h-8"
                            >
                              Accept
                            </Button>
                            <Button
                              onClick={() => decideMutation.mutate({ id: app.id, status: 'rejected' })}
                              disabled={decideMutation.isPending}
                              variant="outline"
                              size="sm"
                              className="border-border text-red-500 hover:bg-red-500/10 rounded-sm font-bold text-xs h-8"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-8 rounded-sm font-bold text-xs"
                        >
                          <Link to={`/player/profile/${app.playerId}`}>
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </FadeInUp>
    </div>
  );
}
