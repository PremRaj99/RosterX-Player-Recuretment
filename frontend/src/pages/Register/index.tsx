import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  playerRegistrationSchema,
  type PlayerRegistrationFormValues,
  orgRegistrationSchema,
  type OrgRegistrationFormValues,
} from '@/validators/schemas';
import { FormInput } from '@/components/custom/FormInput/FormInput';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';
import { authApi, userApi } from '@/services/api';
import { useCurrUser } from '@/store/userStore';
import { toast } from 'sonner';

const GAME_ROLES = ['Entry Fragger', 'Support', 'IGL', 'Lurker', 'AWPer'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useCurrUser((state) => state.setUser);

  // --- Player Form Setup ---
  const playerForm = useForm<PlayerRegistrationFormValues>({
    resolver: zodResolver(playerRegistrationSchema),
    defaultValues: { username: '', email: '', password: '', gameRoles: [] },
  });

  const playerMutation = useMutation({
    mutationFn: async (data: PlayerRegistrationFormValues) => {
      // 1. Register player account
      await authApi.register({
        email: data.email,
        password: data.password,
        username: data.username,
        displayName: data.username,
        role: 'player',
      });

      // 2. Fetch profile details (since register automatically logs in and sets cookies)
      const fullUser = await userApi.getMe();
      setUser(fullUser);
      return data;
    },
    onSuccess: (data) => {
      toast.success('Account created! Let\'s complete your player profile.');
      // Pass the roles list to onboarding page via navigation state
      navigate('/onboarding', { state: { roles: data.gameRoles } });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Registration failed.');
    },
  });

  // --- Org Form Setup ---
  const orgForm = useForm<OrgRegistrationFormValues>({
    resolver: zodResolver(orgRegistrationSchema),
    defaultValues: { orgName: '', email: '', password: '', website: '' },
  });

  const orgMutation = useMutation({
    mutationFn: async (data: OrgRegistrationFormValues) => {
      // 1. Register organization account
      const username = data.orgName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      await authApi.register({
        email: data.email,
        password: data.password,
        username,
        displayName: data.orgName,
        role: 'organizer',
      });

      // 2. Fetch profile details
      const fullUser = await userApi.getMe();
      setUser(fullUser);
      return data;
    },
    onSuccess: (data) => {
      toast.success('Account created! Let\'s complete your organization profile.');
      navigate('/onboarding', { state: { orgName: data.orgName, website: data.website } });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Registration failed.');
    },
  });

  return (
    <FadeInUp delay={0.1} className="flex w-full flex-col gap-6">
      <div>
        <h2 className="text-foreground text-2xl font-bold tracking-tight">Create an account</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Choose your account type to get started.
        </p>
      </div>

      <Tabs defaultValue="player" className="w-full">
        <TabsList className="bg-secondary mb-6 grid w-full grid-cols-2 rounded-sm">
          <TabsTrigger
            value="player"
            className="data-[state=active]:bg-card data-[state=active]:text-primary rounded-sm font-semibold tracking-wide transition-all"
          >
            PLAYER
          </TabsTrigger>
          <TabsTrigger
            value="org"
            className="data-[state=active]:bg-card data-[state=active]:text-primary rounded-sm font-semibold tracking-wide transition-all"
          >
            ORGANIZATION
          </TabsTrigger>
        </TabsList>

        {/* --- Player Registration Tab --- */}
        <TabsContent
          value="player"
          className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
        >
          <form
            onSubmit={playerForm.handleSubmit((d) => playerMutation.mutate(d))}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormInput
                control={playerForm.control}
                name="username"
                label="IN-GAME NAME"
                placeholder="e.g. TenZ"
              />
              <FormInput control={playerForm.control} name="email" label="EMAIL" type="email" />
              <FormInput
                control={playerForm.control}
                name="password"
                label="PASSWORD"
                type="password"
              />

              <Controller
                control={playerForm.control}
                name="gameRoles"
                render={({ field, fieldState: { error } }) => (
                  <div className="space-y-2 pt-2">
                    <Label
                      className={`text-sm font-semibold tracking-wide ${error ? 'text-destructive' : 'text-foreground'}`}
                    >
                      PRIMARY ROLES
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {GAME_ROLES.map((role) => (
                        <label
                          key={role}
                          className="border-border hover:bg-secondary/50 flex cursor-pointer items-center space-x-2 rounded-sm border p-2.5 transition-colors"
                        >
                          <input
                            type="checkbox"
                            value={role}
                            checked={field.value?.includes(role)}
                            onChange={(e) => {
                              const current = field.value || [];
                              const updated = e.target.checked
                                ? [...current, role]
                                : current.filter((r) => r !== role);
                              field.onChange(updated);
                            }}
                            className="accent-primary h-4 w-4 cursor-pointer"
                          />
                          <span className="text-muted-foreground text-sm font-medium">{role}</span>
                        </label>
                      ))}
                    </div>
                    {error && (
                      <p className="text-destructive mt-1 text-xs font-medium">{error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={playerMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-sm font-semibold tracking-wide transition-colors"
            >
              {playerMutation.isPending ? 'REGISTERING...' : 'JOIN AS PLAYER'}
            </Button>
          </form>
        </TabsContent>

        {/* --- Organization Registration Tab --- */}
        <TabsContent value="org" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
          <form onSubmit={orgForm.handleSubmit((d) => orgMutation.mutate(d))} className="space-y-6">
            <div className="space-y-4">
              <FormInput
                control={orgForm.control}
                name="orgName"
                label="ORGANIZATION NAME"
                placeholder="e.g. Sentinels"
              />
              <FormInput
                control={orgForm.control}
                name="email"
                label="BUSINESS EMAIL"
                type="email"
              />
              <FormInput
                control={orgForm.control}
                name="password"
                label="PASSWORD"
                type="password"
              />
              <FormInput
                control={orgForm.control}
                name="website"
                label="WEBSITE (OPTIONAL)"
                placeholder="https://"
              />
            </div>
            <Button
              type="submit"
              disabled={orgMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-sm font-semibold tracking-wide transition-colors"
            >
              {orgMutation.isPending ? 'REGISTERING...' : 'CREATE ORGANIZATION'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <p className="text-muted-foreground mt-2 text-center text-sm font-medium">
        Already have an account?{' '}
        <Link to="/login" className="text-primary transition-colors hover:underline">
          Log in
        </Link>
        .
      </p>
    </FadeInUp>
  );
}
