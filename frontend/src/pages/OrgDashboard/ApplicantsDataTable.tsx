import { BadgeCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

// Mock Data
const applicants = [
  {
    id: '1',
    name: 'TenZ',
    role: 'Entry Fragger',
    status: 'pending',
    verified: true,
    date: 'Oct 24',
  },
  { id: '2', name: 's1mple', role: 'AWPer', status: 'reviewed', verified: true, date: 'Oct 23' },
  {
    id: '3',
    name: 'UnknownRookie',
    role: 'Support',
    status: 'rejected',
    verified: false,
    date: 'Oct 22',
  },
  { id: '4', name: 'Boaster', role: 'IGL', status: 'pending', verified: true, date: 'Oct 20' },
];

export function ApplicantsDataTable() {
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-yellow-500 uppercase">
            <Clock className="h-3.5 w-3.5" /> Pending
          </span>
        );
      case 'reviewed':
        return (
          <span className="text-primary flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase">
            <CheckCircle className="h-3.5 w-3.5" /> Under Review
          </span>
        );
      case 'rejected':
        return (
          <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase">
            <XCircle className="h-3.5 w-3.5" /> Rejected
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="bg-card border-border overflow-hidden rounded-sm border">
      <div className="border-border flex items-center justify-between border-b p-6">
        <h2 className="text-xl font-bold tracking-tight">Recent Applicants</h2>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-foreground w-62.5 font-bold">PLAYER</TableHead>
              <TableHead className="text-foreground font-bold">ROLE APPLIED</TableHead>
              <TableHead className="text-foreground font-bold">STATUS</TableHead>
              <TableHead className="text-foreground text-right font-bold">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.map((app) => (
              <TableRow
                key={app.id}
                className="border-border hover:bg-secondary/30 transition-colors"
              >
                <TableCell className="flex items-center gap-2 py-4 font-medium">
                  <span className="text-foreground font-semibold">{app.name}</span>
                  {app.verified && <BadgeCheck className="text-primary h-4 w-4" />}
                </TableCell>
                <TableCell className="text-muted-foreground">{app.role}</TableCell>
                <TableCell>{getStatusDisplay(app.status)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border rounded-sm text-xs font-bold tracking-wide"
                  >
                    VIEW PROFILE
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
