import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  useReactFlow,
  MiniMap
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useWorkflowStore } from '../../store/workflowStore';
import { Sidebar } from './Sidebar';
import { StartNode, TaskNode, ApprovalNode, AutomatedNode, EndNode } from './CustomNodes';
import { NodeFormPanel } from '../forms/NodeFormPanel';
import { ActionsToolbar } from './ActionsToolbar';
import { WorkspaceTabsBar } from './WorkspaceTabsBar';

const nodeTypes = {
  startNode: StartNode,
  taskNode: TaskNode,
  approvalNode: ApprovalNode,
  automatedNode: AutomatedNode,
  endNode: EndNode,
};

const WorkflowArea = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const store = useWorkflowStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTab = store.workspaceTabs.find(t => t.id === store.activeWorkspaceId);
  const nodes = activeTab?.nodes || [];
  const edges = activeTab?.edges || [];
  const focusedNodeId = activeTab?.focusedNodeId || null;

  const hasFocusedNode = !!focusedNodeId;
  const isEmptyState = nodes.length === 0;

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { title: `New ${type.replace('Node', '')}` },
      };

      store.setNodes([...nodes, newNode as any]);
    },
    [nodes, screenToFlowPosition, store]
  );

  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: any) => {
    store.setFocusedNodeId(node.id);
  }, [store]);

  const onPaneClick = useCallback(() => {
    store.setFocusedNodeId(null);
  }, [store]);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = e => {
        try {
          const c = JSON.parse(e.target?.result as string);
          if (c.nodes && c.edges) store.importGraph(c.nodes, c.edges);
        } catch {}
      };
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full font-normal bg-gray-50 overflow-hidden relative">
      <WorkspaceTabsBar />
      <div className="flex-1 flex min-h-0 relative">
        <Sidebar />
        <div className="flex-1 h-full relative bg-[#f8f9fa]" ref={reactFlowWrapper}>
          
          {isEmptyState && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="bg-white/95 backdrop-blur-sm px-8 py-8 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center gap-4 text-center pointer-events-auto transform -translate-y-8">
                <div className="p-3 bg-gray-50 rounded-full border border-gray-100">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl text-gray-900 tracking-wide mb-2 font-normal">Empty Workspace</h3>
                  <p className="text-gray-500 text-sm max-w-xs">Drag a node component from the side panel or import an existing workflow map.</p>
                </div>
                <div className="mt-2 flex gap-3">
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors text-sm shadow-sm"
                  >
                    Import File
                  </button>
                  <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
                </div>
              </div>
            </div>
          )}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={store.onNodesChange}
            onEdgesChange={store.onEdgesChange}
            onConnect={store.onConnect}
            onNodeDoubleClick={onNodeDoubleClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            defaultEdgeOptions={{ type: 'smoothstep', style: { stroke: '#000000', strokeWidth: 2, strokeDasharray: '4 4' } }}
          >
            <Background color="#ececec" variant={'dots' as any} gap={16} size={2} />
            <Controls />
            <MiniMap 
              nodeColor={(n: any) => {
                if (n.type === 'startNode') return '#16a34a';
                if (n.type === 'endNode') return '#ef4444';
                if (n.type === 'approvalNode') return '#eab308';
                if (n.type === 'automatedNode') return '#9333ea';
                return '#2563eb';
              }}
              maskColor="rgba(240, 240, 240, 0.6)"
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            />
            <ActionsToolbar />
          </ReactFlow>
        </div>
        
        {/* Right Configuration Sidebar */}
        <div className={`bg-white border-l border-gray-200 transition-all duration-300 ease-in-out shadow-sm z-20 shrink-0 ${hasFocusedNode ? 'w-80' : 'w-0 overflow-hidden'}`}>
          <div className="w-80 h-full">
            <NodeFormPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export const WorkflowCanvas = () => (
  <ReactFlowProvider>
    <WorkflowArea />
  </ReactFlowProvider>
);
