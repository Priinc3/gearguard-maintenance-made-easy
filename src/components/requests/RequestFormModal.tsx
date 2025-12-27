import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { mockEquipment } from '@/utils/mockData';

interface RequestFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: RequestFormData) => void;
}

export interface RequestFormData {
  subject: string;
  description: string;
  equipment_id: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  request_type: 'corrective' | 'preventive';
  due_date: Date | undefined;
}

export function RequestFormModal({ open, onOpenChange, onSubmit }: RequestFormModalProps) {
  const [formData, setFormData] = useState<RequestFormData>({
    subject: '',
    description: '',
    equipment_id: '',
    priority: 'medium',
    request_type: 'corrective',
    due_date: undefined,
  });

  // Auto-fill fields based on selected equipment
  const selectedEquipment = mockEquipment.find(e => e.id === formData.equipment_id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    onOpenChange(false);
    // Reset form
    setFormData({
      subject: '',
      description: '',
      equipment_id: '',
      priority: 'medium',
      request_type: 'corrective',
      due_date: undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">New Maintenance Request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 2-Column Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - Editable Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of the issue"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the maintenance request..."
                  className="min-h-[100px] resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment">Equipment</Label>
                <Select 
                  value={formData.equipment_id} 
                  onValueChange={(value) => setFormData({ ...formData, equipment_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEquipment.map((eq) => (
                      <SelectItem key={eq.id} value={eq.id}>
                        <span className="flex items-center gap-2">
                          <span>{eq.category_icon}</span>
                          <span>{eq.name}</span>
                          <span className="text-muted-foreground">({eq.serial_number})</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column - Auto-filled Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Category</Label>
                <div className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm">
                  {selectedEquipment?.category_name || '—'}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Maintenance Team</Label>
                <div className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm">
                  {selectedEquipment?.maintenance_team_name || '—'}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Location</Label>
                <div className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm">
                  {selectedEquipment?.location || '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Priority, Due Date, Type */}
          <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => 
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-priority-low" />
                      Low
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-priority-medium" />
                      Medium
                    </span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-priority-high" />
                      High
                    </span>
                  </SelectItem>
                  <SelectItem value="critical">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-priority-critical" />
                      Critical
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.due_date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.due_date ? format(formData.due_date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.due_date}
                    onSelect={(date) => setFormData({ ...formData, due_date: date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select 
                value={formData.request_type} 
                onValueChange={(value: 'corrective' | 'preventive') => 
                  setFormData({ ...formData, request_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corrective">Corrective</SelectItem>
                  <SelectItem value="preventive">Preventive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
