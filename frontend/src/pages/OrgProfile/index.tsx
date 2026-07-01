import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, MapPin } from 'lucide-react';
import { orgApi } from '@/services/api';
import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';

export default function OrgProfilePage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: org, isLoading } = useQuery({
    queryKey: ['org', slug],
    queryFn: () => orgApi.get(slug || ''),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex justify-center py-20 text-sm font-bold tracking-widest uppercase animate-pulse">
        LOADING ORGANIZATION DOSSIER...
      </div>
    );
  }

  if (!org) {
    return (
      <div className="text-center py-20">
        <h2 className="text-foreground text-2xl font-bold">Organization not found</h2>
        <p className="text-muted-foreground mt-2">The organization you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      {/* 1. Header & Banner */}
      <FadeInUp className="relative w-full">
        <div className="bg-secondary border-border relative h-48 w-full overflow-hidden rounded-sm border md:h-64">
          <div className="from-secondary to-background absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] opacity-50" />
        </div>

        <div className="relative z-10 -mt-16 flex flex-col items-start gap-6 px-4 md:-mt-20 md:flex-row md:items-end md:gap-8 md:px-8">
          <div className="bg-card border-background flex h-32 w-32 items-center justify-center rounded-sm border-4 shadow-xl md:h-40 md:w-40">
            <span className="text-muted-foreground text-4xl font-black tracking-tighter md:text-5xl">
              {org.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="mb-2 flex w-full flex-1 flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-1 flex items-center gap-3">
                <h1 className="text-foreground text-3xl font-black tracking-tighter uppercase md:text-4xl">
                  {org.name}
                </h1>
                {org.verified && <ShieldCheck className="text-primary h-6 w-6" />}
              </div>
              <p className="text-muted-foreground mb-3 text-lg font-medium tracking-wide">
                @{org.slug}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary/10 text-primary border-primary/20 rounded-sm border px-3 py-1 text-xs font-bold tracking-widest uppercase">
                  Roster Size: {org.rosterSize || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* 2. Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Sidebar */}
        <FadeInUp delay={0.1} className="lg:col-span-4 space-y-6">
          <div className="bg-card border-border rounded-sm border p-6 space-y-6">
            <h3 className="text-muted-foreground border-border border-b pb-3 text-sm font-bold tracking-widest uppercase">
              Org Meta
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground mb-1.5 text-xs font-bold tracking-widest uppercase">
                  Games Supported
                </p>
                <div className="flex flex-wrap gap-2">
                  {org.games?.map((game: string) => (
                    <span
                      key={game}
                      className="bg-secondary border-border text-foreground rounded-sm border px-2.5 py-1 text-xs font-semibold tracking-wide"
                    >
                      {game}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-muted-foreground mb-1.5 text-xs font-bold tracking-widest uppercase">
                  Country
                </p>
                <p className="text-foreground flex items-center gap-2 font-semibold">
                  <MapPin className="text-muted-foreground h-4 w-4" /> {org.owner?.country || 'Global'}
                </p>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Details & Teams */}
        <div className="lg:col-span-8 space-y-8">
          {/* About */}
          <FadeInUp delay={0.2} className="bg-card border border-border rounded-sm p-6 md:p-8">
            <h2 className="text-foreground mb-4 text-xl font-bold tracking-tight">ABOUT ORGANIZATION</h2>
            <p className="text-muted-foreground leading-relaxed font-medium">
              {org.description || 'No description written yet.'}
            </p>
          </FadeInUp>

          {/* Teams List */}
          <FadeInUp delay={0.3} className="space-y-6">
            <h2 className="text-foreground text-2xl font-bold tracking-tight">Active Rosters & Teams</h2>

            {org.teams && org.teams.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {org.teams.map((team: any) => (
                  <div key={team.id} className="bg-card border border-border rounded-sm p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                      <div>
                        <h3 className="text-foreground text-xl font-bold tracking-tight">{team.name}</h3>
                        <span className="text-primary text-xs font-bold tracking-widest uppercase">
                          {team.game}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase block">
                          Win Rate
                        </span>
                        <span className="text-foreground font-black text-lg">{team.winRate}%</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-muted-foreground text-xs font-bold tracking-widest uppercase mb-3">
                        Roster Members ({team.members?.length || 0})
                      </h4>
                      {team.members && team.members.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {team.members.map((member: any) => (
                            <div
                              key={member.playerId}
                              className="bg-secondary/35 border border-border/50 rounded-sm p-3 flex justify-between items-center"
                            >
                              <div>
                                <span className="text-foreground font-semibold text-sm block">
                                  Player Profile
                                </span>
                                <span className="text-muted-foreground text-xs font-bold uppercase">
                                  {member.roleOnTeam}
                                </span>
                              </div>
                              <span className="text-muted-foreground text-[10px] font-semibold">
                                Joined {new Date(member.joinedAt).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-xs font-medium italic">
                          No players currently assigned to this team.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-secondary/20 border border-border p-8 rounded-sm text-center">
                <p className="text-muted-foreground text-sm font-medium">
                  No active competitive teams listed.
                </p>
              </div>
            )}
          </FadeInUp>
        </div>
      </div>
    </div>
  );
}
