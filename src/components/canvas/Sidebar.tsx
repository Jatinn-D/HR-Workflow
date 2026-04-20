import React from 'react';
import { PlayIcon, CheckSquareIcon, UserCheckIcon, CpuIcon, StopCircleIcon } from '../../icons/icons';
import { useWorkflowStore } from '../../store/workflowStore';

const NODE_TYPES = [
  { type: 'startNode', label: 'Start Node', icon: <PlayIcon className="w-5 h-5" /> },
  { type: 'taskNode', label: 'Task Node', icon: <CheckSquareIcon className="w-5 h-5" /> },
  { type: 'approvalNode', label: 'Approval Node', icon: <UserCheckIcon className="w-5 h-5" /> },
  { type: 'automatedNode', label: 'Automated Node', icon: <CpuIcon className="w-5 h-5" /> },
  { type: 'endNode', label: 'End Node', icon: <StopCircleIcon className="w-5 h-5" /> },
];

export const Sidebar = () => {
  const { isSidebarOpen: isOpen, toggleSidebar } = useWorkflowStore();

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className={`bg-white border-r border-gray-200 flex flex-col shadow-sm z-10 relative h-full font-normal transition-all duration-300 ease-in-out ${isOpen ? 'w-64 p-4' : 'w-16 p-2 items-center'}`}>
      <div className={`flex w-full items-center mb-6 ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {isOpen && <h2 className="text-lg text-gray-800 font-normal whitespace-nowrap">Components</h2>}
        <button 
          onClick={toggleSidebar} 
          className="text-gray-400 hover:text-gray-800 transition-colors p-1.5 rounded hover:bg-gray-100 shrink-0"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
          </svg>
        </button>
      </div>

      {isOpen && <div className="text-sm text-gray-500 mb-4 px-2 tracking-wide font-normal whitespace-nowrap">Drag items to canvas</div>}
      
      <div className="flex flex-col gap-3 w-full">
        {NODE_TYPES.map((node) => (
          <div
            key={node.type}
            className={`flex items-center bg-gray-50 border border-gray-200 rounded-lg cursor-grab hover:bg-gray-100 hover:border-gray-300 transition-colors shadow-sm text-gray-700 font-normal ${isOpen ? 'px-4 py-3' : 'justify-center p-3'}`}
            onDragStart={(event) => onDragStart(event, node.type)}
            title={!isOpen ? node.label : undefined}
            draggable
          >
            <div className={isOpen ? 'mr-3' : ''}>{node.icon}</div>
            {isOpen && <span className="font-normal whitespace-nowrap">{node.label}</span>}
          </div>
        ))}
      </div>
    </aside>
  );
};
