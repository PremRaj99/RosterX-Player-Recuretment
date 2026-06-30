import {
  MapPin,
  ShieldCheck,
  Trophy,
  MonitorPlay,
  History,
  MessageSquare,
  Share2,
} from 'lucide-react';
import { FaTwitch, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';

// --- Mock Data ---
const player = {
  ign: 'Zero',
  fullName: 'Alex Chen',
  status: 'Free Agent', // or "Signed to Sentinels"
  verified: true,
  game: 'Valorant',
  region: 'NA East',
  languages: ['English', 'Mandarin'],
  roles: ['Entry Fragger', 'Flex'],
  rank: 'Radiant (Top 100)',
  bio: 'Highly mechanical entry fragger with 2 years of Tier 2 experience. Looking for a dedicated Tier 1/2 roster to compete in the upcoming VCT Challengers circuit. Flexible on agents, aggressive playstyle, and vocal mid-round caller.',
  experience: [
    {
      id: 1,
      team: 'Ascend Esports',
      role: 'Entry Fragger',
      duration: 'Jan 2025 - Dec 2025',
      achievement: '1st - NerdStreet Champs',
    },
    {
      id: 2,
      team: 'DarkZero (Trial)',
      role: 'Flex',
      duration: 'Sep 2024 - Nov 2024',
      achievement: 'Top 8 - VCT Open Quals',
    },
  ],
  socials: {
    twitter: 'https://twitter.com',
    twitch: 'https://twitch.tv',
    youtube: 'https://youtube.com',
  },
};

export default function PlayerProfilePage() {
  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      {/* 1. Header & Banner Section */}
      <FadeInUp className="relative w-full">
        {/* Banner */}
        <div className="bg-secondary border-border relative h-48 w-full overflow-hidden rounded-sm border md:h-64">
          {/* Subtle pattern or pure dark background for the banner */}
          <div className="from-secondary to-background absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] opacity-50" />
        </div>

        {/* Profile Info Overlay */}
        <div className="relative z-10 -mt-16 flex flex-col items-start gap-6 px-4 md:-mt-20 md:flex-row md:items-end md:gap-8 md:px-8">
          {/* Avatar */}
          <div className="bg-card border-background flex h-32 w-32 items-center justify-center rounded-sm border-4 shadow-xl md:h-40 md:w-40">
            <span className="text-muted-foreground text-4xl font-black tracking-tighter md:text-5xl">
              Z
            </span>
          </div>

          {/* Name & Actions */}
          <div className="mb-2 flex w-full flex-1 flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-1 flex items-center gap-3">
                <h1 className="text-foreground text-3xl font-black tracking-tighter uppercase md:text-4xl">
                  {player.ign}
                </h1>
                {player.verified && <ShieldCheck className="text-primary h-6 w-6" />}
              </div>
              <p className="text-muted-foreground mb-3 text-lg font-medium tracking-wide">
                {player.fullName}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary/10 text-primary border-primary/20 rounded-sm border px-3 py-1 text-xs font-bold tracking-widest uppercase">
                  {player.status}
                </span>
                <span className="bg-secondary text-foreground border-border rounded-sm border px-3 py-1 text-xs font-bold tracking-widest uppercase">
                  {player.game}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex w-full gap-3 md:w-auto">
              <Button variant="outline" size="icon" className="border-border shrink-0 rounded-sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 rounded-sm font-bold tracking-widest uppercase md:flex-none">
                <MessageSquare className="mr-2 h-4 w-4" /> RECRUIT PLAYER
              </Button>
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* 2. Main Content Grid */}
      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Stats & Meta (Spans 4 cols on large screens) */}
        <FadeInUp delay={0.1} className="space-y-6 lg:col-span-4">
          {/* Quick Stats Card */}
          <div className="bg-card border-border space-y-6 rounded-sm border p-6">
            <h3 className="text-muted-foreground border-border border-b pb-3 text-sm font-bold tracking-widest uppercase">
              Player Details
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground mb-1.5 text-xs font-bold tracking-widest uppercase">
                  Roles
                </p>
                <div className="flex flex-wrap gap-2">
                  {player.roles.map((role) => (
                    <span
                      key={role}
                      className="bg-secondary border-border text-foreground rounded-sm border px-2.5 py-1 text-xs font-semibold tracking-wide"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-muted-foreground mb-1.5 text-xs font-bold tracking-widest uppercase">
                  Current Rank / Elo
                </p>
                <p className="text-foreground flex items-center gap-2 font-semibold">
                  <Trophy className="text-primary h-4 w-4" /> {player.rank}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground mb-1.5 text-xs font-bold tracking-widest uppercase">
                  Region & Language
                </p>
                <p className="text-foreground mb-1 flex items-center gap-2 font-semibold">
                  <MapPin className="text-muted-foreground h-4 w-4" /> {player.region}
                </p>
                <p className="text-muted-foreground text-sm font-medium">
                  {player.languages.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Socials Card */}
          <div className="bg-card border-border rounded-sm border p-6">
            <h3 className="text-muted-foreground border-border mb-4 border-b pb-3 text-sm font-bold tracking-widest uppercase">
              Socials & VODs
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={player.socials.twitter}
                className="text-muted-foreground hover:text-foreground flex items-center gap-3 font-medium transition-colors"
              >
                <FaTwitter className="h-5 w-5" /> Twitter
              </a>
              <a
                href={player.socials.twitch}
                className="text-muted-foreground hover:text-primary flex items-center gap-3 font-medium transition-colors"
              >
                <FaTwitch className="h-5 w-5" /> Twitch
              </a>
              <a
                href={player.socials.youtube}
                className="text-muted-foreground hover:text-foreground flex items-center gap-3 font-medium transition-colors"
              >
                <FaYoutube className="h-5 w-5" /> YouTube
              </a>
            </div>
          </div>
        </FadeInUp>

        {/* Right Column: Bio & Experience (Spans 8 cols on large screens) */}
        <div className="space-y-6 lg:col-span-8">
          {/* About Section */}
          <FadeInUp delay={0.2} className="bg-card border-border rounded-sm border p-6 md:p-8">
            <h2 className="text-foreground mb-4 flex items-center gap-2 text-xl font-bold tracking-tight">
              <MonitorPlay className="text-primary h-5 w-5" /> ABOUT ME
            </h2>
            <p className="text-muted-foreground leading-relaxed font-medium">{player.bio}</p>
          </FadeInUp>

          {/* Experience Timeline */}
          <FadeInUp delay={0.3} className="bg-card border-border rounded-sm border p-6 md:p-8">
            <h2 className="text-foreground mb-6 flex items-center gap-2 text-xl font-bold tracking-tight">
              <History className="text-primary h-5 w-5" /> COMPETITIVE EXPERIENCE
            </h2>

            <div className="space-y-6">
              {player.experience.map((exp, _index) => (
                <div
                  key={exp.id}
                  className="border-secondary relative border-l-2 pb-2 pl-6 last:border-transparent md:pl-8"
                >
                  {/* Timeline dot */}
                  <div className="bg-background border-primary absolute top-1 -left-2.25 h-4 w-4 rounded-full border-2" />

                  <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start">
                    <div>
                      <h3 className="text-foreground text-lg font-bold tracking-tight">
                        {exp.team}
                      </h3>
                      <p className="text-primary mb-1 text-sm font-semibold">{exp.role}</p>
                      <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-sm font-medium">
                        <Trophy className="h-3.5 w-3.5" /> {exp.achievement}
                      </p>
                    </div>
                    <span className="text-muted-foreground bg-secondary w-max rounded-sm px-2.5 py-1 text-xs font-bold tracking-widest uppercase">
                      {exp.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </FadeInUp>

          {/* VOD / Highlights Placeholder */}
          <FadeInUp delay={0.4} className="bg-card border-border rounded-sm border p-6 md:p-8">
            <h2 className="text-foreground mb-6 text-xl font-bold tracking-tight">HIGHLIGHTS</h2>
            <div className="bg-secondary border-border text-muted-foreground flex aspect-video w-full flex-col items-center justify-center rounded-sm border">
              <MonitorPlay className="mb-3 h-10 w-10 opacity-50" />
              <p className="text-sm font-semibold tracking-wide">NO VOD LINKED</p>
            </div>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
}
