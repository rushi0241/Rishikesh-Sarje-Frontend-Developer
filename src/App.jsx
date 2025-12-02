import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { HomeSections } from "./HomeSections.jsx";

const BASE_STRUCTURE = {
  pages: [
    { id: "home", label: "Home", level: 1, parentId: null },
    { id: "about", label: "About", level: 2, parentId: "home" },
    { id: "services", label: "Services", level: 2, parentId: "home" },
    { id: "blog", label: "Blog", level: 2, parentId: "home" },
    { id: "contact", label: "Contact", level: 2, parentId: "home" },
    { id: "svc-1", label: "Service Detail 1", level: 3, parentId: "services" },
    { id: "svc-2", label: "Service Detail 2", level: 3, parentId: "services" },
    { id: "blog-1", label: "Blog Post 1", level: 3, parentId: "blog" },
    { id: "blog-2", label: "Blog Post 2", level: 3, parentId: "blog" },
    { id: "blog-author", label: "Author Page", level: 3, parentId: "blog" },
    {
      id: "contact-loc",
      label: "Location Info",
      level: 3,
      parentId: "contact",
    },
    {
      id: "contact-support",
      label: "Support Page",
      level: 3,
      parentId: "contact",
    },
  ],
  homeSections: ["hero", "features", "testimonials", "cta", "footer"],
};

const SECTION_LABELS = {
  hero: "Hero",
  features: "Features",
  testimonials: "Testimonials",
  cta: "CTA",
  footer: "Footer",
};

const STORAGE_KEY = "page-hierarchy-structure";

function getLayoutedElements(pages) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 50, ranksep: 90 });

  const nodes = [];
  const edges = [];

  pages.forEach((p) => {
    const width = 220;
    const height = p.id === "home" ? 190 : 70;

    g.setNode(p.id, { width, height });

    nodes.push({
      id: p.id,
      data: { label: p.label, level: p.level },
      position: { x: 0, y: 0 },
      style: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 8,
        background: "#020617",
        borderColor:
          p.level === 1 ? "#4f46e5" : p.level === 2 ? "#22c55e" : "#eab308",
        color: "#e5e7eb",
      },
      className: `shadow-md ${p.id === "home" ? "home-node" : ""}`,
    });
  });

  pages.forEach((p) => {
    if (!p.parentId) return;

    edges.push({
      id: `${p.parentId}-${p.id}`,
      source: p.parentId,
      target: p.id,
      type: "smoothstep",
      animated: false,
      style: { stroke: "#64748b" },
    });

    g.setEdge(p.parentId, p.id);
  });

  dagre.layout(g);

  const layoutedNodes = nodes.map((n) => {
    const pos = g.node(n.id);
    return {
      ...n,
      position: { x: pos.x - pos.width / 2, y: pos.y - pos.height / 2 },
    };
  });

  return { nodes: layoutedNodes, edges };
}

