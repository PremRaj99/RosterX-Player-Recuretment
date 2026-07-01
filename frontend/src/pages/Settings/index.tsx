import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FormInput } from '@/components/custom/FormInput/FormInput';
import { Button } from '@/components/ui/button';
import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';
import { userApi } from '@/services/api';
import { useCurrUser } from '@/store/userStore';
import { toast } from 'sonner';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const setUser = useCurrUser((state) => state.setUser);

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: userApi.getMe,
  });

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      displayName: '',
      bio: '',
      phone: '',
      country: '',
      settings: {
        showOnlineStatus: true,
        allowDirectMessages: true,
        showInSearch: true,
        notificationPrefs: {
          applications: true,
          messages: true,
          teams: true,
          organizations: true,
          tournaments: true,
          platform: true,
          security: true,
          verification: true,
        },
      },
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        displayName: user.displayName || '',
        bio: user.bio || '',
        phone: user.phone || '',
        country: user.country || '',
        settings: {
          showOnlineStatus: user.settings?.showOnlineStatus ?? true,
          allowDirectMessages: user.settings?.allowDirectMessages ?? true,
          showInSearch: user.settings?.showInSearch ?? true,
          notificationPrefs: {
            applications: user.settings?.notificationPrefs?.applications ?? true,
            messages: user.settings?.notificationPrefs?.messages ?? true,
            teams: user.settings?.notificationPrefs?.teams ?? true,
            organizations: user.settings?.notificationPrefs?.organizations ?? true,
            tournaments: user.settings?.notificationPrefs?.tournaments ?? true,
            platform: user.settings?.notificationPrefs?.platform ?? true,
            security: user.settings?.notificationPrefs?.security ?? true,
            verification: user.settings?.notificationPrefs?.verification ?? true,
          },
        },
      });
    }
  }, [user, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return userApi.updateMe(data);
    },
    onSuccess: (updatedUser) => {
      toast.success('Settings saved successfully!');
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to save settings');
    },
  });

  const onSubmit = (data: any) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex justify-center py-20 text-sm font-bold tracking-widest uppercase animate-pulse">
        LOADING CONFIGURATION...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-6">
      <div>
        <h1 className="text-foreground text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground text-sm font-medium">
          Manage your account preferences, profile visibility, and system notifications.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* User Info */}
        <FadeInUp className="bg-card border border-border p-6 rounded-sm space-y-4">
          <h3 className="text-foreground font-bold text-lg border-b border-border/50 pb-2">Profile Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput control={control} name="displayName" label="DISPLAY NAME" />
            <FormInput control={control} name="phone" label="PHONE NUMBER" />
            <FormInput control={control} name="country" label="COUNTRY" />
            <FormInput control={control} name="bio" label="BIO / DESCRIPTION" />
          </div>
        </FadeInUp>

        {/* Privacy preferences */}
        <FadeInUp delay={0.05} className="bg-card border border-border p-6 rounded-sm space-y-4">
          <h3 className="text-foreground font-bold text-lg border-b border-border/50 pb-2">Privacy Settings</h3>
          <div className="space-y-3">
            <Controller
              control={control}
              name="settings.showOnlineStatus"
              render={({ field }) => (
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="accent-primary h-4 w-4 cursor-pointer"
                  />
                  <span className="text-muted-foreground text-sm font-semibold">Show Online Status</span>
                </label>
              )}
            />
            <Controller
              control={control}
              name="settings.allowDirectMessages"
              render={({ field }) => (
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="accent-primary h-4 w-4 cursor-pointer"
                  />
                  <span className="text-muted-foreground text-sm font-semibold">Allow Direct Messages</span>
                </label>
              )}
            />
            <Controller
              control={control}
              name="settings.showInSearch"
              render={({ field }) => (
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="accent-primary h-4 w-4 cursor-pointer"
                  />
                  <span className="text-muted-foreground text-sm font-semibold">Show Profile in Search Results</span>
                </label>
              )}
            />
          </div>
        </FadeInUp>

        {/* Notifications Preference */}
        <FadeInUp delay={0.1} className="bg-card border border-border p-6 rounded-sm space-y-4">
          <h3 className="text-foreground font-bold text-lg border-b border-border/50 pb-2">Notification Preferences</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(control._defaultValues.settings?.notificationPrefs || {}).map((prefKey) => (
              <Controller
                key={prefKey}
                control={control}
                name={`settings.notificationPrefs.${prefKey}` as any}
                render={({ field }) => (
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="accent-primary h-4 w-4 cursor-pointer"
                    />
                    <span className="text-muted-foreground text-sm font-semibold capitalize">{prefKey}</span>
                  </label>
                )}
              />
            ))}
          </div>
        </FadeInUp>

        <Button
          type="submit"
          disabled={updateMutation.isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-sm font-bold tracking-widest uppercase py-6 text-sm transition-colors"
        >
          {updateMutation.isPending ? 'SAVING CHANGES...' : 'SAVE SETTINGS PREFERENCES'}
        </Button>
      </form>
    </div>
  );
}
