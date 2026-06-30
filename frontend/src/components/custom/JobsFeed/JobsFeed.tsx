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
import { JobCard, type Job } from '../JobCard/JobCard';
import { ApplyModal } from '../ApplyModal/ApplyModal';

// --- Mock Data Fetcher ---
const fetchJobs = async (): Promise<Job[]> => {
  await new Promise((res) => setTimeout(res, 800));
  return [
    {
      id: '1',
      orgName: 'Sentinels',
      game: 'Valorant',
      roles: ['Entry Fragger', 'Flex'],
      description:
        'Looking for a high-impact entry to complete our VCT Americas roster. Must have Tier 1 experience.',
      postedAt: '2h ago',
    },
    {
      id: '2',
      orgName: 'Cloud9',
      game: 'CS2',
      roles: ['IGL', 'AWPer'],
      description:
        'Rebuilding our core. Seeking a tactical IGL with strong mid-round calling and a reliable primary AWP.',
      postedAt: '5h ago',
    },
    {
      id: '3',
      orgName: 'NRG',
      game: 'Apex Legends',
      roles: ['Fragger', 'Anchor'],
      description:
        'Scouting for ALGS Year 4. Need mechanically gifted players with LAN experience.',
      postedAt: '1d ago',
    },
    {
      id: '4',
      orgName: 'Fnatic',
      game: 'Valorant',
      roles: ['Controller', 'Support'],
      description: 'European operations looking for a disciplined controller main. VCT EMEA.',
      postedAt: '2d ago',
    },
  ];
};

export function JobsFeed() {
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.orgName.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase());
      const matchesGame =
        gameFilter === 'all' || job.game.toLowerCase() === gameFilter.toLowerCase();
      const matchesRole =
        roleFilter === 'all' || job.roles.some((r) => r.toLowerCase() === roleFilter.toLowerCase());

      return matchesSearch && matchesGame && matchesRole;
    });
  }, [jobs, search, gameFilter, roleFilter]);

  // Shared filter UI for both desktop sidebar and mobile sheet
  const FilterControls = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
          Search
        </label>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
          <Input
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-background border-border rounded-sm pl-9"
          />
        </div>
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
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-8 md:flex-row">
      {/* Mobile Filter Header */}
      <div className="mb-4 flex items-center justify-between md:hidden">
        <h1 className="text-2xl font-bold tracking-tight">Active Listings</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="border-border gap-2 rounded-sm">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-card border-border w-75 border-l">
            <SheetHeader className="mb-6 text-left">
              <SheetTitle className="font-bold tracking-tight">Filter Openings</SheetTitle>
            </SheetHeader>
            <FilterControls />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 md:block">
        <div className="sticky top-24 space-y-8">
          <div>
            <h1 className="mb-1 text-3xl font-bold tracking-tight">Listings</h1>
            <p className="text-muted-foreground text-sm">Find your next roster.</p>
          </div>
          <FilterControls />
        </div>
      </aside>

      {/* Main Feed */}
      <main className="min-w-0 flex-1">
        {isLoading ? (
          <div className="text-muted-foreground flex justify-center py-20 font-medium tracking-wide">
            LOADING OPPORTUNITIES...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-secondary/50 border-border flex flex-col items-center justify-center rounded-sm border py-20 text-center">
            <p className="text-foreground text-lg font-bold">No openings found.</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Adjust your filters to see more results.
            </p>
          </div>
        ) : (
          <FadeInUp className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onApply={(job) => setSelectedJob(job)} />
            ))}
          </FadeInUp>
        )}
      </main>

      <ApplyModal job={selectedJob} isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}
