import { useWorkflowStore } from '../../store/workflowStore';

export const DashboardPane = () => {
  const { savedWorkflows, setActiveTab } = useWorkflowStore();
  
  const recentWorkflows = [...savedWorkflows]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const totalAutomations = savedWorkflows.length;
  const totalNodes = savedWorkflows.reduce((acc, wf) => acc + wf.nodes.length, 0);
  const totalEdges = savedWorkflows.reduce((acc, wf) => acc + wf.edges.length, 0);

  return (
    <div className="p-10 max-w-6xl mx-auto font-normal">
      <h2 className="text-2xl text-gray-900 mb-8 tracking-wide">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2 transition-transform hover:-translate-y-1 duration-300">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-normal">Total Saved Automations</div>
          <div className="text-4xl text-gray-900 font-normal">{totalAutomations}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2 transition-transform hover:-translate-y-1 duration-300">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-normal">Total Nodes Operational</div>
          <div className="text-4xl text-[#16a34a] font-normal">{totalNodes}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2 transition-transform hover:-translate-y-1 duration-300">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-normal">Active Data Connections</div>
          <div className="text-4xl text-primary-600 font-normal">{totalEdges}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
        <h3 className="text-lg text-gray-900 mb-6 font-normal">Recent Workflows</h3>
        <div className="flex flex-col gap-3">
          {recentWorkflows.length === 0 ? (
            <div className="text-gray-500 text-sm py-8 text-center bg-gray-50 rounded border border-dashed border-gray-200">
               No recent workflows found. Head over to the Workflows tab to create one!
            </div>
          ) : (
            recentWorkflows.map(wf => (
              <div 
                key={wf.id} 
                className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0 hover:bg-primary-50 px-4 rounded -mx-4 cursor-pointer transition-colors" 
                onClick={() => setActiveTab('automations')}
              >
                <div>
                   <div className="text-gray-900 text-sm font-normal">{wf.name || 'Untitled Workflow'}</div>
                   <div className="text-xs text-gray-400 mt-1 tracking-wide uppercase">Edited: {new Date(wf.updatedAt).toLocaleString()}</div>
                </div>
                <div className="text-xs text-primary-600 bg-primary-100 px-3 py-1 rounded-full font-normal">
                  {wf.nodes.length} Nodes
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
