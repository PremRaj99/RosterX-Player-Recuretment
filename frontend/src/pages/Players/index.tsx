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
import { PlayerCard, type PlayerSummary } from './PlayerCard';

// --- Mock Data Fetcher ---
const fetchPlayers = async (): Promise<PlayerSummary[]> => {
  await new Promise((res) => setTimeout(res, 800));
  return [
    {
      id: '1',
      ign: 'TenZ',
      fullName: 'Tyson Ngo',
      game: 'Valorant',
      roles: ['Entry Fragger', 'Flex'],
      rank: 'Radiant (Top 10)',
      region: 'NA',
      verified: true,
      status: 'Signed',
    },
    {
      id: '2',
      ign: 'm0NESY',
      fullName: 'Ilya Osipov',
      game: 'CS2',
      roles: ['AWPer'],
      rank: 'Faceit Lvl 10',
      region: 'EU',
      verified: true,
      status: 'Signed',
    },
    {
      id: '3',
      ign: 'RookieSniper',
      fullName: 'David Kim',
      game: 'Valorant',
      roles: ['Controller', 'IGL'],
      rank: 'Immortal 3',
      region: 'NA',
      verified: false,
      status: 'Lft',
    },
    {
      id: '4',
      ign: 'ImperialHal',
      fullName: 'Phillip Dosen',
      game: 'Apex Legends',
      roles: ['IGL', 'Fragger'],
      rank: 'Apex Predator',
      region: 'NA',
      verified: true,
      status: 'Signed',
    },
    {
      id: '5',
      ign: 'Shadow',
      fullName: 'Liam Smith',
      game: 'CS2',
      roles: ['Lurker', 'Support'],
      rank: 'Faceit Lvl 9',
      region: 'EU',
      verified: false,
      status: 'Lft',
    },
  ];
};

export default function PlayersPage() {
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('lft'); // Default to showing free agents

  const { data: players = [], isLoading } = useQuery({
    queryKey: ['players'],
    queryFn: fetchPlayers,
  });

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesSearch =
        player.ign.toLowerCase().includes(search.toLowerCase()) ||
        player.fullName.toLowerCase().includes(search.toLowerCase());
      const matchesGame =
        gameFilter === 'all' || player.game.toLowerCase() === gameFilter.toLowerCase();
      const matchesRole =
        roleFilter === 'all' ||
        player.roles.some((r) => r.toLowerCase() === roleFilter.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || player.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesGame && matchesRole && matchesStatus;
    });
  }, [players, search, gameFilter, roleFilter, statusFilter]);

  // Shared filter UI
  const FilterControls = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
          Search IGN
        </label>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
          <Input
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-background border-border rounded-sm pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
          Availability
        </label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-background border-border rounded-sm">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="lft">Looking for Team (LFT)</SelectItem>
            <SelectItem value="signed">Currently Signed</SelectItem>
            <SelectItem value="all">All Players</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
          Game
        </label>
        <Select value={gameFilter} onValueChange={setGameFilter}>
          <SelectTrigger className="bg-background border-border rounded-sm">
            <SelectValue placeholder="All Games" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Games</SelectItem>
            <SelectItem value="valorant">Valorant</SelectItem>
            <SelectItem value="cs2">CS2</SelectItem>
            <SelectItem value="apex legends">Apex Legends</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
          Role
        </label>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="bg-background border-border rounded-sm">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="entry fragger">Entry Fragger</SelectItem>
            <SelectItem value="igl">IGL</SelectItem>
            <SelectItem value="awper">AWPer</SelectItem>
            <SelectItem value="controller">Controller</SelectItem>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="flex">Flex</SelectItem>
            <SelectItem value="lurker">Lurker</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-8 md:flex-row">
      {/* Mobile Filter Header */}
      <div className="mb-4 flex items-center justify-between md:hidden">
        <h1 className="text-2xl font-bold tracking-tight">Scout Players</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="border-border gap-2 rounded-sm">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-card border-border w-75 border-l">
            <SheetHeader className="mb-6 text-left">
              <SheetTitle className="font-bold tracking-tight">Filter Players</SheetTitle>
            </SheetHeader>
            <FilterControls />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 md:block">
        <div className="sticky top-24 space-y-8">
          <div>
            <h1 className="mb-1 text-3xl font-bold tracking-tight">Scout</h1>
            <p className="text-muted-foreground text-sm">Find the missing piece.</p>
          </div>
          <FilterControls />
        </div>
      </aside>

      {/* Main Feed */}
      <main className="min-w-0 flex-1">
        {isLoading ? (
          <div className="text-muted-foreground flex justify-center py-20 text-sm font-bold tracking-widest uppercase">
            LOADING TALENT POOL...
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="bg-secondary/50 border-border flex flex-col items-center justify-center rounded-sm border py-20 text-center">
            <p className="text-foreground text-lg font-bold">No players match your criteria.</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Try broadening your search or adjusting filters.
            </p>
          </div>
        ) : (
          <FadeInUp className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filteredPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </FadeInUp>
        )}
      </main>
    </div>
  );
}
