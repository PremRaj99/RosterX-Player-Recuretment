import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';
import { FormInput } from '@/components/custom/FormInput/FormInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { orgApi, teamApi, userApi } from '@/services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function ManageTeamsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [addingMemberTeamId, setAddingMemberTeamId] = useState<string | null>(null);
  const [playerIdToAdd, setPlayerIdToAdd] = useState('');
  const [playerRoleOnTeam, setPlayerRoleOnTeam] = useState('Member');

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: userApi.getMe,
  });

  const org = user?.organizations?.[0];

  // Fetch full org with teams and players
  const { data: orgDetail, isLoading: isLoadingOrg } = useQuery({
    queryKey: ['orgDetail', org?.slug],
    queryFn: () => orgApi.get(org.slug),
    enabled: !!org?.slug,
  });

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      game: 'Valorant',
      logoUrl: '',
    },
  });

  // Create Team Mutation
  const createTeamMutation = useMutation({
    mutationFn: async (data: { name: string; game: string; logoUrl?: string }) => {
      return orgApi.createTeam(org.id, data);
    },
    onSuccess: () => {
      toast.success('Team roster created successfully!');
      reset();
      queryClient.invalidateQueries({ queryKey: ['orgDetail', org.slug] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create team');
    },
  });

  // Update Team Members Mutation
  const memberMutation = useMutation({
    mutationFn: async (payload: { teamId: string; playerId: string; action: 'add' | 'remove'; roleOnTeam?: string }) => {
      return teamApi.updateMembers(payload.teamId, {
        playerId: payload.playerId,
        action: payload.action,
        roleOnTeam: payload.roleOnTeam,
      });
    },
    onSuccess: () => {
      toast.success('Roster updated successfully!');
      setPlayerIdToAdd('');
      setPlayerRoleOnTeam('Member');
      setAddingMemberTeamId(null);
      queryClient.invalidateQueries({ queryKey: ['orgDetail', org.slug] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Roster update failed. Double check player ID.');
    },
  });

  const onSubmit = (data: any) => {
    createTeamMutation.mutate(data);
  };

  const handleAddMember = (teamId: string) => {
    if (!playerIdToAdd.trim()) {
      toast.error('Please enter a valid player ID');
      return;
    }
    memberMutation.mutate({
      teamId,
      playerId: playerIdToAdd,
      action: 'add',
      roleOnTeam: playerRoleOnTeam,
    });
  };

  const handleRemoveMember = (teamId: string, playerId: string) => {
    if (confirm('Are you sure you want to remove this player from the roster?')) {
      memberMutation.mutate({
        teamId,
        playerId,
        action: 'remove',
      });
    }
  };

  if (isLoading || isLoadingOrg) {
    return (
      <div className="text-muted-foreground flex justify-center py-20 text-sm font-bold tracking-widest uppercase animate-pulse">
        SYNCING TEAMS...
      </div>
    );
  }

  if (!org) {
    return (
      <div className="text-center py-20">
        <h2 className="text-foreground text-2xl font-bold">No Organization Created</h2>
        <Button asChild className="mt-4 rounded-sm">
          <Link to="/onboarding">Complete Onboarding</Link>
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
          <h1 className="text-foreground text-3xl font-bold tracking-tight">Manage Teams</h1>
          <p className="text-muted-foreground text-sm font-medium">
            Create rosters for different game titles and manage player assignments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Create Team */}
        <FadeInUp className="lg:col-span-4 bg-card border border-border p-6 rounded-sm space-y-4 h-fit">
          <h3 className="text-foreground font-bold text-lg border-b border-border/50 pb-2">
            Create New Team
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput control={control} name="name" label="TEAM NAME" placeholder="e.g. Valorant Alpha" />
            <FormInput control={control} name="game" label="GAME TITLE" placeholder="e.g. Valorant" />
            <FormInput control={control} name="logoUrl" label="LOGO URL (OPTIONAL)" placeholder="https://..." />
            <Button
              type="submit"
              disabled={createTeamMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-sm font-bold tracking-widest uppercase"
            >
              {createTeamMutation.isPending ? 'CREATING...' : 'CREATE TEAM'}
            </Button>
          </form>
        </FadeInUp>

        {/* Right Column: Teams List & Roster Management */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-foreground font-bold text-xl tracking-tight">Active Rosters ({orgDetail?.teams?.length || 0})</h3>
          
          {orgDetail?.teams?.length > 0 ? (
            <div className="space-y-6">
              {orgDetail.teams.map((team: any) => (
                <div key={team.id} className="bg-card border border-border p-6 rounded-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <div>
                      <h4 className="text-foreground font-bold text-lg">{team.name}</h4>
                      <span className="text-primary text-xs font-bold tracking-widest uppercase">{team.game}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddingMemberTeamId(addingMemberTeamId === team.id ? null : team.id)}
                      className="border-border rounded-sm text-xs font-bold"
                    >
                      {addingMemberTeamId === team.id ? 'Cancel' : 'Add Player'}
                    </Button>
                  </div>

                  {/* Add Member inline form */}
                  {addingMemberTeamId === team.id && (
                    <div className="bg-secondary/35 border border-border p-4 rounded-sm flex flex-col sm:flex-row gap-3 items-end">
                      <div className="flex-1 w-full space-y-1">
                        <Label className="text-[10px] font-bold tracking-wide text-muted-foreground">PLAYER ID</Label>
                        <Input
                          placeholder="Paste player's unique profile ID..."
                          value={playerIdToAdd}
                          onChange={(e) => setPlayerIdToAdd(e.target.value)}
                          className="bg-background border-border rounded-sm h-9"
                        />
                      </div>
                      <div className="w-full sm:w-40 space-y-1">
                        <Label className="text-[10px] font-bold tracking-wide text-muted-foreground">TEAM ROLE</Label>
                        <Input
                          placeholder="e.g. IGL, Duelist"
                          value={playerRoleOnTeam}
                          onChange={(e) => setPlayerRoleOnTeam(e.target.value)}
                          className="bg-background border-border rounded-sm h-9"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => handleAddMember(team.id)}
                        disabled={memberMutation.isPending}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 rounded-sm font-bold tracking-wide text-xs w-full sm:w-auto"
                      >
                        Add to Roster
                      </Button>
                    </div>
                  )}

                  {/* Members list */}
                  <div className="space-y-2">
                    <h5 className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">Roster Members</h5>
                    {team.members && team.members.length > 0 ? (
                      <div className="divide-y divide-border/50">
                        {team.members.map((member: any) => (
                          <div key={member.playerId} className="flex justify-between items-center py-3">
                            <div>
                              {/* Display ID or navigate */}
                              <Link
                                to={`/player/profile/${member.playerId}`}
                                className="text-foreground hover:text-primary font-semibold text-sm transition-colors"
                              >
                                View Player profile
                              </Link>
                              <span className="text-muted-foreground text-xs block font-bold uppercase mt-0.5">
                                {member.roleOnTeam}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveMember(team.id, member.playerId)}
                              disabled={memberMutation.isPending}
                              className="text-muted-foreground hover:text-destructive h-8 w-8 rounded-sm"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-xs font-semibold italic py-2">
                        No members assigned to this team roster yet. Enter a player's ID above to add them.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-secondary/20 border border-border p-12 rounded-sm text-center">
              <Users className="text-muted-foreground h-10 w-10 opacity-50 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm font-medium">
                No active teams under this organization. Create one using the form on the left.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
