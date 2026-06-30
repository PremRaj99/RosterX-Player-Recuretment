import { Link } from 'react-router-dom';
import { ArrowRight, Crosshair, ShieldCheck, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';

export default function HomePage() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Verified Scouting',
      description:
        'Organizations know exactly who they are recruiting with our strict player verification and stat-tracking integrations.',
    },
    {
      icon: Crosshair,
      title: 'Precision Filtering',
      description:
        'Filter candidates by game, role, Elo, and LAN experience to find the perfect missing piece for your roster.',
    },
    {
      icon: Trophy,
      title: 'Built for Champions',
      description:
        'From Tier 3 open qualifiers to Tier 1 franchise leagues, RosterX connects the entire competitive ecosystem.',
    },
  ];

  const stats = [
    { value: '15K+', label: 'Active Players' },
    { value: '500+', label: 'Verified Orgs' },
    { value: '2.4K', label: 'Rosters Built' },
    { value: '4', label: 'Supported Titles' },
  ];

  return (
    <div className="flex w-full flex-col gap-24 py-6 md:py-12">
      {/* 1. Hero Section */}
      <section className="flex flex-col items-center space-y-8 text-center">
        <FadeInUp className="max-w-4xl space-y-4">
          <div className="bg-secondary border-border text-primary mb-4 inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs font-bold tracking-widest uppercase">
            <span className="bg-primary h-2 w-2 animate-pulse rounded-full" />
            The Ultimate Recruitment Network
          </div>
          <h1 className="text-foreground text-5xl leading-[1.1] font-extrabold tracking-tighter md:text-7xl">
            YOUR PATH TO PRO <br className="hidden md:block" />
            <span className="from-primary bg-linear-to-r to-[#ff7a45] bg-clip-text text-transparent">
              STARTS HERE.
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl pt-4 text-lg font-medium tracking-wide md:text-xl">
            Discover talent. Build legends. Whether you're a mechanically gifted FA or a Tier 1
            organization rebuilding a core, RosterX is where contracts get signed.
          </p>
        </FadeInUp>

        <FadeInUp
          delay={0.1}
          className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 w-full rounded-sm px-8 font-bold tracking-widest uppercase sm:w-auto"
          >
            <Link to="/register">
              Join as Player <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-border hover:bg-secondary text-foreground h-14 w-full rounded-sm bg-transparent px-8 font-bold tracking-widest uppercase sm:w-auto"
          >
            <Link to="/register">Register Organization</Link>
          </Button>
        </FadeInUp>
      </section>

      {/* 2. Stats Banner */}
      <FadeInUp delay={0.2}>
        <section className="bg-border border-border grid grid-cols-2 gap-px overflow-hidden rounded-sm border md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-card flex flex-col items-center justify-center p-8 text-center"
            >
              <span className="text-foreground mb-1 text-3xl font-black tracking-tighter md:text-4xl">
                {stat.value}
              </span>
              <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </section>
      </FadeInUp>

      {/* 3. Features Grid */}
      <section className="space-y-12">
        <FadeInUp delay={0.3} className="space-y-4 text-center">
          <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
            Why RosterX?
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl font-medium">
            We eliminated the noise of social media recruitment. Pure signal, verified stats, and
            direct connections to decision-makers.
          </p>
        </FadeInUp>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <FadeInUp key={i} delay={0.4 + i * 0.1}>
              <div className="bg-card border-border hover:border-primary/50 group flex h-full flex-col rounded-sm border p-8 transition-colors">
                <div className="bg-secondary border-border group-hover:bg-primary/10 group-hover:border-primary/30 mb-6 flex h-12 w-12 items-center justify-center rounded-sm border transition-colors">
                  <feature.icon className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-foreground mb-3 text-xl font-bold tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </FadeInUp>
          ))}
        </div>
      </section>

      {/* 4. Bottom CTA Section */}
      <FadeInUp delay={0.6}>
        <section className="border-primary bg-card relative overflow-hidden rounded-sm border-2 p-12 text-center shadow-[0_0_40px_-15px_rgba(245,65,10,0.3)]">
          {/* Abstract background element for depth */}
          <div className="bg-primary/20 pointer-events-none absolute top-1/2 left-1/2 h-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]" />

          <div className="relative z-10 flex flex-col items-center">
            <Users className="text-primary mb-6 h-12 w-12" />
            <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Stop waiting for an invite.
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-md font-medium">
              Create your profile today, browse active listings, and take control of your
              competitive career.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 rounded-sm px-10 font-bold tracking-widest uppercase"
            >
              <Link to="/jobs">BROWSE OPENINGS</Link>
            </Button>
          </div>
        </section>
      </FadeInUp>
    </div>
  );
}
