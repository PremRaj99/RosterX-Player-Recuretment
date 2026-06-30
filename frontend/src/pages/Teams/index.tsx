import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';
import { TeamCard, type TeamSummary } from './TeamCard';
import { EnrollModal } from './EnrollModal';

// --- Mock Data Fetcher ---
const fetchTeams = async (): Promise<TeamSummary[]> => {
  await new Promise((res) => setTimeout(res, 800));
  return [
    {
      id: '1',
      name: 'Sentinels',
      games: ['Valorant', 'Halo', 'Apex Legends'],
      region: 'North America',
      activeRosterCount: 15,
      isRecruiting: true,
      description:
        'Premier North American esports organization. Building championship rosters across multiple FPS titles.',
      verified: true,
    },
    {
      id: '2',
      name: 'Team Liquid',
      games: ['CS2', 'Valorant', 'League of Legends'],
      region: 'Europe / NA',
      activeRosterCount: 42,
      isRecruiting: false,
      description:
        'Global esports powerhouse. We forge legacy through dedication and elite talent development.',
      verified: true,
    },
    {
      id: '3',
      name: 'Paper Rex',
      games: ['Valorant'],
      region: 'APAC',
      activeRosterCount: 6,
      isRecruiting: true,
      description:
        'W gaming. We are always looking for hyper-aggressive, mechanically gifted players in the APAC region.',
      verified: true,
    },
    {
      id: '4',
      name: 'DarkZero',
      games: ['Apex Legends', 'Rainbow Six'],
      region: 'North America',
      activeRosterCount: 8,
      isRecruiting: true,
      description:
        'Data-driven esports organization focused on absolute dominance in battle royale and tactical shooters.',
      verified: true,
    },
    {
      id: '5',
      name: 'Ascend Academy',
      games: ['CS2'],
      region: 'Europe',
      activeRosterCount: 5,
      isRecruiting: false,
      description:
        'Tier 2 developmental roster focused on cultivating the next generation of European CS2 talent.',
      verified: false,
    },
  ];
};

export default function TeamsPage() {
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedTeam, setSelectedTeam] = useState<TeamSummary | null>(null);

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  });

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const matchesSearch = team.name.toLowerCase().includes(search.toLowerCase());
      const matchesGame =
        gameFilter === 'all' ||
        team.games.some((g) => g.toLowerCase() === gameFilter.toLowerCase());
      const matchesRegion =
        regionFilter === 'all' || team.region.toLowerCase().includes(regionFilter.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === 'recruiting') matchesStatus = team.isRecruiting === true;
      if (statusFilter === 'full') matchesStatus = team.isRecruiting === false;

      return matchesSearch && matchesGame && matchesRegion && matchesStatus;
    });
  }, [teams, search, gameFilter, regionFilter, statusFilter]);

  // Shared filter UI
  const FilterControls = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold tracking-wide uppercase">Search Orgs</label>
        <div className="relative">
          <Search className="absolute top-2.5 left-3 h-4 w-4" />
          <Input
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-border rounded-sm pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold tracking-wide uppercase">Hiring Status</label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="border-border rounded-sm">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Teams</SelectItem>
            <SelectItem value="recruiting">Actively Recruiting</SelectItem>
            <SelectItem value="full">Roster Full</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold tracking-wide uppercase">Game</label>
        <Select value={gameFilter} onValueChange={setGameFilter}>
          <SelectTrigger className="border-border rounded-sm">
            <SelectValue placeholder="All Games" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Games</SelectItem>
            <SelectItem value="valorant">Valorant</SelectItem>
            <SelectItem value="cs2">CS2</SelectItem>
            <SelectItem value="apex legends">Apex Legends</SelectItem>
            <SelectItem value="league of legends">League of Legends</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold tracking-wide uppercase">Region</label>
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="border-border rounded-sm">
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="north america">North America</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
            <SelectItem value="apac">APAC</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-8 md:flex-row">
      {/* Mobile Filter Header */}
      <div className="mb-4 flex items-center justify-between md:hidden">
        <h1 className="text-2xl font-bold tracking-tight uppercase">Organizations</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-border gap-2 rounded-sm text-xs font-bold tracking-widest uppercase"
            >
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-accent-foreground text-accent border-border w-75 border-l px-4"
          >
            <SheetHeader className="text-accent mb-6 text-left">
              <SheetTitle className="text-accent font-bold tracking-tight uppercase">
                Filter Teams
              </SheetTitle>
            </SheetHeader>
            <FilterControls />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 md:block">
        <div className="sticky top-24 space-y-8">
          <div>
            <h1 className="mb-1 text-3xl font-bold tracking-tight uppercase">Teams</h1>
            <p className="text-muted-foreground text-sm">Submit your profile directly.</p>
          </div>
          <FilterControls />
        </div>
      </aside>

      {/* Main Feed */}
      <main className="min-w-0 flex-1">
        {isLoading ? (
          <div className="text-muted-foreground flex justify-center py-20 text-sm font-bold tracking-widest uppercase">
            LOADING ORGANIZATIONS...
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="bg-secondary/50 border-border flex flex-col items-center justify-center rounded-sm border py-20 text-center">
            <p className="text-foreground text-lg font-bold tracking-tight uppercase">
              No teams found.
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Adjust your filters to see more organizations.
            </p>
          </div>
        ) : (
          <FadeInUp className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filteredTeams.map((team) => (
              <TeamCard key={team.id} team={team} onEnroll={(team) => setSelectedTeam(team)} />
            ))}
          </FadeInUp>
        )}
      </main>

      <EnrollModal
        team={selectedTeam}
        isOpen={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
      />
    </div>
  );
}
