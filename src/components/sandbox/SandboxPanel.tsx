import { useState, useEffect } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { simulateWorkflow } from '../../api/mockApi';

export const SandboxPanel = ({ onClose }: { onClose: () => void }) => {
  const store = useWorkflowStore();
  const activeTab = store.workspaceTabs.find(t => t.id === store.activeWorkspaceId);
  const nodes = activeTab?.nodes || [];
  const edges = activeTab?.edges || [];
  
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async () => {
    setLoading(true);
    setLogs([]);
    setError(null);
    try {
      const results = await simulateWorkflow(nodes, edges);
      setLogs(results);
    } catch (err: any) {
      setError(err.message || 'Simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full w-full font-normal">
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-300 bg-gray-100 text-sm text-gray-700">
          <div className="tracking-wide">TERMINAL</div>
          <button onClick={onClose} className="hover:text-gray-900 transition-colors">Close</button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto bg-[#1e1e1e] text-gray-300 flex flex-col gap-4 font-mono text-sm shadow-inner">
          <button 
            onClick={runSimulation}
            disabled={loading}
            className="self-start py-1.5 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Running...' : '> npm run simulate-workflow'}
          </button>

          {error && (
            <div className="text-red-400">
              [ERR] {error}
            </div>
          )}

          {logs.length > 0 && (
             <ul className="space-y-1">
                {logs.map((log, i) => (
                  <li key={i} className="flex gap-4">
                     <span className="text-gray-500">{(i+1).toString().padStart(2, '0')}</span>
                     <span className="text-[#4ade80]">{log}</span>
                  </li>
                ))}
             </ul>
          )}
        </div>
    </div>
  );
};
