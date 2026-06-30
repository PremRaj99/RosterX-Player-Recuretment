import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle2, Gamepad2, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface TeamSummary {
  id: string;
  name: string;
  games: string[];
  region: string;
  activeRosterCount: number;
  isRecruiting: boolean;
  description: string;
  verified: boolean;
}

interface TeamCardProps {
  team: TeamSummary;
  onEnroll: (team: TeamSummary) => void;
}

export function TeamCard({ team, onEnroll }: TeamCardProps) {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ y: -4, borderColor: '#F5410A' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-card border-border flex flex-col rounded-sm border p-5 transition-colors md:p-6"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-secondary border-border flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border">
            <Avatar className="border-border h-10 w-10 border">
              <AvatarImage
                src={`https://picsum.photos/200`}
                className="rounded-none object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {team.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="mb-0.5 flex items-center gap-2">
              <h3 className="text-foreground text-xl font-bold tracking-tight uppercase">
                {team.name}
              </h3>
              {team.verified && <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />}
            </div>
            <p className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
              <MapPin className="h-3.5 w-3.5" /> {team.region}
            </p>
          </div>
        </div>

        {team.isRecruiting ? (
          <span className="text-primary bg-primary/10 border-primary/20 shrink-0 rounded-sm border px-2 py-1 text-[10px] font-bold tracking-widest uppercase">
            RECRUITING
          </span>
        ) : (
          <span className="text-muted-foreground bg-secondary border-border shrink-0 rounded-sm border px-2 py-1 text-[10px] font-bold tracking-widest uppercase">
            ROSTER FULL
          </span>
        )}
      </div>

      <p className="text-muted-foreground mb-6 line-clamp-2 flex-1 text-sm">{team.description}</p>

      <div className="border-border mb-6 grid grid-cols-2 gap-4 border-t pt-4">
        <div>
          <p className="text-muted-foreground mb-1 flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase">
            <Gamepad2 className="h-3 w-3" /> Games
          </p>
          <p
            className="text-foreground truncate text-sm font-semibold"
            title={team.games.join(', ')}
          >
            {team.games.join(', ')}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1 flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase">
            <Users className="h-3 w-3" /> Roster Size
          </p>
          <p className="text-foreground text-sm font-semibold">
            {team.activeRosterCount} Active Players
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="border-border hover:bg-secondary text-foreground flex-1 rounded-sm bg-transparent text-xs font-bold tracking-widest uppercase"
          onClick={() => navigate(`/team/${team.id}`)}
        >
          VIEW TEAM
        </Button>
        <Button
          onClick={() => onEnroll(team)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary flex-1 rounded-sm border text-xs font-bold tracking-widest uppercase shadow-none"
        >
          ENROLL NOW
        </Button>
      </div>
    </motion.div>
  );
}
