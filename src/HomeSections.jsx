import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ id, label }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-1 last:mb-0 cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs">
        <span>{label}</span>
        <span className="text-slate-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3 h-3"
          >
            <path d="M7 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM7 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-1.5 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM16 4.5A1.5 1.5 0 1 1 13 4.5 1.5 1.5 0 0 1 16 4.5ZM16 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-1.5 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
          </svg>
        </span>
      </div>
    </div>
  );
}

export function HomeSections({ sections }) {
  return (
    <div className="mt-1 space-y-0.5">
      {sections.map((s) => (
        <SortableItem key={s.id} id={s.id} label={s.label} />
      ))}
    </div>
  );
}
