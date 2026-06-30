import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CheckoutButton() {
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      // Simulate network request to create a Stripe checkout session
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Redirecting to Stripe checkout session...');
      return { success: true, url: 'https://checkout.stripe.com/...' };
    },
    onSuccess: (_data) => {
      // In a real app: window.location.href = data.url;
    },
  });

  return (
    <Button
      onClick={() => checkoutMutation.mutate()}
      disabled={checkoutMutation.isPending}
      className="bg-primary hover:bg-primary/90 text-primary-foreground mt-8 w-full rounded-sm py-6 text-sm font-bold tracking-widest uppercase transition-all"
    >
      {checkoutMutation.isPending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          INITIATING SECURE CHECKOUT...
        </span>
      ) : (
        'GET VERIFIED NOW'
      )}
    </Button>
  );
}
