import { useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  Users,
  Gamepad2,
  Globe,
  Trophy,
  ArrowRight,
  Briefcase,
} from 'lucide-react';

import { FaTwitter } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';
import { EnrollModal } from '../EnrollModal'; // Assuming this is reused from the Teams view

// --- Mock Data ---
const team = {
  id: '1',
  name: 'Sentinels',
  verified: true,
  region: 'North America',
  founded: '2018',
  website: 'https://sentinels.gg',
  twitter: '@Sentinels',
  description:
    'Sentinels is a premier esports organization based in Los Angeles, California. Known for our championship-winning Valorant and Halo rosters, we are dedicated to building legacies and entertaining millions worldwide.',
  games: ['Valorant', 'Halo', 'Apex Legends'],
  stats: {
    activePlayers: 15,
    championships: 4,
    totalWinnings: '$2.5M+',
  },
  rosters: [
    {
      game: 'Valorant',
      players: [
        { ign: 'TenZ', role: 'Flex', status: 'Active' },
        { ign: 'Zellsis', role: 'Flex / IGL', status: 'Active' },
        { ign: 'Sacy', role: 'Initiator', status: 'Active' },
        { ign: 'johnqt', role: 'IGL / Sentinel', status: 'Active' },
      ],
    },
    {
      game: 'Halo',
      players: [
        { ign: 'Lethul', role: 'Support', status: 'Active' },
        { ign: 'Frosty', role: 'Slayer', status: 'Active' },
        { ign: 'Spartan', role: 'Objective', status: 'Active' },
      ],
    },
  ],
  openings: [
    {
      id: '101',
      title: 'Valorant Head Coach',
      type: 'Staff',
      postedAt: '2 days ago',
    },
    {
      id: '102',
      title: 'Apex Legends - Fragger',
      type: 'Player',
      postedAt: '1 week ago',
    },
  ],
};

