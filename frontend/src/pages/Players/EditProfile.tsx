import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '@/components/custom/FormInput/FormInput';
import { Button } from '@/components/ui/button';
import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';
import { userApi, playerApi } from '@/services/api';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: userApi.getMe,
  });

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      mainGame: '',
      primaryRole: '',
      rank: '',
      stats: {
        kdRatio: 0,
        winRate: 0,
        matchesPlayed: 0,
        mvpCount: 0,
      },
      achievements: [] as { title: string; description: string; awardedAt?: string }[],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'achievements',
  });

  // Prefill data
  useEffect(() => {
    if (user?.playerProfile) {
      const profile = user.playerProfile;
      reset({
        mainGame: profile.mainGame || '',
        primaryRole: profile.primaryRole || '',
        rank: profile.rank || '',
        stats: {
          kdRatio: profile.stats?.kdRatio || 0,
          winRate: profile.stats?.winRate || 0,
          matchesPlayed: profile.stats?.matchesPlayed || 0,
          mvpCount: profile.stats?.mvpCount || 0,
        },
        achievements: (profile.achievements || []).map((a: any) => ({
          title: a.title || '',
          description: a.description || '',
          awardedAt: a.awardedAt || new Date().toISOString(),
        })),
      });
    }
  }, [user, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      // Cast stats fields to appropriate types
      const payload = {
        ...data,
        stats: {
          kdRatio: parseFloat(data.stats.kdRatio) || 0,
          winRate: parseFloat(data.stats.winRate) || 0,
          matchesPlayed: parseInt(data.stats.matchesPlayed) || 0,
          mvpCount: parseInt(data.stats.mvpCount) || 0,
        },
      };
      return playerApi.updateProfile(payload);
    },
    onSuccess: () => {
      toast.success('Player profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['me'] });
      navigate('/dashboard');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    },
  });

  const onSubmit = (data: any) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex justify-center py-20 text-sm font-bold tracking-widest uppercase animate-pulse">
        LOADING STATS PANEL...
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="border-border rounded-sm shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">Edit Player Profile</h1>
          <p className="text-muted-foreground text-sm font-medium">
            Update your gaming credentials, statistics, and career achievements.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Core Game Profile */}
        <FadeInUp className="bg-card border-border rounded-sm border p-6 space-y-4">
          <h3 className="text-foreground font-bold text-lg tracking-tight border-b border-border/50 pb-2">
            Game Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput control={control} name="mainGame" label="MAIN GAME" />
            <FormInput control={control} name="primaryRole" label="PRIMARY ROLE" />
            <FormInput control={control} name="rank" label="CURRENT RANK" />
          </div>
        </FadeInUp>

        {/* Stats */}
        <FadeInUp delay={0.05} className="bg-card border-border rounded-sm border p-6 space-y-4">
          <h3 className="text-foreground font-bold text-lg tracking-tight border-b border-border/50 pb-2">
            RosterX Verified Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <FormInput control={control} name="stats.kdRatio" label="K/D RATIO" type="number" step="0.01" />
            <FormInput control={control} name="stats.winRate" label="WIN RATE (%)" type="number" step="0.1" />
            <FormInput control={control} name="stats.matchesPlayed" label="MATCHES PLAYED" type="number" />
            <FormInput control={control} name="stats.mvpCount" label="MVP COUNT" type="number" />
          </div>
        </FadeInUp>

        {/* Achievements list */}
        <FadeInUp delay={0.1} className="bg-card border-border rounded-sm border p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <h3 className="text-foreground font-bold text-lg tracking-tight">
              Trophy Achievements
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ title: '', description: '', awardedAt: new Date().toISOString() })}
              className="border-border rounded-sm font-semibold gap-1 text-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Add Achievement
            </Button>
          </div>

          {fields.length === 0 ? (
            <p className="text-muted-foreground text-center py-6 text-sm font-medium">
              No achievements listed. Add achievements to stand out to scouts.
            </p>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="bg-secondary/30 border border-border p-4 rounded-sm space-y-3 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-8">
                    <FormInput control={control} name={`achievements.${index}.title`} label="ACHIEVEMENT TITLE" />
                    <FormInput control={control} name={`achievements.${index}.awardedAt`} label="AWARD DATE" type="date" />
                  </div>
                  <FormInput control={control} name={`achievements.${index}.description`} label="DESCRIPTION" />
                </div>
              ))}
            </div>
          )}
        </FadeInUp>

        <Button
          type="submit"
          disabled={updateMutation.isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-sm font-bold tracking-widest uppercase py-6 text-sm transition-colors"
        >
          {updateMutation.isPending ? 'SAVING PROFILE...' : 'SAVE PROFILE DETAILS'}
        </Button>
      </form>
    </div>
  );
}
