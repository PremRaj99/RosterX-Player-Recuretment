import { ShieldCheck, Trophy, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface PlayerSummary {
  id: string;
  ign: string;
  fullName: string;
  game: string;
  roles: string[];
  rank: string;
  region: string;
  verified: boolean;
  status: 'Lft' | 'Signed'; // Lft = Looking for Team
}

interface PlayerCardProps {
  player: PlayerSummary;
}

export function PlayerCard({ player }: PlayerCardProps) {
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
                {player.ign.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="mb-0.5 flex items-center gap-2">
              <h3 className="text-foreground text-xl font-bold tracking-tight uppercase">
                {player.ign}
              </h3>
              {player.verified && <ShieldCheck className="text-primary h-4 w-4 shrink-0" />}
            </div>
            <p className="text-muted-foreground text-sm font-medium">{player.fullName}</p>
          </div>
        </div>

        {player.status === 'Lft' ? (
          <span className="text-primary bg-primary/10 border-primary/20 shrink-0 rounded-sm border px-2 py-1 text-[10px] font-bold tracking-widest uppercase">
            LFT
          </span>
        ) : (
          <span className="text-muted-foreground bg-secondary border-border shrink-0 rounded-sm border px-2 py-1 text-[10px] font-bold tracking-widest uppercase">
            SIGNED
          </span>
        )}
      </div>

      <div className="mb-6 grid flex-1 grid-cols-2 gap-3">
        <div>
          <p className="text-muted-foreground mb-1 text-[10px] font-bold tracking-widest uppercase">
            Game
          </p>
          <p className="text-foreground text-sm font-semibold">{player.game}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1 text-[10px] font-bold tracking-widest uppercase">
            Rank / Elo
          </p>
          <p className="text-foreground flex items-center gap-1.5 text-sm font-semibold">
            <Trophy className="text-primary h-3.5 w-3.5" /> {player.rank}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1 text-[10px] font-bold tracking-widest uppercase">
            Region
          </p>
          <p className="text-foreground flex items-center gap-1.5 text-sm font-semibold">
            <MapPin className="text-muted-foreground h-3.5 w-3.5" /> {player.region}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1 text-[10px] font-bold tracking-widest uppercase">
            Roles
          </p>
          <p
            className="text-foreground truncate text-sm font-semibold"
            title={player.roles.join(', ')}
          >
            {player.roles.join(', ')}
          </p>
        </div>
      </div>

      <Button
        onClick={() => navigate(`/player/profile/${player.id}`)}
        className="bg-secondary hover:bg-primary text-foreground hover:text-primary-foreground border-border hover:border-primary w-full rounded-sm border font-bold tracking-widest uppercase shadow-none transition-all"
      >
        VIEW PROFILE
      </Button>
    </motion.div>
  );
}
