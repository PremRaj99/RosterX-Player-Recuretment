import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormInput } from '@/components/custom/FormInput/FormInput';

const jobPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  game: z.string().min(2, 'Game name is required.'),
  rolesRequired: z.string().min(2, 'List at least one role.'),
  description: z.string().min(20, 'Description needs more detail (min 20 chars).'),
  requirements: z.string().min(10, 'List some basic requirements.'),
});

type JobPostValues = z.infer<typeof jobPostSchema>;

export function CreatePostForm() {
  const { control, handleSubmit, reset } = useForm<JobPostValues>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      title: '',
      game: '',
      rolesRequired: '',
      description: '',
      requirements: '',
    },
  });

  const postMutation = useMutation({
    mutationFn: async (data: JobPostValues) => {
      await new Promise((res) => setTimeout(res, 1000));
      console.log('New Post:', data);
    },
    onSuccess: () => reset(),
  });

  return (
    <div className="bg-card border-border rounded-sm border p-6">
      <h2 className="mb-6 text-2xl font-bold tracking-tight">Create New Listing</h2>

      <form onSubmit={handleSubmit((d) => postMutation.mutate(d))} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            control={control}
            name="title"
            label="POSTING TITLE"
            placeholder="e.g. Seeking Tier 1 IGL"
          />
          <FormInput control={control} name="game" label="GAME" placeholder="e.g. CS2, Valorant" />
        </div>

        <FormInput
          control={control}
          name="rolesRequired"
          label="ROLES REQUIRED"
          placeholder="e.g. Entry Fragger, IGL (Comma separated)"
        />

        <Controller
          control={control}
          name="description"
          render={({ field, fieldState: { error } }) => (
            <div className="flex flex-col space-y-1.5">
              <Label
                className={`text-sm font-semibold tracking-wide ${error ? 'text-destructive' : 'text-foreground'}`}
              >
                JOB DESCRIPTION
              </Label>
              <Textarea
                placeholder="Describe the team goals, schedule, and compensation..."
                className={`border-border bg-background min-h-30 rounded-sm focus-visible:ring-1 ${error ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                {...field}
              />
              {error && (
                <span className="text-destructive mt-1 text-xs font-medium">{error.message}</span>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="requirements"
          render={({ field, fieldState: { error } }) => (
            <div className="flex flex-col space-y-1.5">
              <Label
                className={`text-sm font-semibold tracking-wide ${error ? 'text-destructive' : 'text-foreground'}`}
              >
                PLAYER REQUIREMENTS
              </Label>
              <Textarea
                placeholder="e.g. Min 2000 Elo, LAN experience required, Fluent English..."
                className={`border-border bg-background min-h-25 rounded-sm focus-visible:ring-1 ${error ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                {...field}
              />
              {error && (
                <span className="text-destructive mt-1 text-xs font-medium">{error.message}</span>
              )}
            </div>
          )}
        />

        <Button
          type="submit"
          disabled={postMutation.isPending}
          className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-sm font-bold tracking-wide md:w-auto md:px-8"
        >
          {postMutation.isPending ? 'PUBLISHING...' : 'PUBLISH POSTING'}
        </Button>
      </form>
    </div>
  );
}
