import { Menu, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link, useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'Players', href: '/players' },
  { label: 'Teams', href: '/teams' },
  { label: 'Tournaments', href: '/tournaments' },
];

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="border-border bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Slogan */}
        <div className="flex items-center gap-3">
          <Link to="/" className="group flex items-center gap-2">
            <div className="bg-primary flex items-center justify-center rounded-sm p-1.5">
              <Gamepad2 className="text-primary-foreground h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-foreground group-hover:text-primary text-xl font-bold tracking-tight transition-colors">
                ROSTERX
              </span>
              <span className="text-muted-foreground hidden text-[10px] font-medium tracking-widest uppercase sm:block">
                Discover talent. Build legends.
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons & Mobile Menu */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 md:flex">
            <Button
              onClick={() => navigate('/login')}
              variant="ghost"
              className="rounded-sm font-semibold tracking-wide"
            >
              Log in
            </Button>
            <Button
              onClick={() => navigate('/register')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm font-semibold tracking-wide"
            >
              Join Now
            </Button>
          </div>

          {/* Mobile Sheet Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="border-border rounded-sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-border bg-accent-foreground text-accent w-75 border-l px-4 sm:w-100"
            >
              <nav className="mt-8 flex flex-col gap-6">
                <div className="mb-4 flex flex-col gap-1">
                  <span className="text-2xl font-bold tracking-tight">ROSTERX</span>
                  <span className="text-primary text-xs font-medium tracking-widest uppercase">
                    Discover talent. Build legends.
                  </span>
                </div>
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-shadow-muted-foreground hover:text-primary text-lg font-semibold transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-border mt-4 flex flex-col gap-3 border-t pt-6">
                  <Button
                    variant="outline"
                    className="text-accent border-border w-full rounded-sm"
                    onClick={() => navigate('/login')}
                  >
                    Log in
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    className="bg-primary hover:bg-primary/90 w-full rounded-sm"
                  >
                    Join Now
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
