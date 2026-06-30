import { FadeInUp } from '@/components/custom/FadeInUp/FadeInUp';
import { LayoutDashboard, Megaphone, Users } from 'lucide-react';
import { useState } from 'react';

// In a real app, you would use <Outlet /> to render child routes.
// We'll mock the view switching here for demonstration.
import { ApplicantsDataTable } from './ApplicantsDataTable';
import { CreatePostForm } from './CreatePostForm';

export function OrgDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'postings', label: 'My Postings', icon: Megaphone },
    { id: 'applicants', label: 'Applicants', icon: Users },
  ];

  return (
    <div className="flex w-full flex-col gap-8 md:flex-row">
      {/* Mobile Sub-Nav (Horizontal Scroll) */}
      <div className="border-border no-scrollbar flex gap-4 overflow-x-auto border-b pb-2 md:hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-bold tracking-wide whitespace-nowrap transition-colors ${
              activeTab === item.id
                ? 'border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground border-transparent'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Desktop Side Nav */}
      <aside className="border-border hidden min-h-125 w-64 shrink-0 flex-col space-y-2 border-r pr-6 md:flex">
        <h2 className="text-muted-foreground mb-4 px-3 text-xs font-bold tracking-widest uppercase">
          Org Management
        </h2>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-bold tracking-wide transition-all ${
              activeTab === item.id
                ? 'bg-secondary text-primary border-border border'
                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-transparent'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </aside>

      {/* Main Dashboard Content Area */}
      <main className="min-w-0 flex-1">
        <FadeInUp key={activeTab}>
          {activeTab === 'overview' && (
            <div className="text-muted-foreground font-medium">Dashboard Overview Stats...</div>
          )}
          {activeTab === 'postings' && <CreatePostForm />}
          {activeTab === 'applicants' && <ApplicantsDataTable />}
        </FadeInUp>
      </main>
    </div>
  );
}
