import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';
import { recruitmentApi } from '@/services/api';
import { useCurrUser } from '@/store/userStore';

export default function RecruitmentBoardPage() {
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const { user } = useCurrUser();

  const { data: recruitments = [], isLoading } = useQuery({
    queryKey: ['recruitments', gameFilter],
    queryFn: () =>
      recruitmentApi.list({
        status: 'open',
        game: gameFilter === 'all' ? undefined : gameFilter,
      }),
  });

  const filteredRecruitments = recruitments.filter((rec: any) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(search.toLowerCase()) ||
      rec.roleNeeded.toLowerCase().includes(search.toLowerCase()) ||
      rec.organization?.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const isPlayer = user?.role === 'player';

  return (
    <div className="space-y-10 py-6">
      {/* Header */}
      <section className="space-y-4">
        <h1 className="text-foreground text-3xl font-black tracking-tight md:text-5xl">
          RECRUITMENT BOARD
        </h1>
        <p className="text-muted-foreground max-w-xl text-sm font-medium">
          Browse open roster spots from verified teams. Submit your application directly to team managers.
        </p>
      </section>

      {/* Filters */}
      <section className="flex flex-col sm:flex-row gap-4 items-center bg-card border border-border p-4 rounded-sm">
        <div className="relative flex-1 w-full">
          <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
          <Input
            placeholder="Search by title, role or organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-background border-border rounded-sm pl-9"
          />
        </div>
        <div className="w-full sm:w-48">
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
      </section>

      {/* Feed */}
      <main className="space-y-4">
        {isLoading ? (
          <div className="text-muted-foreground flex justify-center py-20 text-sm font-bold tracking-widest uppercase animate-pulse">
            LOADING OPEN ROSTER SPOTS...
          </div>
        ) : filteredRecruitments.length === 0 ? (
          <div className="bg-secondary/50 border border-border flex flex-col items-center justify-center rounded-sm py-20 text-center">
            <p className="text-foreground text-lg font-bold">No active recruitments.</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Check back later or adjust search filters.
            </p>
          </div>
        ) : (
          <FadeInUp className="grid grid-cols-1 gap-4">
            {filteredRecruitments.map((rec: any) => (
              <div
                key={rec.id}
                className="bg-card border border-border hover:border-primary/50 flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-6 rounded-sm transition-all"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-secondary border border-border text-foreground rounded-sm px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase">
                      {rec.game}
                    </span>
                    <span className="bg-primary/10 border border-primary/20 text-primary rounded-sm px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase">
                      {rec.roleNeeded}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-foreground text-xl font-bold tracking-tight">{rec.title}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-muted-foreground text-sm font-semibold">
                        {rec.organization?.name}
                      </span>
                      {rec.organization?.verified && (
                        <ShieldCheck className="text-primary h-4 w-4" />
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm font-medium line-clamp-2">
                    {rec.description}
                  </p>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  {isPlayer ? (
                    <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto rounded-sm font-bold tracking-widest uppercase">
                      <Link to={`/board/${rec.id}/apply`}>
                        Apply Now <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : user?.id ? (
                    <Button disabled variant="outline" className="border-border w-full sm:w-auto rounded-sm font-bold tracking-widest uppercase">
                      Player Profile Required
                    </Button>
                  ) : (
                    <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto rounded-sm font-bold tracking-widest uppercase">
                      <Link to="/login">Login to Apply</Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </FadeInUp>
        )}
      </main>
    </div>
  );
}
