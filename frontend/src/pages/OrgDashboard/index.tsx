import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Megaphone, ShieldCheck, Settings } from 'lucide-react';
import { userApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';

export function OrgDashboard() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: userApi.getMe,
  });

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex justify-center py-20 text-sm font-bold tracking-widest uppercase animate-pulse">
        LOADING ORGANIZER HUB...
      </div>
    );
  }

  // Get first organization owned by this organizer
  const org = user?.organizations?.[0];

  if (!org) {
    return (
      <div className="text-center py-20">
        <h2 className="text-foreground text-2xl font-bold">No Organization Set Up</h2>
        <p className="text-muted-foreground mt-2">
          You need to complete onboarding to create your organization profile.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90 mt-4 rounded-sm">
          <Link to="/onboarding">Complete Onboarding</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-6">
      {/* Header */}
      <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-foreground text-3xl font-black tracking-tight md:text-4xl">
              {org.name.toUpperCase()}
            </h1>
            {org.verified && <ShieldCheck className="text-primary h-6 w-6" />}
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            Overview statistics and shortcuts for your organization panel.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="border-border hover:bg-secondary rounded-sm font-semibold">
            <Link to="/settings">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 rounded-sm font-semibold">
            <Link to={`/org/${org.slug}`}>View Public Page</Link>
          </Button>
        </div>
      </section>

      {/* Stats Summary */}
      <FadeInUp className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-sm p-6 space-y-2">
          <div className="bg-primary/10 border border-primary/20 flex h-10 w-10 items-center justify-center rounded-sm">
            <Users className="text-primary h-5 w-5" />
          </div>
          <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase block pt-2">Roster size</span>
          <span className="text-foreground text-3xl font-black block">{org.rosterSize || 0}</span>
        </div>
        <div className="bg-card border border-border rounded-sm p-6 space-y-2">
          <div className="bg-primary/10 border border-primary/20 flex h-10 w-10 items-center justify-center rounded-sm">
            <LayoutDashboard className="text-primary h-5 w-5" />
          </div>
          <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase block pt-2">Active Teams</span>
          <span className="text-foreground text-3xl font-black block">{org.teams?.length || 0}</span>
        </div>
        <div className="bg-card border border-border rounded-sm p-6 space-y-2">
          <div className="bg-primary/10 border border-primary/20 flex h-10 w-10 items-center justify-center rounded-sm">
            <Megaphone className="text-primary h-5 w-5" />
          </div>
          <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase block pt-2">Open Postings</span>
          <span className="text-foreground text-3xl font-black block">{org.recruitments?.length || 0}</span>
        </div>
      </FadeInUp>

      {/* About Box */}
      <section className="bg-card border border-border p-6 rounded-sm space-y-3">
        <h3 className="text-foreground font-bold tracking-tight text-lg">Organization Bio</h3>
        <p className="text-muted-foreground text-sm font-medium leading-relaxed">
          {org.description || 'No biography written. Update your details in public organization page.'}
        </p>
      </section>

      {/* Quick shortcuts */}
      <section className="space-y-4">
        <h3 className="text-foreground font-bold tracking-tight text-lg">Administrative Panel Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button asChild variant="secondary" className="border border-border rounded-sm py-8 font-bold tracking-widest uppercase text-sm">
            <Link to="/org/teams/manage">
              Manage Teams & Members
            </Link>
          </Button>
          <Button asChild variant="secondary" className="border border-border rounded-sm py-8 font-bold tracking-widest uppercase text-sm">
            <Link to="/org/recruitments/manage">
              Manage Recruitments
            </Link>
          </Button>
          <Button asChild variant="secondary" className="border border-border rounded-sm py-8 font-bold tracking-widest uppercase text-sm">
            <Link to="/org/applications">
              Review Player Applications
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
export default OrgDashboard;
