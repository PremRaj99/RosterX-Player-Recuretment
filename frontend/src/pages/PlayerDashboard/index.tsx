import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';
import { Button } from '@/components/ui/button';
import { userApi } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { Calendar, CheckCircle2, Clock, Crosshair, Edit3, ShieldCheck, Trophy, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PlayerDashboard() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: userApi.getMe,
  });

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex justify-center py-20 text-sm font-bold tracking-widest uppercase animate-pulse">
        LOADING DASHBOARD...
      </div>
    );
  }

  const profile = user?.playerProfile;
  const team = profile?.team;
  const applications = profile?.applications || [];

  return (
    <div className="space-y-12 py-6">
      {/* 1. Header Section */}
      <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-black tracking-tight md:text-4xl">
            WELCOME BACK, <span className="text-primary">{user?.displayName?.toUpperCase()}</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Manage your gaming stats, achievements, and open applications.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="border-border hover:bg-secondary rounded-sm font-semibold tracking-wide">
            <Link to="/profile/edit">
              <Edit3 className="mr-2 h-4 w-4" /> Edit Stats
            </Link>
          </Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm font-semibold tracking-wide">
            <Link to="/board">Find Teams</Link>
          </Button>
        </div>
      </section>

      {/* 2. Profile Overview Card */}
      <FadeInUp className="bg-card border-border grid grid-cols-1 rounded-sm border p-8 md:grid-cols-3 md:gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 border-primary/20 flex h-14 w-14 items-center justify-center rounded-sm border">
              <Crosshair className="text-primary h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-foreground text-xl font-bold tracking-tight">{profile?.mainGame}</span>
                {profile?.verified && <ShieldCheck className="text-primary h-4.5 w-4.5" />}
              </div>
              <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                {profile?.primaryRole}
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium">
            {user?.bio || 'No bio provided. Update your bio in Settings.'}
          </p>
        </div>

        <div className="border-border border-t pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8 flex flex-col justify-center">
          <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase mb-1">
            Current Rank
          </span>
          <span className="text-foreground text-2xl font-black tracking-tight">
            {profile?.rank || 'Unranked'}
          </span>
        </div>

        <div className="border-border border-t pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8 flex flex-col justify-center">
          <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase mb-1">
            Roster Status
          </span>
          {team ? (
            <div>
              <span className="text-foreground text-xl font-bold block">{team.name}</span>
              <span className="text-primary text-xs font-bold tracking-widest uppercase">{team.game}</span>
            </div>
          ) : (
            <span className="text-yellow-500 text-lg font-bold tracking-wide uppercase">
              Free Agent (LFT)
            </span>
          )}
        </div>
      </FadeInUp>

      {/* 3. Stats & Achievements Grid */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Stats */}
        <div className="space-y-6">
          <h2 className="text-foreground text-2xl font-bold tracking-tight">Performance Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border-border flex flex-col rounded-sm border p-6">
              <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase mb-1">K/D Ratio</span>
              <span className="text-foreground text-3xl font-black tracking-tight">{profile?.stats?.kdRatio || '0.00'}</span>
            </div>
            <div className="bg-card border-border flex flex-col rounded-sm border p-6">
              <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase mb-1">Win Rate</span>
              <span className="text-foreground text-3xl font-black tracking-tight">{profile?.stats?.winRate || '0.0'}%</span>
            </div>
            <div className="bg-card border-border flex flex-col rounded-sm border p-6">
              <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase mb-1">Matches Played</span>
              <span className="text-foreground text-3xl font-black tracking-tight">{profile?.stats?.matchesPlayed || '0'}</span>
            </div>
            <div className="bg-card border-border flex flex-col rounded-sm border p-6">
              <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase mb-1">MVP Awards</span>
              <span className="text-foreground text-3xl font-black tracking-tight">{profile?.stats?.mvpCount || '0'}</span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-6">
          <h2 className="text-foreground text-2xl font-bold tracking-tight">Achievements</h2>
          <div className="bg-card border-border rounded-sm border p-6 space-y-4">
            {profile?.achievements && profile.achievements.length > 0 ? (
              profile.achievements.map((ach: any, index: number) => (
                <div key={index} className="flex gap-3 items-start border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div className="bg-primary/10 border-primary/20 flex h-9 w-9 items-center justify-center rounded-sm border mt-0.5 shrink-0">
                    <Trophy className="text-primary h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-foreground font-bold tracking-tight">{ach.title}</h4>
                    <p className="text-muted-foreground text-xs font-medium mt-0.5">{ach.description}</p>
                    <span className="text-muted-foreground text-[10px] font-semibold mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {new Date(ach.awardedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm font-medium py-4 text-center">
                No achievements posted yet. Highlight your trophy cabinet to recruiters!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 4. Active Applications */}
      <section className="space-y-6">
        <h2 className="text-foreground text-2xl font-bold tracking-tight">Active Applications</h2>
        <div className="bg-card border-border rounded-sm border overflow-hidden">
          {applications.length > 0 ? (
            <div className="divide-y divide-border">
              {applications.map((app: any) => (
                <div key={app.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 gap-4">
                  <div className="space-y-1">
                    <h4 className="text-foreground font-bold tracking-tight">
                      {app.recruitment?.title || 'Direct Organization Application'}
                    </h4>
                    <p className="text-muted-foreground text-sm font-medium">
                      Applied to: <span className="text-foreground font-semibold">{app.organization?.name}</span>
                    </p>
                    {app.message && (
                      <p className="text-muted-foreground text-xs italic mt-1 font-medium">
                        "{app.message}"
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                    <span className="text-muted-foreground text-xs font-semibold flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                    {app.status === 'accepted' && (
                      <span className="bg-green-500/10 border-green-500/20 text-green-500 inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs font-bold tracking-wide uppercase">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Accepted
                      </span>
                    )}
                    {app.status === 'rejected' && (
                      <span className="bg-red-500/10 border-red-500/20 text-red-500 inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs font-bold tracking-wide uppercase">
                        <XCircle className="h-3.5 w-3.5" /> Rejected
                      </span>
                    )}
                    {app.status === 'pending' && (
                      <span className="bg-yellow-500/10 border-yellow-500/20 text-yellow-500 inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs font-bold tracking-wide uppercase">
                        <Clock className="h-3.5 w-3.5" /> Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <p className="text-foreground font-bold">No active applications.</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Apply to team openings on the Recruitment Board to see them listed here.
              </p>
              <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-sm font-semibold">
                <Link to="/board">Browse Board</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