function AppInner() {
  const [structure, setStructure] = useState(BASE_STRUCTURE);
  const [exportJson, setExportJson] = useState("");

  const homeSections = structure.homeSections;

  const onDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = homeSections.indexOf(active.id);
      const newIndex = homeSections.indexOf(over.id);
      setStructure((prev) => ({
        ...prev,
        homeSections: arrayMove(prev.homeSections, oldIndex, newIndex),
      }));
    },
    [homeSections]
  );

  const { nodes, edges } = useMemo(() => {
    const layout = getLayoutedElements(structure.pages);
    const enhancedNodes = layout.nodes.map((node) =>
      node.id === "home"
        ? {
            ...node,
            data: {
              ...node.data,
              homeSections,
              onDragEnd,
            },
          }
        : node
    );

    return { nodes: enhancedNodes, edges: layout.edges };
  }, [structure.pages, homeSections, onDragEnd]);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(structure));
    console.log("Saving structure to localStorage", structure);
  };

  const handleLoad = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.pages && parsed.homeSections) {
        const baseById = Object.fromEntries(
          BASE_STRUCTURE.pages.map((p) => [p.id, p])
        );

        const mergedPages = parsed.pages.map((p) => ({
          ...baseById[p.id],
          ...p,
        }));

        setStructure({
          pages: mergedPages,
          homeSections:
            parsed.homeSections?.length > 0
              ? parsed.homeSections
              : BASE_STRUCTURE.homeSections,
        });
      }
    } catch {
      console.error("Error loading structure from localStorage");
    }
  };

  const handleExport = () => {
    setExportJson(JSON.stringify(structure, null, 2));
  };

  const nodeTypes = useMemo(
    () => ({
      default: (nodeProps) => {
        if (nodeProps.id !== "home") {
          return (
            <div className="relative px-3 py-2 rounded-lg border border-slate-700 bg-slate-900">
              <Handle
                type="target"
                position={Position.Top}
                style={{ background: "#4f46e5", width: 8, height: 8 }}
              />
              <Handle
                type="source"
                position={Position.Bottom}
                style={{ background: "#4f46e5", width: 8, height: 8 }}
              />
              <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                {nodeProps.data.level === 1
                  ? "Root"
                  : nodeProps.data.level === 2
                  ? "Main Page"
                  : "Subpage"}
              </div>
              <div className="font-medium">{nodeProps.data.label}</div>
            </div>
          );
        }
        return (
          <div className="relative px-4 py-3 rounded-xl border border-brand-500 bg-slate-900 w-[260px]">
            <Handle
              type="target"
              position={Position.Top}
              style={{ background: "#4f46e5", width: 8, height: 8 }}
            />
            <Handle
              type="source"
              position={Position.Bottom}
              style={{ background: "#4f46e5", width: 8, height: 8 }}
            />
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-xs uppercase tracking-wide text-brand-400">
                  Root
                </div>
                <div className="text-lg font-semibold">Home</div>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-brand-500/10 text-brand-300 border border-brand-500/40">
                Editable sections
              </span>
            </div>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={nodeProps.data.onDragEnd}
            >
              <SortableContext
                items={nodeProps.data.homeSections}
                strategy={verticalListSortingStrategy}
              >
                <HomeSections
                  sections={nodeProps.data.homeSections.map((id) => ({
                    id,
                    label: SECTION_LABELS[id],
                  }))}
                />
              </SortableContext>
            </DndContext>
          </div>
        );
      },
    }),
    []
  );

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b border-slate-800 px-6 py-3 flex items-center justify-between bg-slate-950/80 backdrop-blur">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">
            Visual Page Hierarchy Editor
          </h1>
          <p className="text-xs text-slate-400">
            React Flow + Dagre layout · DnD Home sections · localStorage
            persistence
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-600"
          >
            Save
          </button>
          <button
            onClick={handleLoad}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-600"
          >
            Load
          </button>
          <button
            onClick={handleExport}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-brand-600 hover:bg-brand-500 text-white"
          >
            Export JSON
          </button>
        </div>
      </header>
      <main className="flex-1 grid grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)] overflow-hidden">
        <section className="border-r border-slate-800">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            panOnScroll
            zoomOnScroll
            className="bg-slate-900"
          >
            <Background gap={16} color="#1e293b" />
            <MiniMap
              nodeStrokeColor="#4f46e5"
              nodeColor="#020617"
              maskColor="#020617ee"
            />
            <Controls />
          </ReactFlow>
        </section>
        <section className="p-4 flex flex-col bg-slate-950">
          <h2 className="text-sm font-semibold mb-2 text-slate-100">
            Exported Structure
          </h2>
          <p className="text-xs text-slate-500 mb-2">
            Click <span className="font-semibold">Export JSON</span> to view the
            current hierarchy and Home section order.
          </p>
          <textarea
            className="flex-1 w-full text-xs font-mono bg-slate-900 border border-slate-800 rounded-md p-2 text-slate-200 resize-none"
            readOnly
            value={exportJson}
            placeholder="JSON will appear here"
          />
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppInner />
    </ReactFlowProvider>
  );
}
