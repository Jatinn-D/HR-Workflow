import { create } from 'zustand';
import type { Connection, Edge, EdgeChange, NodeChange } from '@xyflow/react';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { AppNode } from '../types/workflow';

export interface SavedWorkflow {
  id: string;
  name: string;
  nodes: AppNode[];
  edges: Edge[];
  updatedAt: string;
}

export interface StoreHistory {
  nodes: AppNode[];
  edges: Edge[];
}

export interface WorkspaceTab {
  id: string;
  name: string;
  nodes: AppNode[];
  edges: Edge[];
  past: StoreHistory[];
  future: StoreHistory[];
  focusedNodeId: string | null;
  isDirty: boolean;
}

export interface WorkflowState {
  // App navigation UI
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSandboxOpen: boolean;
  toggleSandbox: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  savedWorkflows: SavedWorkflow[];
  deleteSavedWorkflow: (id: string) => void;

  // Multiple Tabs (V4 Engine)
  workspaceTabs: WorkspaceTab[];
  activeWorkspaceId: string;
  createTab: (nodes?: AppNode[], edges?: Edge[], name?: string) => string;
  closeTab: (id: string) => boolean;
  switchTab: (id: string) => void;
  renameTab: (id: string, name: string) => void;

  // Active Tab Scoped Operations
  onNodesChange: (changes: NodeChange<AppNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
  deleteSelectedNodes: () => void;
  importGraph: (nodes: AppNode[], edges: Edge[]) => void;
  setFocusedNodeId: (id: string | null) => void;
  saveCurrentWorkflow: (name?: string) => void;
  loadSavedWorkflow: (id: string) => void;
}

const loadSavedData = (): SavedWorkflow[] => {
  try {
    const data = localStorage.getItem('hr_saved_workflows');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const loadWorkspaceTabs = (): { tabs: WorkspaceTab[], activeId: string } => {
  try {
    const data = localStorage.getItem('hr_autosave_tabs');
    if (data) return JSON.parse(data);
  } catch {}
  
  const defaultTabId = `tab_${Date.now()}`;
  return {
    tabs: [{
      id: defaultTabId,
      name: 'Untitled Workflow',
      nodes: [], edges: [], past: [], future: [],
      focusedNodeId: null, isDirty: false
    }],
    activeId: defaultTabId
  };
};

const MAX_HISTORY = 50;

export const useWorkflowStore = create<WorkflowState>((set, get) => {
  
  // Localized Tab Helper
  const updateActiveTab = (updater: (tab: WorkspaceTab) => Partial<WorkspaceTab>) => {
    set(state => {
      const newTabs = state.workspaceTabs.map(tab => {
        if (tab.id === state.activeWorkspaceId) {
          return { ...tab, ...updater(tab) };
        }
        return tab;
      });
      return { workspaceTabs: newTabs };
    });
  };

  const saveHistory = (tab: WorkspaceTab) => {
    const newPast = [...tab.past, { nodes: tab.nodes, edges: tab.edges }];
    if (newPast.length > MAX_HISTORY) newPast.shift();
    return newPast;
  };

  const initialTabs = loadWorkspaceTabs();

  return {
    workspaceTabs: initialTabs.tabs,
    activeWorkspaceId: initialTabs.activeId,
    activeTab: 'workflows',
    setActiveTab: (tab: string) => set({ activeTab: tab }),
    isSandboxOpen: false,
    toggleSandbox: () => set(state => ({ isSandboxOpen: !state.isSandboxOpen })),
    isSidebarOpen: true,
    toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
    savedWorkflows: loadSavedData(),

    createTab: (nodes = [], edges = [], name = 'Untitled Workflow') => {
      const id = `tab_${Date.now()}`;
      set(state => ({
        workspaceTabs: [...state.workspaceTabs, {
          id, name, nodes, edges, past: [], future: [], focusedNodeId: null, isDirty: false
        }],
        activeWorkspaceId: id,
        activeTab: 'workflows'
      }));
      return id;
    },

    closeTab: (id: string) => {
      const { workspaceTabs, activeWorkspaceId } = get();
      const tabToClose = workspaceTabs.find(t => t.id === id);
      if (!tabToClose) return false;
      
      if (tabToClose.isDirty && tabToClose.nodes.length > 0) {
         if (!window.confirm(`"${tabToClose.name}" has unsaved changes. Are you sure you want to close it?`)) {
            return false;
         }
      }

      const newTabs = workspaceTabs.filter(t => t.id !== id);
      if (newTabs.length === 0) {
         const newId = `tab_${Date.now()}`;
         set({
            workspaceTabs: [{ id: newId, name: 'Untitled Workflow', nodes: [], edges: [], past: [], future: [], focusedNodeId: null, isDirty: false }],
            activeWorkspaceId: newId
         });
         return true;
      }

      if (id === activeWorkspaceId) {
         const closedIndex = workspaceTabs.findIndex(t => t.id === id);
         const nextTab = newTabs[Math.max(0, closedIndex - 1)];
         set({ workspaceTabs: newTabs, activeWorkspaceId: nextTab.id });
      } else {
         set({ workspaceTabs: newTabs });
      }
      return true;
    },

    switchTab: (id: string) => set({ activeWorkspaceId: id }),

    renameTab: (id: string, name: string) => set(state => ({
      workspaceTabs: state.workspaceTabs.map(t => t.id === id ? { ...t, name } : t)
    })),

    saveCurrentWorkflow: (customName?: string) => {
       const state = get();
       const activeTab = state.workspaceTabs.find(t => t.id === state.activeWorkspaceId);
       if (!activeTab) return;
       
       const nameToSave = customName || activeTab.name || "Untitled Workflow";
       
       const newWorkflow: SavedWorkflow = {
         id: `wf_${Date.now()}`,
         name: nameToSave,
         nodes: activeTab.nodes,
         edges: activeTab.edges,
         updatedAt: new Date().toISOString()
       };
       
       const updated = [newWorkflow, ...state.savedWorkflows];
       localStorage.setItem('hr_saved_workflows', JSON.stringify(updated));
       set({ savedWorkflows: updated });
       
       state.renameTab(activeTab.id, nameToSave);
       updateActiveTab(() => ({ isDirty: false }));
    },

    deleteSavedWorkflow: (id: string) => {
      const { savedWorkflows } = get();
      const updated = savedWorkflows.filter(w => w.id !== id);
      localStorage.setItem('hr_saved_workflows', JSON.stringify(updated));
      set({ savedWorkflows: updated });
    },

    loadSavedWorkflow: (id: string) => {
      const wf = get().savedWorkflows.find(w => w.id === id);
      if (wf) {
        const tabId = get().createTab(wf.nodes, wf.edges, wf.name);
        set({ activeWorkspaceId: tabId, activeTab: 'workflows' });
      }
    },

    onNodesChange: (changes: NodeChange<AppNode>[]) => updateActiveTab(tab => {
      const isSignificant = changes.some(c => c.type !== 'select' && c.type !== 'dimensions');
      if (isSignificant) {
        return { past: saveHistory(tab), future: [], nodes: applyNodeChanges(changes, tab.nodes) as AppNode[], isDirty: true };
      } else {
        return { nodes: applyNodeChanges(changes, tab.nodes) as AppNode[] };
      }
    }),
    
    onEdgesChange: (changes: EdgeChange[]) => updateActiveTab(tab => {
      const isSignificant = changes.some(c => c.type !== 'select');
      if (isSignificant) {
         return { past: saveHistory(tab), future: [], edges: applyEdgeChanges(changes, tab.edges), isDirty: true };
      } else {
         return { edges: applyEdgeChanges(changes, tab.edges) };
      }
    }),

    onConnect: (connection: Connection) => updateActiveTab(tab => ({
      past: saveHistory(tab),
      future: [],
      edges: addEdge(connection, tab.edges),
      isDirty: true
    })),

    setNodes: (nodes: AppNode[]) => updateActiveTab(tab => ({ past: saveHistory(tab), future: [], nodes, isDirty: true })),
    setEdges: (edges: Edge[]) => updateActiveTab(tab => ({ past: saveHistory(tab), future: [], edges, isDirty: true })),

    updateNodeData: (nodeId: string, data: any) => updateActiveTab(tab => ({
        past: saveHistory(tab),
        future: [],
        isDirty: true,
        nodes: tab.nodes.map((node) => node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node),
    })),

    undo: () => updateActiveTab(tab => {
      if (tab.past.length === 0) return {};
      const newPast = [...tab.past];
      const previous = newPast.pop()!;
      return {
        past: newPast,
        future: [{ nodes: tab.nodes, edges: tab.edges }, ...tab.future],
        nodes: previous.nodes,
        edges: previous.edges,
        isDirty: true
      };
    }),

    redo: () => updateActiveTab(tab => {
      if (tab.future.length === 0) return {};
      const newFuture = [...tab.future];
      const next = newFuture.shift()!;
      return {
        past: [...tab.past, { nodes: tab.nodes, edges: tab.edges }],
        future: newFuture,
        nodes: next.nodes,
        edges: next.edges,
        isDirty: true
      };
    }),

    clearCanvas: () => updateActiveTab(tab => ({
      past: saveHistory(tab),
      future: [],
      nodes: [],
      edges: [],
      isDirty: true
    })),

    deleteSelectedNodes: () => updateActiveTab(tab => {
      const nodesToDelete = tab.nodes.filter(n => n.selected).map(n => n.id);
      if (nodesToDelete.length === 0) return {};
      return {
        past: saveHistory(tab),
        future: [],
        nodes: tab.nodes.filter(n => !n.selected),
        edges: tab.edges.filter(e => !nodesToDelete.includes(e.source) && !nodesToDelete.includes(e.target)),
        isDirty: true
      };
    }),

    importGraph: (nodes: AppNode[], edges: Edge[]) => updateActiveTab(tab => ({
      past: saveHistory(tab),
      future: [],
      nodes,
      edges,
      isDirty: true
    })),

    setFocusedNodeId: (id) => updateActiveTab(() => ({ focusedNodeId: id }))
  };
});

useWorkflowStore.subscribe((state) => {
  localStorage.setItem('hr_autosave_tabs', JSON.stringify({
    tabs: state.workspaceTabs,
    activeId: state.activeWorkspaceId
  }));
});