export default function TeamProfilePage() {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      {/* 1. Header & Banner Section */}
      <FadeInUp className="relative w-full">
        {/* Banner */}
        <div className="bg-secondary border-border relative h-48 w-full overflow-hidden rounded-sm border md:h-64">
          <div className="from-background absolute inset-0 bg-linear-to-t to-transparent opacity-80" />
          {/* Mock abstract team pattern */}
          <div className="from-primary absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] to-transparent opacity-20" />
        </div>

        {/* Profile Info Overlay */}
        <div className="relative z-10 -mt-16 flex flex-col items-start gap-6 px-4 md:-mt-20 md:flex-row md:items-end md:gap-8 md:px-8">
          {/* Logo */}
          <div className="bg-card border-background flex h-32 w-32 shrink-0 items-center justify-center rounded-sm border-4 shadow-xl md:h-40 md:w-40">
            <span className="text-foreground text-4xl font-black tracking-tighter uppercase md:text-5xl">
              {team.name.substring(0, 3)}
            </span>
          </div>

          {/* Name & Actions */}
          <div className="mb-2 flex w-full flex-1 flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-1 flex items-center gap-3">
                <h1 className="text-foreground text-3xl font-black tracking-tighter uppercase md:text-4xl">
                  {team.name}
                </h1>
                {team.verified && <ShieldCheck className="text-primary h-7 w-7" />}
              </div>
              <p className="text-muted-foreground mb-3 flex items-center gap-2 text-lg font-medium tracking-wide">
                <MapPin className="h-5 w-5" /> {team.region}
              </p>
              <div className="flex flex-wrap gap-2">
                {team.games.map((game) => (
                  <span
                    key={game}
                    className="bg-secondary text-foreground border-border flex items-center gap-1.5 rounded-sm border px-3 py-1 text-xs font-bold tracking-widest uppercase"
                  >
                    <Gamepad2 className="h-3 w-3" /> {game}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <Button
              onClick={() => setIsEnrollModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-sm font-bold tracking-widest uppercase shadow-none md:w-auto"
            >
              <Users className="mr-2 h-4 w-4" /> JOIN TALENT POOL
            </Button>
          </div>
        </div>
      </FadeInUp>

      {/* 2. Main Content Grid */}
      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Stats & Meta (Spans 4 cols on large screens) */}
        <FadeInUp delay={0.1} className="space-y-6 lg:col-span-4">
          {/* Org Details Card */}
          <div className="bg-card border-border space-y-6 rounded-sm border p-6">
            <h3 className="text-muted-foreground border-border border-b pb-3 text-sm font-bold tracking-widest uppercase">
              Organization Details
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground mb-1 text-[10px] font-bold tracking-widest uppercase">
                    Founded
                  </p>
                  <p className="text-foreground font-semibold">{team.founded}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 text-[10px] font-bold tracking-widest uppercase">
                    Active Players
                  </p>
                  <p className="text-foreground flex items-center gap-1.5 font-semibold">
                    <Users className="text-primary h-4 w-4" /> {team.stats.activePlayers}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground mb-1 text-[10px] font-bold tracking-widest uppercase">
                  Trophies
                </p>
                <p className="text-foreground flex items-center gap-1.5 font-semibold">
                  <Trophy className="text-primary h-4 w-4" /> {team.stats.championships} Major
                  Titles
                </p>
              </div>

              <div>
                <p className="text-muted-foreground mb-1 text-[10px] font-bold tracking-widest uppercase">
                  Est. Winnings
                </p>
                <p className="text-foreground font-semibold">{team.stats.totalWinnings}</p>
              </div>
            </div>
          </div>

          {/* External Links Card */}
          <div className="bg-card border-border rounded-sm border p-6">
            <h3 className="text-muted-foreground border-border mb-4 border-b pb-3 text-sm font-bold tracking-widest uppercase">
              Links
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={team.website}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground group flex items-center justify-between font-medium transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Globe className="h-5 w-5" /> Website
                </span>
                <ArrowRight className="text-primary h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
              <a
                href={`https://twitter.com/${team.twitter}`}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground group flex items-center justify-between font-medium transition-colors"
              >
                <span className="flex items-center gap-3">
                  <FaTwitter className="h-5 w-5" /> Twitter
                </span>
                <ArrowRight className="text-primary h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </div>
          </div>
        </FadeInUp>

        {/* Right Column: Bio, Rosters & Openings (Spans 8 cols on large screens) */}
        <div className="space-y-6 lg:col-span-8">
          {/* About Section */}
          <FadeInUp delay={0.2} className="bg-card border-border rounded-sm border p-6 md:p-8">
            <h2 className="text-foreground mb-4 text-xl font-bold tracking-tight uppercase">
              About {team.name}
            </h2>
            <p className="text-muted-foreground leading-relaxed font-medium">{team.description}</p>
          </FadeInUp>

          {/* Active Openings Section */}
          {team.openings.length > 0 && (
            <FadeInUp
              delay={0.3}
              className="bg-card border-primary/50 relative overflow-hidden rounded-sm border p-6 md:p-8"
            >
              {/* Subtle primary glow in the corner for openings */}
              <div className="bg-primary/10 pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full blur-[50px]" />

              <h2 className="text-foreground mb-6 flex items-center gap-2 text-xl font-bold tracking-tight uppercase">
                <Briefcase className="text-primary h-5 w-5" /> Active Listings
              </h2>
              <div className="relative z-10 space-y-3">
                {team.openings.map((job) => (
                  <div
                    key={job.id}
                    className="bg-secondary/50 border-border hover:border-primary/50 flex flex-col justify-between gap-4 rounded-sm border p-4 transition-colors sm:flex-row sm:items-center"
                  >
                    <div>
                      <h4 className="text-foreground font-bold tracking-tight">{job.title}</h4>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="text-primary bg-primary/10 rounded-sm px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase">
                          {job.type}
                        </span>
                        <span className="text-muted-foreground text-xs font-medium">
                          Posted {job.postedAt}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-sm text-xs font-bold tracking-widest uppercase transition-all"
                    >
                      VIEW & APPLY
                    </Button>
                  </div>
                ))}
              </div>
            </FadeInUp>
          )}

          {/* Rosters Section */}
          <FadeInUp delay={0.4} className="bg-card border-border rounded-sm border p-6 md:p-8">
            <h2 className="text-foreground mb-6 text-xl font-bold tracking-tight uppercase">
              Active Rosters
            </h2>

            <div className="space-y-8">
              {team.rosters.map((roster) => (
                <div key={roster.game} className="space-y-4">
                  <h3 className="text-muted-foreground border-border flex items-center gap-2 border-b pb-2 text-sm font-bold tracking-widest uppercase">
                    <Gamepad2 className="h-4 w-4" /> {roster.game}
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {roster.players.map((player) => (
                      <div
                        key={player.ign}
                        className="border-border bg-background hover:border-primary/50 flex flex-col rounded-sm border p-3 transition-colors"
                      >
                        <div className="mb-1 flex items-start justify-between">
                          <span className="text-foreground text-lg font-bold tracking-tight uppercase">
                            {player.ign}
                          </span>
                          <ShieldCheck className="text-primary h-4 w-4" />
                        </div>
                        <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                          {player.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FadeInUp>
        </div>
      </div>

      {/* Enroll Modal */}
      <EnrollModal
        team={team as any} // Typing cast for mock integration
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
      />
    </div>
  );
}
