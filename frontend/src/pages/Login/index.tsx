import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom'; // Assuming react-router
import { loginSchema, type LoginFormValues } from '@/validators/schemas';
import { FormInput } from '@/components/custom/FormInput/FormInput';
import { Button } from '@/components/ui/button';
import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';

export default function LoginPage() {
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      // Mock network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Login Payload:', data);
      return data;
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <FadeInUp delay={0.1} className="flex w-full flex-col gap-6">
      <div>
        <h2 className="text-foreground text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Enter your credentials to access your roster.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormInput
            control={control}
            name="email"
            label="EMAIL ADDRESS"
            type="email"
            placeholder="player@rosterx.gg"
          />
          <FormInput
            control={control}
            name="password"
            label="PASSWORD"
            type="password"
            placeholder="••••••••"
          />
        </div>

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-sm font-semibold tracking-wide transition-all"
        >
          {loginMutation.isPending ? 'AUTHENTICATING...' : 'LOG IN'}
        </Button>

        <p className="text-muted-foreground text-center text-sm font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary transition-colors hover:underline">
            Register here
          </Link>
          .
        </p>
      </form>
    </FadeInUp>
  );
}
