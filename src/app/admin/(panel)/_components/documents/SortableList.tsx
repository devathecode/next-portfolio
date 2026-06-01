"use client";

import { useId, type ReactNode } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon } from "lucide-react";

export type HandleProps = DraggableAttributes & NonNullable<DraggableSyntheticListeners>;

/** Vertical drag-to-reorder list. Drag with the handle, or focus it and use Space + arrow keys. */
export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  children,
}: {
  items: T[];
  onReorder: (items: T[]) => void;
  children: (item: T, index: number, handle: HandleProps) => ReactNode;
}) {
  // A stable id keeps dnd-kit's aria-describedby identical on the server and client.
  const id = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return;
        const from = items.findIndex((i) => i.id === active.id);
        const to = items.findIndex((i) => i.id === over.id);
        onReorder(arrayMove(items, from, to));
      }}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        {items.map((item, i) => (
          <SortableItem key={item.id} id={item.id}>
            {(handle) => children(item, i, handle)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({ id, children }: { id: string; children: (handle: HandleProps) => ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={isDragging ? "relative z-10 opacity-90 shadow-lg shadow-black/10" : undefined}
    >
      {children({ ...attributes, ...(listeners ?? {}) } as HandleProps)}
    </div>
  );
}

export function DragHandle({ label, handle }: { label: string; handle: HandleProps }) {
  return (
    <button
      type="button"
      {...handle}
      aria-label={label}
      className="inline-flex h-8 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-adm-subtle transition hover:bg-adm-raised hover:text-adm-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adm-accent/60 active:cursor-grabbing"
    >
      <GripVerticalIcon size={14} />
    </button>
  );
}
