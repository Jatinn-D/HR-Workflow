import React, { useRef } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { Panel } from '@xyflow/react';

export const ActionsToolbar = () => {
  const store = useWorkflowStore();
  const activeTab = store.workspaceTabs.find(t => t.id === store.activeWorkspaceId);
  const nodes = activeTab?.nodes || [];
  const edges = activeTab?.edges || [];
  const past = activeTab?.past || [];
  const future = activeTab?.future || [];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasSelectedNodes = nodes.some(n => n.selected);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ nodes, edges }));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "workflow_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = e => {
        try {
          const content = JSON.parse(e.target?.result as string);
          if (content.nodes && content.edges) {
            store.importGraph(content.nodes, content.edges);
          }
        } catch (err) {
          alert("Invalid workflow file.");
        }
      };
    }
  };

  return (
    <>
      <Panel position="top-center" className="bg-white px-4 py-1.5 rounded-xl shadow-md border border-gray-200 flex gap-2 items-center text-md font-normal z-10 m-4 overflow-x-auto justify-center">
        <button 
          onClick={store.undo} 
          disabled={past.length === 0} 
          className="px-3 py-1.5 whitespace-nowrap hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent rounded transition-colors text-gray-700 font-normal"
        >
          Undo
        </button>
        <button 
          onClick={store.redo} 
          disabled={future.length === 0} 
          className="px-3 py-1.5 whitespace-nowrap hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent rounded transition-colors text-gray-700 font-normal"
        >
          Redo
        </button>
        
        <div className="w-px h-5 bg-gray-300 mx-1"></div>

        <button 
          onClick={store.deleteSelectedNodes} 
          disabled={!hasSelectedNodes} 
          className="px-3 py-1.5 whitespace-nowrap hover:bg-red-50 text-red-600 disabled:opacity-40 disabled:hover:bg-transparent rounded transition-colors font-normal"
        >
          Delete Node
        </button>
        <button 
          onClick={store.clearCanvas} 
          className="px-3 py-1.5 whitespace-nowrap hover:bg-gray-100 text-gray-700 rounded transition-colors font-normal"
        >
          Clear Canvas
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1"></div>

        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="px-3 py-1.5 whitespace-nowrap hover:bg-gray-100 text-gray-700 rounded transition-colors font-normal"
        >
          Import
        </button>
        <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
        
        <button 
          onClick={handleExport} 
          className="px-3 py-1.5 whitespace-nowrap hover:bg-gray-100 text-gray-700 rounded transition-colors font-normal"
        >
          Export
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1 flex hidden sm:block"></div>

        <button 
          onClick={() => {
            const name = prompt("Enter a name for this workflow:", activeTab?.name || "Untitled Workflow");
            if (name) store.saveCurrentWorkflow(name);
          }} 
          className="px-4 py-1.5 whitespace-nowrap border border-gray-300 hover:bg-gray-50 text-gray-700 rounded transition-colors font-normal whitespace-nowrap"
        >
          Save Workflow
        </button>

        <button 
          onClick={store.toggleSandbox} 
          className="px-5 py-1.5 whitespace-nowrap bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors font-normal whitespace-nowrap"
        >
          {store.isSandboxOpen ? 'Hide Terminal' : 'Run Workflow'}
        </button>
      </Panel>

      <Panel position="bottom-center" className="mb-4 pointer-events-none">
        <div className="hidden md:flex items-center text-xs text-yellow-800 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-300 tracking-wide shadow-sm pointer-events-auto">
          <svg className="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
          <span className="font-normal text-yellow-900">Single-click to delete node. Double-click to configure node.</span>
        </div>
      </Panel>
    </>
  );
};
