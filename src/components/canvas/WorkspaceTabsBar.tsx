import { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';

export const WorkspaceTabsBar = () => {
  const { workspaceTabs, activeWorkspaceId, switchTab, closeTab, createTab, renameTab, saveCurrentWorkflow } = useWorkflowStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleDoubleClick = (tab: any) => {
    setEditingId(tab.id);
    setEditValue(tab.name);
  };

  const saveRename = (id: string, name: string) => {
    if (name.trim()) {
      renameTab(id, name.trim());
      saveCurrentWorkflow(name.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex items-center bg-gray-50 border-b border-gray-200 pl-0.5 gap-1 shrink-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
      {workspaceTabs.map(tab => {
        const isActive = tab.id === activeWorkspaceId;
        return (
          <div 
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            onDoubleClick={() => handleDoubleClick(tab)}
            className={`group flex items-center gap-2 px-4 py-1.5 min-w-[140px] max-w-[220px] rounded-t-lg transition-colors cursor-pointer border text-sm relative -mb-[1px] ${
              isActive 
                ? 'bg-white border-gray-200 border-b-white text-gray-900 z-10' 
                : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-200/60'
            }`}
          >
            <div className="flex-1 truncate select-none">
              {editingId === tab.id ? (
                 <input 
                   autoFocus
                   value={editValue}
                   onChange={e => setEditValue(e.target.value)}
                   onBlur={() => saveRename(tab.id, editValue)}
                   onKeyDown={e => {
                     if (e.key === 'Enter') saveRename(tab.id, editValue);
                     if (e.key === 'Escape') setEditingId(null);
                   }}
                   className="w-full bg-transparent outline-none font-normal"
                 />
              ) : (
                <span className="font-normal" title="Double click to rename & save">{tab.name}{tab.isDirty ? '*' : ''}</span>
              )}
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
              className={`text-gray-400 hover:text-red-500 hover:bg-red-50 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-all ${isActive ? 'opacity-100' : ''}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )
      })}
      
      <button 
        onClick={() => createTab()}
        className="text-gray-400 hover:text-gray-800 p-1 hover:bg-gray-200 rounded transition-colors"
        title="New Workflow"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};
