import { CheckCircle, ShieldCheck } from 'lucide-react';
import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';
import { CheckoutButton } from './CheckoutButton';

export function SubscriptionPage() {
  const features = [
    'Stand out to top organizations',
    'Priority application placement',
    'Exclusive verified badge on profile',
    'Direct messaging with team recruiters',
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Header Section */}
      <FadeInUp className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
        <h1 className="text-foreground mb-4 text-3xl font-bold tracking-tight md:text-5xl">
          Elevate Your Career.
        </h1>
        <p className="text-muted-foreground text-base font-medium tracking-wide md:text-lg">
          Stop blending in. Get the Verified Badge to signal your professional commitment and ensure
          your applications are seen first.
        </p>
      </FadeInUp>

      {/* Pricing Card Section */}
      <FadeInUp delay={0.1} className="mx-auto w-full max-w-sm">
        {/* 
          The card uses a sharp 2px primary border.
          The shadow creates a subtle, premium ambient glow matching the primary color.
        */}
        <div className="bg-card border-primary relative flex flex-col rounded-sm border-2 p-8 shadow-[0_0_40px_-10px_rgba(245,65,10,0.25)]">
          {/* Highlight Badge */}
          <div className="bg-primary text-primary-foreground absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-sm px-4 py-1 text-xs font-bold tracking-widest uppercase shadow-md">
            <ShieldCheck className="h-4 w-4" /> RECOMMENDED
          </div>

          <div className="mt-2 mb-8 text-center">
            <h2 className="text-foreground text-2xl font-bold tracking-tight">Verified Player</h2>
            <div className="mt-4 flex items-center justify-center gap-1">
              <span className="text-foreground text-4xl font-extrabold tracking-tighter">
                $9.99
              </span>
              <span className="text-muted-foreground mt-2 text-sm font-bold tracking-widest uppercase">
                / month
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <span className="text-muted-foreground text-sm leading-relaxed font-semibold">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <CheckoutButton />
        </div>
      </FadeInUp>
    </div>
  );
}
