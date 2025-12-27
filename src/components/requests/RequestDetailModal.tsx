import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { capitalizeFirst, formatDate, formatRelativeTime } from '@/utils/helpers';
import { MaintenanceRequest, mockActivityLog } from '@/utils/mockData';
import { 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Wrench, 
  Tag, 
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  UserCheck
} from 'lucide-react';

interface RequestDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: MaintenanceRequest | null;
  onStageChange?: (requestId: string, newStage: MaintenanceRequest['stage']) => void;
}

const stageConfig = {
  new: { label: 'New', color: 'bg-stage-new', next: 'in_progress' as const },
  in_progress: { label: 'In Progress', color: 'bg-stage-in-progress', next: 'repaired' as const },
  repaired: { label: 'Repaired', color: 'bg-stage-repaired', next: null },
  scrap: { label: 'Scrap', color: 'bg-stage-scrap', next: null },
};

const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  created: Plus,
  stage_changed: ArrowRight,
  assigned: UserCheck,
  completed: CheckCircle,
  updated: Clock,
  deleted: XCircle,
};

export function RequestDetailModal({ open, onOpenChange, request, onStageChange }: RequestDetailModalProps) {
  const [resolutionNotes, setResolutionNotes] = useState('');

  if (!request) return null;

  const currentStage = stageConfig[request.stage];
  const activities = mockActivityLog.filter(a => a.entity_id === request.id).slice(0, 5);

  const handleStageTransition = (newStage: MaintenanceRequest['stage']) => {
    onStageChange?.(request.id, newStage);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">{request.request_number}</span>
            {request.is_overdue && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Overdue
              </Badge>
            )}
          </div>
          <DialogTitle className="text-xl">{request.subject}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-5 gap-6 flex-1 overflow-hidden">
          {/* Left Side - Details (60%) */}
          <div className="col-span-3 space-y-6 overflow-y-auto pr-2">
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wrench className="h-4 w-4" />
                  Equipment
                </div>
                <p className="font-medium text-foreground">{request.equipment_name}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Location
                </div>
                <p className="font-medium text-foreground">Building A, Floor 1</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  Type
                </div>
                <Badge variant="outline" className="capitalize">
                  {request.request_type}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Priority
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    'border-0 capitalize',
                    request.priority === 'critical' && 'bg-priority-critical/10 text-priority-critical',
                    request.priority === 'high' && 'bg-priority-high/10 text-priority-high',
                    request.priority === 'medium' && 'bg-priority-medium/10 text-priority-medium',
                    request.priority === 'low' && 'bg-priority-low/10 text-priority-low'
                  )}
                >
                  {request.priority}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </div>
                <p className={cn(
                  'font-medium',
                  request.is_overdue ? 'text-destructive' : 'text-foreground'
                )}>
                  {formatDate(request.due_date)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Created
                </div>
                <p className="font-medium text-foreground">{formatDate(request.created_at)}</p>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-muted-foreground">Description</Label>
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
                {request.description || 'No description provided.'}
              </div>
            </div>

            {/* Resolution Notes */}
            {(request.stage === 'in_progress' || request.stage === 'repaired') && (
              <div className="space-y-2">
                <Label htmlFor="resolution">Resolution Notes</Label>
                <Textarea
                  id="resolution"
                  placeholder="Add notes about how the issue was resolved..."
                  className="min-h-[100px] resize-none"
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Right Side - Stage & Activity (40%) */}
          <div className="col-span-2 space-y-6 border-l border-border pl-6 overflow-y-auto">
            {/* Stage Indicator */}
            <div className="space-y-3">
              <Label className="text-muted-foreground">Stage</Label>
              <div className="flex items-center gap-2">
                <div className={cn('h-3 w-3 rounded-full', currentStage.color)} />
                <span className="font-medium text-foreground">{currentStage.label}</span>
              </div>

              {/* Stage Transition Buttons */}
              <div className="flex flex-wrap gap-2">
                {request.stage === 'new' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleStageTransition('in_progress')}
                    className="gap-1"
                  >
                    <ArrowRight className="h-3 w-3" />
                    Start Work
                  </Button>
                )}
                {request.stage === 'in_progress' && (
                  <>
                    <Button 
                      size="sm" 
                      onClick={() => handleStageTransition('repaired')}
                      className="gap-1 bg-success hover:bg-success/90"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Mark Repaired
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStageTransition('scrap')}
                      className="gap-1"
                    >
                      <XCircle className="h-3 w-3" />
                      Mark as Scrap
                    </Button>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* Assigned Technician */}
            <div className="space-y-3">
              <Label className="text-muted-foreground">Assigned Technician</Label>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  {request.assigned_technician_name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="font-medium text-foreground">{request.assigned_technician_name}</span>
              </div>
            </div>

            <Separator />

            {/* Activity Timeline */}
            <div className="space-y-3">
              <Label className="text-muted-foreground">Activity Timeline</Label>
              <div className="space-y-4">
                {activities.length > 0 ? activities.map((activity) => {
                  const Icon = actionIcons[activity.action] || Clock;
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{activity.performed_by_name}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(activity.performed_at)}
                        </p>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
