import React from "react";
import { Countdown } from "@/types/countdown";
import CountdownCard from "./CountdownCard";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragOverlay
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";

interface CountdownListProps {
  countdowns: Countdown[];
  onDelete: (id: string) => void;
  onEdit: (countdown: Countdown) => void;
  onReorder: (countdowns: Countdown[]) => void;
}

// Sortable wrapper for CountdownCard
const SortableCountdownCard = ({ countdown, onDelete, onEdit }: {
  countdown: Countdown;
  onDelete: (id: string) => void;
  onEdit: (countdown: Countdown) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: countdown.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
    opacity: isDragging ? 0.4 : 1, // Make original item semi-transparent while dragging
    zIndex: isDragging ? 0 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isDragging ? 0 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      layout
      transition={{ duration: 0.3 }}
    >
      <CountdownCard 
        key={countdown.id} 
        countdown={countdown} 
        onDelete={onDelete} 
        onEdit={onEdit} 
      />
    </motion.div>
  );
};

const CountdownList: React.FC<CountdownListProps> = ({ countdowns, onDelete, onEdit, onReorder }) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [items, setItems] = React.useState(countdowns);
  
  // Update items when countdowns prop changes
  React.useEffect(() => {
    setItems(countdowns);
  }, [countdowns]);
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onReorder(newItems);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
  };

  // Find the active countdown for the overlay
  const activeCountdown = items.find(countdown => countdown.id === activeId);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No countdowns yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SortableContext 
          items={items.map(c => c.id)} 
        >
          <AnimatePresence>
            {items.map((countdown) => (
              <SortableCountdownCard
                key={countdown.id} 
                countdown={countdown} 
                onDelete={onDelete} 
                onEdit={onEdit} 
              />
            ))}
          </AnimatePresence>
        </SortableContext>
      </div>
      
      {/* Drag Overlay - Shows a preview of the card being dragged */}
      <DragOverlay>
        {activeId && activeCountdown ? (
          <div className="shadow-lg scale-105">
            <CountdownCard 
              countdown={activeCountdown} 
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default CountdownList;
