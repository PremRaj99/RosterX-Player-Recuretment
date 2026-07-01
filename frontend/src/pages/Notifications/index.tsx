import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Clock, Eye } from 'lucide-react';
import { notificationApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationApi.list,
  });

  const readMutation = useMutation({
    mutationFn: async (id: string) => {
      return notificationApi.markAsRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update notification');
    },
  });

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex justify-center py-20 text-sm font-bold tracking-widest uppercase animate-pulse">
        LOADING NOTIFICATIONS...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">System Alerts</h1>
          <p className="text-muted-foreground text-sm font-medium">
            Stay updated with recruitment reviews, message updates, and team changes.
          </p>
        </div>
      </div>

      <main className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-card border border-border flex flex-col items-center justify-center rounded-sm py-16 text-center">
            <Bell className="text-muted-foreground h-10 w-10 opacity-50 mb-3" />
            <p className="text-foreground text-lg font-bold">No notifications yet.</p>
            <p className="text-muted-foreground mt-1 text-sm">
              We'll alert you here when changes occur on your profile.
            </p>
          </div>
        ) : (
          <FadeInUp className="space-y-3">
            {notifications.map((notif: any) => (
              <div
                key={notif.id}
                className={`bg-card border rounded-sm p-4 flex gap-4 items-start transition-all ${
                  notif.read ? 'border-border opacity-70' : 'border-primary/50 shadow-md'
                }`}
              >
                <div className="bg-primary/10 border border-primary/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm mt-0.5">
                  <Bell className="text-primary h-4.5 w-4.5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="text-foreground font-bold tracking-tight text-sm">
                      {notif.title}
                    </h4>
                    <span className="text-muted-foreground text-[10px] font-semibold flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3" /> {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs font-semibold leading-relaxed">
                    {notif.body}
                  </p>
                  <div className="flex items-center gap-2 pt-1.5">
                    <span className="bg-secondary text-foreground rounded-sm px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase">
                      {notif.category}
                    </span>
                    {!notif.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => readMutation.mutate(notif.id)}
                        disabled={readMutation.isPending}
                        className="h-6 text-[10px] font-bold px-2 rounded-sm gap-1 hover:text-primary"
                      >
                        <Eye className="h-3 w-3" /> Mark Read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </FadeInUp>
        )}
      </main>
    </div>
  );
}
