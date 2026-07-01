import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';
import { FormInput } from '@/components/custom/FormInput/FormInput';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { orgApi, userApi } from '@/services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Megaphone } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function ManageRecruitmentsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: userApi.getMe,
  });

  const org = user?.organizations?.[0];

  // Fetch full org with recruitments
  const { data: orgDetail, isLoading: isLoadingOrg } = useQuery({
    queryKey: ['orgDetail', org?.slug],
    queryFn: () => orgApi.get(org.slug),
    enabled: !!org?.slug,
  });

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
      game: 'Valorant',
      roleNeeded: '',
      description: '',
    },
  });

  const createRecruitmentMutation = useMutation({
    mutationFn: async (data: { title: string; game: string; roleNeeded: string; description: string }) => {
      return orgApi.createRecruitment(org.id, data);
    },
    onSuccess: () => {
      toast.success('Recruitment posting published successfully!');
      reset();
      queryClient.invalidateQueries({ queryKey: ['orgDetail', org.slug] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to publish posting');
    },
  });

  const onSubmit = (data: any) => {
    createRecruitmentMutation.mutate(data);
  };

  if (isLoading || isLoadingOrg) {
    return (
      <div className="text-muted-foreground flex justify-center py-20 text-sm font-bold tracking-widest uppercase animate-pulse">
        SYNCING RECRUITMENT POSTS...
      </div>
    );
  }

  if (!org) {
    return (
      <div className="text-center py-20">
        <h2 className="text-foreground text-2xl font-bold">No Organization Set Up</h2>
        <Button onClick={() => navigate('/onboarding')} className="mt-4 rounded-sm">
          Complete Onboarding
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/org/dashboard')}
          className="border-border rounded-sm shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">Manage Recruitments</h1>
          <p className="text-muted-foreground text-sm font-medium">
            Publish open player slots and manage your recruitment advertisements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create recruitment */}
        <FadeInUp className="lg:col-span-5 bg-card border border-border p-6 rounded-sm space-y-4 h-fit">
          <h3 className="text-foreground font-bold text-lg border-b border-border/50 pb-2">
            Publish Recruitment Post
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput control={control} name="title" label="POST TITLE" placeholder="Seeking Sentinel for VCT Trials" />
            <FormInput control={control} name="game" label="GAME TITLE" placeholder="e.g. Valorant" />
            <FormInput control={control} name="roleNeeded" label="ROLE NEEDED" placeholder="e.g. Sentinel, IGL" />

            <Controller
              control={control}
              name="description"
              render={({ field, fieldState: { error } }) => (
                <div className="flex flex-col space-y-1.5">
                  <Label className="text-xs font-bold tracking-wide text-muted-foreground">DESCRIPTION</Label>
                  <Textarea
                    placeholder="Provide details about requirements, schedules, etc..."
                    className={`border-border bg-background min-h-24 rounded-sm focus-visible:ring-1 ${error ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                    {...field}
                  />
                </div>
              )}
            />

            <Button
              type="submit"
              disabled={createRecruitmentMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-sm font-bold tracking-widest uppercase"
            >
              {createRecruitmentMutation.isPending ? 'PUBLISHING...' : 'PUBLISH LISTING'}
            </Button>
          </form>
        </FadeInUp>

        {/* List postings */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-foreground font-bold text-xl tracking-tight">Active Postings ({orgDetail?.recruitments?.length || 0})</h3>

          {orgDetail?.recruitments?.length > 0 ? (
            <div className="space-y-4">
              {orgDetail.recruitments.map((rec: any) => (
                <div key={rec.id} className="bg-card border border-border p-5 rounded-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-foreground font-bold text-lg leading-tight">{rec.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-secondary border border-border text-foreground rounded-sm px-2 py-0.5 text-[9px] font-bold uppercase">
                          {rec.game}
                        </span>
                        <span className="bg-primary/10 border border-primary/20 text-primary rounded-sm px-2 py-0.5 text-[9px] font-bold uppercase">
                          {rec.roleNeeded}
                        </span>
                      </div>
                    </div>
                    <span className="bg-green-500/10 border border-green-500/20 text-green-500 rounded-sm px-2.5 py-0.5 text-[10px] font-bold uppercase">
                      {rec.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed font-semibold">
                    {rec.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-secondary/20 border border-border p-12 rounded-sm text-center">
              <Megaphone className="text-muted-foreground h-10 w-10 opacity-50 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm font-medium">
                No active recruitment postings. Create one using the form on the left.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
