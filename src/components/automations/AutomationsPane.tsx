import { useWorkflowStore } from '../../store/workflowStore';

export const AutomationsPane = () => {
  const { savedWorkflows, loadSavedWorkflow, deleteSavedWorkflow } = useWorkflowStore();

  const handleEdit = (id: string) => {
    loadSavedWorkflow(id);
  };

  const handleDelete = (id: string) => {
    const isConfirmed = window.confirm(
      "WARNING: Deleting this automation will permanently eradicate its state data. Any downstream HR logic relying on this specific node mapping may fail. Are you absolutely certain you want to delete this?"
    );
    if (isConfirmed) {
      deleteSavedWorkflow(id);
    }
  };

  const handleRun = (id: string) => {
    loadSavedWorkflow(id); 
    useWorkflowStore.setState({ isSandboxOpen: true });
  };

  return (
    <div className="p-10 max-w-6xl mx-auto font-normal">
      <h2 className="text-2xl text-gray-900 mb-8 tracking-wide">Saved Automations</h2>
      <p className="text-gray-600 mb-8 text-sm">Deploy, manage, or eradicate your persistent workflows here.</p>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 uppercase tracking-wider text-xs text-gray-500">
            <tr>
              <th className="px-6 py-4 font-normal">Name</th>
              <th className="px-6 py-4 font-normal">Nodes</th>
              <th className="px-6 py-4 font-normal">Last Modified</th>
              <th className="px-6 py-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {savedWorkflows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400 border-b border-gray-100 last:border-0 relative">
                   <div className="bg-gray-50 max-w-sm mx-auto p-6 rounded-lg border border-dashed border-gray-300 shadow-sm text-sm tracking-wide">
                      No automations constructed yet.
                   </div>
                </td>
              </tr>
            ) : (
              savedWorkflows.map(wf => (
                <tr key={wf.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-normal text-gray-900">{wf.name}</td>
                  <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs box-border">{wf.nodes.length} Blocks</span></td>
                  <td className="px-6 py-4 tracking-wide text-xs">{new Date(wf.updatedAt).toLocaleDateString()} | {new Date(wf.updatedAt).toLocaleTimeString()}</td>
                  <td className="px-6 py-4 flex justify-end gap-3 text-xs">
                    <button onClick={() => handleRun(wf.id)} className="px-4 py-1.5 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors">Run</button>
                    <button onClick={() => handleEdit(wf.id)} className="px-4 py-1.5 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-100 transition-colors shadow-sm">Edit</button>
                    <button onClick={() => handleDelete(wf.id)} className="px-4 py-1.5 border border-red-200 bg-white text-red-600 rounded hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
