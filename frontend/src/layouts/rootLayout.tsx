import { Outlet } from 'react-router-dom';
import Header from '@/components/custom/Header/Header';
import { Providers } from '@/provider';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/custom/scroll-to-top/scroll-to-top';
// import FloatingMenu from "@/components/Footer/FloatingMenu";
// import FloatingWhatsapp from "@/components/Footer/FloatingWhatsapp";

export default function RootLayout() {
  return (
    <div className="bg-background dark text-foreground relative h-screen min-h-screen w-full overflow-hidden pb-20 md:pb-0">
      <Providers>
        <ScrollToTop />
        <div id="main-scroll-container" className="relative z-10 h-screen overflow-y-auto">
          <Header />
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
            <Outlet />
          </div>
        </div>
        <Toaster />
      </Providers>
    </div>
  );
}
