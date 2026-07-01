import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { FormInput } from '@/components/custom/FormInput/FormInput';
import { Button } from '@/components/ui/button';
import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';
import { recruitmentApi } from '@/services/api';
import { toast } from 'sonner';
import { ArrowLeft, Send, ShieldCheck } from 'lucide-react';

export default function ApplyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: recruitments = [], isLoading } = useQuery({
    queryKey: ['recruitments'],
    queryFn: () => recruitmentApi.list(),
  });

  const recruitment = recruitments.find((r: any) => r.id === id);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      message: '',
    },
  });

  const applyMutation = useMutation({
    mutationFn: async (data: { message: string }) => {
      return recruitmentApi.apply(id || '', data);
    },
    onSuccess: () => {
      toast.success('Your application has been submitted successfully!');
      navigate('/dashboard');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to submit application.');
    },
  });

  const onSubmit = (data: { message: string }) => {
    applyMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex justify-center py-20 text-sm font-bold tracking-widest uppercase animate-pulse">
        LOADING APPLICATION DETAILS...
      </div>
    );
  }

  if (!recruitment) {
    return (
      <div className="text-center py-20">
        <h2 className="text-foreground text-2xl font-bold">Roster opening not found</h2>
        <p className="text-muted-foreground mt-2">The posting you are trying to apply for does not exist.</p>
        <Button onClick={() => navigate('/board')} className="mt-4 rounded-sm">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 max-w-lg mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/board')}
          className="border-border rounded-sm shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">Apply to Roster</h1>
          <p className="text-muted-foreground text-sm font-medium">
            Draft your cover letter to get noticed by {recruitment.organization?.name}.
          </p>
        </div>
      </div>

      {/* Recruitment detail preview */}
      <FadeInUp className="bg-secondary/35 border border-border p-6 rounded-sm space-y-3">
        <div className="flex gap-2 items-center">
          <span className="bg-primary/10 border border-primary/20 text-primary rounded-sm px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase">
            {recruitment.roleNeeded}
          </span>
          <span className="text-muted-foreground text-xs font-semibold">{recruitment.game}</span>
        </div>
        <div>
          <h3 className="text-foreground font-bold text-lg tracking-tight">{recruitment.title}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-muted-foreground text-sm font-medium">
              {recruitment.organization?.name}
            </span>
            {recruitment.organization?.verified && (
              <ShieldCheck className="text-primary h-3.5 w-3.5" />
            )}
          </div>
        </div>
        <p className="text-muted-foreground text-xs font-medium leading-relaxed">
          {recruitment.description}
        </p>
      </FadeInUp>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <FormInput
            control={control}
            name="message"
            label="COVER MESSAGE TO TEAM MANAGER"
            placeholder="Introduce yourself, list your agent pool, VOD links and availability..."
          />
        </div>

        <Button
          type="submit"
          disabled={applyMutation.isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-sm font-bold tracking-widest uppercase py-6 text-sm transition-colors"
        >
          {applyMutation.isPending ? (
            'SUBMITTING APPLICATION...'
          ) : (
            <span className="flex items-center gap-2">
              SUBMIT APPLICATION <Send className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}
