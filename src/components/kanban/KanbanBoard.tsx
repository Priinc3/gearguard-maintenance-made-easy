import { useState } from 'react';
import { MaintenanceRequest, mockRequests } from '@/utils/mockData';
import { KanbanColumn } from './KanbanColumn';
import { RequestFormModal } from '@/components/requests/RequestFormModal';
import { RequestDetailModal } from '@/components/requests/RequestDetailModal';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { RequestCard } from './RequestCard';
import { toast } from 'sonner';

const stages = [
  { id: 'new', title: 'New', color: 'bg-stage-new' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-stage-in-progress' },
  { id: 'repaired', title: 'Repaired', color: 'bg-stage-repaired' },
  { id: 'scrap', title: 'Scrap', color: 'bg-stage-scrap' },
];

export function KanbanBoard() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockRequests);
  const [activeRequest, setActiveRequest] = useState<MaintenanceRequest | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getRequestsByStage = (stage: string) => {
    return requests.filter((r) => r.stage === stage);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const request = requests.find((r) => r.id === event.active.id);
    if (request) {
      setActiveRequest(request);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveRequest(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
    const targetStage = stages.find((s) => s.id === overId);
    if (targetStage) {
      const request = requests.find(r => r.id === activeId);
      if (request && request.stage !== targetStage.id) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === activeId ? { ...r, stage: targetStage.id as MaintenanceRequest['stage'] } : r
          )
        );
        toast.success(`Request moved to ${targetStage.title}`);
      }
    }
  };

  const handleCardClick = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  const handleStageChange = (requestId: string, newStage: MaintenanceRequest['stage']) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, stage: newStage } : r
      )
    );
    setSelectedRequest(prev => prev ? { ...prev, stage: newStage } : null);
    const stageLabel = stages.find(s => s.id === newStage)?.title || newStage;
    toast.success(`Request moved to ${stageLabel}`);
  };

  const handleAddRequest = () => {
    setIsFormOpen(true);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage.id}
              id={stage.id}
              title={stage.title}
              color={stage.color}
              requests={getRequestsByStage(stage.id)}
              onCardClick={handleCardClick}
              onAddRequest={stage.id === 'new' ? handleAddRequest : undefined}
            />
          ))}
        </div>

        <DragOverlay>
          {activeRequest && (
            <div className="rotate-3">
              <RequestCard request={activeRequest} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <RequestFormModal 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
        onSubmit={(data) => {
          console.log('New request:', data);
          toast.success('Request created successfully');
        }}
      />

      <RequestDetailModal
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        request={selectedRequest}
        onStageChange={handleStageChange}
      />
    </>
  );
}
