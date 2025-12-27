import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { mockCalendarEvents, CalendarEvent } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { RequestFormModal } from '@/components/requests/RequestFormModal';
import { toast } from 'sonner';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isToday,
} from 'date-fns';

function EventBar({ event }: { event: CalendarEvent }) {
  const colorClasses = {
    preventive: 'bg-success text-success-foreground',
    corrective: {
      critical: 'bg-priority-critical text-white',
      high: 'bg-priority-high text-white',
      medium: 'bg-priority-medium text-white',
      low: 'bg-priority-low text-white',
    },
  };

  const colorClass = event.type === 'preventive' 
    ? colorClasses.preventive 
    : colorClasses.corrective[event.priority];

  return (
    <div
      className={cn(
        'mb-1 truncate rounded px-1.5 py-0.5 text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity',
        colorClass
      )}
      title={event.title}
    >
      {event.title}
    </div>
  );
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  const getEventsForDay = (date: Date) => {
    return mockCalendarEvents.filter((event) =>
      isSameDay(parseISO(event.date), date)
    );
  };

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const handleDayClick = (date: Date, events: CalendarEvent[]) => {
    if (events.length === 0) {
      setSelectedDate(date);
      setIsFormOpen(true);
    }
  };

  return (
    <Layout>
      <div className="flex h-full flex-col p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Calendar</h1>
            <p className="mt-1 text-muted-foreground">
              Schedule and track maintenance activities
            </p>
          </div>
          <Button className="gap-2" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Schedule Maintenance
          </Button>
        </div>

        {/* Calendar Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 rounded-lg border border-border bg-card overflow-hidden">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-border bg-muted/30">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="px-4 py-3 text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 flex-1">
            {days.map((day, idx) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isTodayDate = isToday(day);

              return (
                <div
                  key={idx}
                  onClick={() => handleDayClick(day, dayEvents)}
                  className={cn(
                    'min-h-[120px] border-b border-r border-border p-2 transition-colors cursor-pointer hover:bg-secondary/30',
                    !isCurrentMonth && 'bg-muted/30'
                  )}
                >
                  <div className="mb-2 flex items-center justify-center">
                    <span
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full text-sm',
                        isTodayDate && 'bg-primary text-primary-foreground font-medium',
                        !isCurrentMonth && 'text-muted-foreground'
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <EventBar key={event.id} event={event} />
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center font-medium">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-success" />
            <span className="text-sm text-muted-foreground">Preventive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-priority-critical" />
            <span className="text-sm text-muted-foreground">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-priority-high" />
            <span className="text-sm text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-priority-medium" />
            <span className="text-sm text-muted-foreground">Medium</span>
          </div>
        </div>
      </div>

      <RequestFormModal 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
        onSubmit={(data) => {
          console.log('New request:', data);
          toast.success('Maintenance scheduled successfully');
        }}
      />
    </Layout>
  );
}
