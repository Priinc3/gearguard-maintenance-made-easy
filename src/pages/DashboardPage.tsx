import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentRequests } from '@/components/dashboard/RecentRequests';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { mockDashboardStats, mockCalendarEvents } from '@/utils/mockData';
import { Box, ClipboardList, AlertTriangle, Clock, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';

function UpcomingEvents() {
  const navigate = useNavigate();
  const today = new Date();
  const nextWeek = addDays(today, 7);
  
  const upcomingEvents = mockCalendarEvents
    .filter(event => {
      const eventDate = parseISO(event.date);
      return isAfter(eventDate, today) && isBefore(eventDate, nextWeek);
    })
    .slice(0, 4);

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h3 className="font-semibold text-foreground">Upcoming This Week</h3>
        <Button variant="ghost" size="sm" onClick={() => navigate('/calendar')}>
          View Calendar
        </Button>
      </div>
      <div className="divide-y divide-border">
        {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
          <div key={event.id} className="flex items-center gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium text-foreground">{event.title}</p>
              <p className="text-sm text-muted-foreground">{event.equipment_name}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              {format(parseISO(event.date), 'MMM d')}
            </div>
          </div>
        )) : (
          <div className="px-6 py-8 text-center text-muted-foreground">
            No upcoming events this week
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Welcome back! Here's your maintenance overview.
            </p>
          </div>
          <Button onClick={() => navigate('/requests')} className="gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>

        {/* Stats Grid - Top Row */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Equipment"
            value={mockDashboardStats.total_equipment}
            icon={Box}
            variant="primary"
          />
          <StatCard
            title="Open Requests"
            value={mockDashboardStats.open_requests}
            icon={ClipboardList}
            variant="default"
          />
          <StatCard
            title="Overdue"
            value={mockDashboardStats.overdue_requests}
            icon={AlertTriangle}
            variant={mockDashboardStats.overdue_requests > 0 ? 'danger' : 'default'}
          />
          <StatCard
            title="Avg. Repair Time"
            value={`${mockDashboardStats.avg_repair_time_hours}h`}
            icon={Clock}
            variant="success"
          />
        </div>

        {/* Content Grid - Middle Section */}
        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          <RecentRequests />
          <RecentActivity />
        </div>

        {/* Bottom Section - Upcoming Events */}
        <UpcomingEvents />
      </div>
    </Layout>
  );
}
