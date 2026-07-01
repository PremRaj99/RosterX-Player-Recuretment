import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormInput } from '@/components/custom/FormInput/FormInput';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';
import { playerApi, orgApi, userApi } from '@/services/api';
import { useCurrUser } from '@/store/userStore';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useCurrUser();

  const isPlayer = user.role === 'player';

  // Get passed data from registration if available
  const initialRoles = location.state?.roles || [];
  const initialOrgName = location.state?.orgName || '';

  // --- Player Onboarding Form ---
  const playerForm = useForm({
    defaultValues: {
      mainGame: 'Valorant',
      primaryRole: initialRoles[0] || 'Duelist',
      rank: 'Immortal 1',
    },
  });

  const playerOnboardMutation = useMutation({
    mutationFn: async (data: { mainGame: string; primaryRole: string; rank: string }) => {
      await playerApi.createProfile(data);
      const fullUser = await userApi.getMe();
      setUser(fullUser);
    },
    onSuccess: () => {
      toast.success('Player profile initialized! Welcome to the hub.');
      navigate('/dashboard');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create profile.');
    },
  });

  // --- Organizer Onboarding Form ---
  const orgForm = useForm({
    defaultValues: {
      name: initialOrgName,
      logoUrl: '',
      games: ['Valorant'],
      description: '',
    },
  });

  const [selectedGames, setSelectedGames] = useState<string[]>(['Valorant']);
  const availableGames = ['Valorant', 'CS2', 'Apex Legends', 'Overwatch 2', 'League of Legends'];

  const orgOnboardMutation = useMutation({
    mutationFn: async (data: { name: string; logoUrl?: string; games: string[]; description?: string }) => {
      await orgApi.create(data);
      const fullUser = await userApi.getMe();
      setUser(fullUser);
    },
    onSuccess: () => {
      toast.success('Organization created! Welcome to your dashboard.');
      navigate('/org/dashboard');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create organization.');
    },
  });

  const onPlayerSubmit = (data: any) => {
    playerOnboardMutation.mutate(data);
  };

  const onOrgSubmit = (data: any) => {
    orgOnboardMutation.mutate({ ...data, games: selectedGames });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-6">
      <FadeInUp className="bg-card border-border w-full max-w-lg rounded-sm border p-8 shadow-xl">
        <div className="mb-6 space-y-1.5">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">Complete Onboarding</h1>
          <p className="text-muted-foreground text-sm font-medium">
            {isPlayer
              ? 'Tell us about your competitive background to start scouting.'
              : 'Set up your gaming organization to start recruiting players.'}
          </p>
        </div>

        {isPlayer ? (
          <form onSubmit={playerForm.handleSubmit(onPlayerSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormInput
                control={playerForm.control}
                name="mainGame"
                label="MAIN GAME"
                placeholder="e.g. Valorant, CS2"
              />
              <FormInput
                control={playerForm.control}
                name="primaryRole"
                label="PRIMARY ROLE"
                placeholder="e.g. IGL, Duelist, AWPer"
              />
              <FormInput
                control={playerForm.control}
                name="rank"
                label="CURRENT RANK"
                placeholder="e.g. Radiant, Faceit Lvl 10"
              />
            </div>

            <Button
              type="submit"
              disabled={playerOnboardMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-sm font-bold tracking-widest uppercase transition-colors"
            >
              {playerOnboardMutation.isPending ? 'CREATING PROFILE...' : 'COMPLETE PROFILE'}
            </Button>
          </form>
        ) : (
          <form onSubmit={orgForm.handleSubmit(onOrgSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormInput
                control={orgForm.control}
                name="name"
                label="ORGANIZATION NAME"
                placeholder="e.g. Velocity Gaming"
              />
              <FormInput
                control={orgForm.control}
                name="logoUrl"
                label="LOGO URL (OPTIONAL)"
                placeholder="https://..."
              />
              <FormInput
                control={orgForm.control}
                name="description"
                label="BIO / DESCRIPTION"
                placeholder="Tell players about your esports organization..."
              />

              <div className="space-y-2 pt-2">
                <Label className="text-sm font-semibold tracking-wide text-foreground">
                  SUPPORTED TITLES
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableGames.map((game) => (
                    <label
                      key={game}
                      className="border-border hover:bg-secondary/50 flex cursor-pointer items-center space-x-2 rounded-sm border p-2.5 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGames.includes(game)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedGames([...selectedGames, game]);
                          } else {
                            setSelectedGames(selectedGames.filter((g) => g !== game));
                          }
                        }}
                        className="accent-primary h-4 w-4 cursor-pointer"
                      />
                      <span className="text-muted-foreground text-sm font-medium">{game}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={orgOnboardMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-sm font-bold tracking-widest uppercase transition-colors"
            >
              {orgOnboardMutation.isPending ? 'CREATING ORG...' : 'INITIALIZE ORGANIZATION'}
            </Button>
          </form>
        )}
      </FadeInUp>
    </div>
  );
}
