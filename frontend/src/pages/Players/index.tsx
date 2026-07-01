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
import { PlayerCard } from './PlayerCard';
import { playerApi } from '@/services/api';

export default function PlayersPage() {
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: players = [], isLoading } = useQuery({
    queryKey: ['players', gameFilter, roleFilter],
    queryFn: () =>
      playerApi.list({
        game: gameFilter === 'all' ? undefined : gameFilter,
        role: roleFilter === 'all' ? undefined : roleFilter,
      }),
  });

  const filteredPlayers = useMemo(() => {
    return players.filter((player: any) => {
      const ign = player.user?.displayName || '';
      const fullName = player.user?.username || '';
      const matchesSearch =
        ign.toLowerCase().includes(search.toLowerCase()) ||
        fullName.toLowerCase().includes(search.toLowerCase());

      const isSigned = !!player.teamId;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'lft' && !isSigned) ||
        (statusFilter === 'signed' && isSigned);

      return matchesSearch && matchesStatus;
    });
  }, [players, search, statusFilter]);

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
            <SelectItem value="all">All Players</SelectItem>
            <SelectItem value="lft">Looking for Team (LFT)</SelectItem>
            <SelectItem value="signed">Currently Signed</SelectItem>
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
            <SelectItem value="Valorant">Valorant</SelectItem>
            <SelectItem value="CS2">CS2</SelectItem>
            <SelectItem value="Apex Legends">Apex Legends</SelectItem>
            <SelectItem value="Overwatch 2">Overwatch 2</SelectItem>
            <SelectItem value="League of Legends">League of Legends</SelectItem>
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
            <SelectItem value="Duelist">Duelist</SelectItem>
            <SelectItem value="IGL">IGL</SelectItem>
            <SelectItem value="Sentinel">Sentinel</SelectItem>
            <SelectItem value="Support">Support</SelectItem>
            <SelectItem value="Entry Fragger">Entry Fragger</SelectItem>
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
          <div className="text-muted-foreground flex justify-center py-20 text-sm font-bold tracking-widest uppercase animate-pulse">
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
            {filteredPlayers.map((player: any) => (
              <PlayerCard
                key={player.id}
                player={{
                  id: player.id,
                  ign: player.user?.displayName || 'Unknown',
                  fullName: player.user?.username ? `@${player.user.username}` : '',
                  game: player.mainGame,
                  roles: [player.primaryRole],
                  rank: player.rank,
                  region: player.user?.country || 'Global',
                  verified: player.verified,
                  status: player.teamId ? 'Signed' : 'Lft',
                }}
              />
            ))}
          </FadeInUp>
        )}
      </main>
    </div>
  );
}
