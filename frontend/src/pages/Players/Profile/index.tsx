import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MapPin, ShieldCheck, Trophy, History, MessageSquare, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';
import { playerApi, chatApi } from '@/services/api';
import { useCurrUser } from '@/store/userStore';
import { toast } from 'sonner';

export default function PlayerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useCurrUser();

  const { data: player, isLoading } = useQuery({
    queryKey: ['player', id],
    queryFn: () => playerApi.get(id || ''),
    enabled: !!id,
  });

  const chatMutation = useMutation({
    mutationFn: async () => {
      if (!player?.userId) return;
      return chatApi.createThread([player.userId]);
    },
    onSuccess: () => {
      toast.success('Chat thread opened!');
      navigate('/inbox');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to open chat');
    },
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Profile URL copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex justify-center py-20 text-sm font-bold tracking-widest uppercase animate-pulse">
        LOADING PLAYER DOSSIER...
      </div>
    );
  }

  if (!player) {
    return (
      <div className="text-center py-20">
        <h2 className="text-foreground text-2xl font-bold">Player not found</h2>
        <p className="text-muted-foreground mt-2">The player you are looking for does not exist.</p>
      </div>
    );
  }

  const isSelf = currentUser?.id === player.userId;

  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      {/* 1. Header & Banner Section */}
      <FadeInUp className="relative w-full">
        <div className="bg-secondary border-border relative h-48 w-full overflow-hidden rounded-sm border md:h-64">
          <div className="from-secondary to-background absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] opacity-50" />
        </div>

        <div className="relative z-10 -mt-16 flex flex-col items-start gap-6 px-4 md:-mt-20 md:flex-row md:items-end md:gap-8 md:px-8">
          <div className="bg-card border-background flex h-32 w-32 items-center justify-center rounded-sm border-4 shadow-xl md:h-40 md:w-40">
            <span className="text-muted-foreground text-4xl font-black tracking-tighter md:text-5xl">
              {player.user?.displayName?.charAt(0).toUpperCase() || 'P'}
            </span>
          </div>

          <div className="mb-2 flex w-full flex-1 flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-1 flex items-center gap-3">
                <h1 className="text-foreground text-3xl font-black tracking-tighter uppercase md:text-4xl">
                  {player.user?.displayName}
                </h1>
                {player.verified && <ShieldCheck className="text-primary h-6 w-6" />}
              </div>
              <p className="text-muted-foreground mb-3 text-lg font-medium tracking-wide">
                @{player.user?.username}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary/10 text-primary border-primary/20 rounded-sm border px-3 py-1 text-xs font-bold tracking-widest uppercase">
                  {player.teamId ? 'Signed' : 'Free Agent (LFT)'}
                </span>
                <span className="bg-secondary text-foreground border-border rounded-sm border px-3 py-1 text-xs font-bold tracking-widest uppercase">
                  {player.mainGame}
                </span>
              </div>
            </div>

            <div className="flex w-full gap-3 md:w-auto">
              <Button variant="outline" size="icon" onClick={handleShare} className="border-border shrink-0 rounded-sm">
                <Share2 className="h-4 w-4" />
              </Button>
              {!isSelf && currentUser?.id && (
                <Button
                  onClick={() => chatMutation.mutate()}
                  disabled={chatMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 rounded-sm font-bold tracking-widest uppercase md:flex-none"
                >
                  <MessageSquare className="mr-2 h-4 w-4" /> MESSAGE PLAYER
                </Button>
              )}
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* 2. Main Content Grid */}
      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <FadeInUp delay={0.1} className="space-y-6 lg:col-span-4">
          <div className="bg-card border-border space-y-6 rounded-sm border p-6">
            <h3 className="text-muted-foreground border-border border-b pb-3 text-sm font-bold tracking-widest uppercase">
              Player Details
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground mb-1.5 text-xs font-bold tracking-widest uppercase">
                  Role
                </p>
                <span className="bg-secondary border-border text-foreground rounded-sm border px-2.5 py-1 text-xs font-semibold tracking-wide inline-block">
                  {player.primaryRole}
                </span>
              </div>

              <div>
                <p className="text-muted-foreground mb-1.5 text-xs font-bold tracking-widest uppercase">
                  Current Rank
                </p>
                <p className="text-foreground flex items-center gap-2 font-semibold">
                  <Trophy className="text-primary h-4 w-4" /> {player.rank}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground mb-1.5 text-xs font-bold tracking-widest uppercase">
                  Region & Country
                </p>
                <p className="text-foreground mb-1 flex items-center gap-2 font-semibold">
                  <MapPin className="text-muted-foreground h-4 w-4" /> {player.user?.country || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border-border rounded-sm border p-6">
            <h3 className="text-muted-foreground border-border mb-4 border-b pb-3 text-sm font-bold tracking-widest uppercase">
              Performance Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">K/D</span>
                <span className="text-foreground text-xl font-bold">{player.stats?.kdRatio || '0.00'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">Win Rate</span>
                <span className="text-foreground text-xl font-bold">{player.stats?.winRate || '0.0'}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">Matches</span>
                <span className="text-foreground text-xl font-bold">{player.stats?.matchesPlayed || '0'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">MVPs</span>
                <span className="text-foreground text-xl font-bold">{player.stats?.mvpCount || '0'}</span>
              </div>
            </div>
          </div>
        </FadeInUp>

        <div className="space-y-6 lg:col-span-8">
          <FadeInUp delay={0.2} className="bg-card border-border rounded-sm border p-6 md:p-8">
            <h2 className="text-foreground mb-4 flex items-center gap-2 text-xl font-bold tracking-tight">
              ABOUT ME
            </h2>
            <p className="text-muted-foreground leading-relaxed font-medium">
              {player.user?.bio || 'No biography written.'}
            </p>
          </FadeInUp>

          <FadeInUp delay={0.3} className="bg-card border-border rounded-sm border p-6 md:p-8">
            <h2 className="text-foreground mb-6 flex items-center gap-2 text-xl font-bold tracking-tight">
              <History className="text-primary h-5 w-5" /> COMPETITIVE ACHIEVEMENTS
            </h2>

            <div className="space-y-6">
              {player.achievements && player.achievements.length > 0 ? (
                player.achievements.map((ach: any, index: number) => (
                  <div
                    key={index}
                    className="border-secondary relative border-l-2 pb-2 pl-6 last:border-transparent md:pl-8"
                  >
                    <div className="bg-background border-primary absolute top-1 -left-2.25 h-4 w-4 rounded-full border-2" />
                    <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start">
                      <div>
                        <h3 className="text-foreground text-lg font-bold tracking-tight">
                          {ach.title}
                        </h3>
                        <p className="text-muted-foreground text-sm font-medium mt-1">
                          {ach.description}
                        </p>
                      </div>
                      <span className="text-muted-foreground bg-secondary w-max rounded-sm px-2.5 py-1 text-xs font-bold tracking-widest uppercase">
                        {new Date(ach.awardedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm font-medium text-center py-4">
                  No trophy room achievements listed.
                </p>
              )}
            </div>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
}
