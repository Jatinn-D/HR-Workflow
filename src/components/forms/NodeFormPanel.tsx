import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useWorkflowStore } from '../../store/workflowStore';

export const NodeFormPanel = () => {
  const store = useWorkflowStore();
  const activeTab = store.workspaceTabs.find(t => t.id === store.activeWorkspaceId);
  const nodes = activeTab?.nodes || [];
  const focusedNodeId = activeTab?.focusedNodeId || null;
  
  const selectedNode = nodes.find(n => n.id === focusedNodeId);
  const { register, reset } = useForm();

  useEffect(() => {
    if (selectedNode) {
      reset(selectedNode.data || {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedNodeId]);

  if (!selectedNode) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-white font-normal overflow-hidden relative">
      <div className="absolute top-4 right-4">
         <button onClick={() => store.setFocusedNodeId(null)} className="text-gray-400 hover:text-gray-800 text-xl font-normal transition-colors leading-none">&times;</button>
      </div>
      <div className="px-5 py-6 border-b border-gray-100 bg-gray-50 flex items-center pr-10">
        <h2 className="text-xl text-gray-900 font-normal">Properties</h2>
      </div>
      <form className="p-5 flex-1 overflow-y-auto w-full flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-800 tracking-wide">Label / Title</label>
          <input 
            {...register('title')} 
            onChange={(e) => store.updateNodeData(selectedNode.id, { title: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow" 
            placeholder="Node Title..."
          />
        </div>

        {selectedNode.type === 'startNode' && (
          <div className="flex flex-col gap-1.5 pt-2">
             <label className="text-gray-700 uppercase text-xs tracking-wider font-normal">Metadata (Optional)</label>
             <textarea {...register('metadata')} onChange={(e) => store.updateNodeData(selectedNode.id, { metadata: e.target.value })} rows={2} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow" placeholder='{"team": "engineering"}' />
          </div>
        )}

        {selectedNode.type === 'taskNode' && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 uppercase text-xs tracking-wider font-normal">Description</label>
              <textarea {...register('description')} onChange={(e) => store.updateNodeData(selectedNode.id, { description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 uppercase text-xs tracking-wider font-normal">Assignee</label>
              <input {...register('assignee')} onChange={(e) => store.updateNodeData(selectedNode.id, { assignee: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow" placeholder="e.g. IT Department" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 uppercase text-xs tracking-wider font-normal">Due Date</label>
              <input type="date" {...register('dueDate')} onChange={(e) => store.updateNodeData(selectedNode.id, { dueDate: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow" />
            </div>
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-gray-700 uppercase text-xs tracking-wider font-normal">Custom Fields (JSON)</label>
              <textarea {...register('customFields')} onChange={(e) => store.updateNodeData(selectedNode.id, { customFields: e.target.value })} rows={2} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 shadow-sm font-mono text-xs focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow" placeholder='{"priority": "high", "department": "IT"}' />
            </div>
          </>
        )}

        {selectedNode.type === 'approvalNode' && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 uppercase text-xs tracking-wider font-normal">Approver Role</label>
              <select {...register('role')} onChange={(e) => store.updateNodeData(selectedNode.id, { role: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow">
                <option value="">Select Role</option>
                <option value="Manager">Manager</option>
                <option value="Director">Director</option>
                <option value="HRBP">HRBP</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 uppercase text-xs tracking-wider font-normal">Auto-approve Threshold ($)</label>
              <input type="number" {...register('threshold')} onChange={(e) => store.updateNodeData(selectedNode.id, { threshold: Number(e.target.value) })} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow" placeholder="e.g. 500" />
            </div>
          </>
        )}

        {selectedNode.type === 'automatedNode' && (
          <>
             <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 uppercase text-xs tracking-wider font-normal">Automated Action</label>
              <select {...register('actionId')} onChange={(e) => store.updateNodeData(selectedNode.id, { actionId: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow">
                <option value="">Select Action</option>
                <option value="send_email">Send Email</option>
                <option value="generate_doc">Generate Document</option>
                <option value="update_hris">Update HRIS</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 uppercase text-xs tracking-wider font-normal">Action Parameters (JSON)</label>
              <textarea {...register('actionParams')} onChange={(e) => store.updateNodeData(selectedNode.id, { actionParams: e.target.value })} rows={2} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 shadow-sm font-mono text-xs focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow" placeholder='{"recipient": "it@company.com"}' />
            </div>
          </>
        )}

        {selectedNode.type === 'endNode' && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 uppercase text-xs tracking-wider font-normal">End Message</label>
              <input {...register('endMessage')} onChange={(e) => store.updateNodeData(selectedNode.id, { endMessage: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow" placeholder="Workflow Completed." />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="summaryFlag" {...register('summaryFlag')} onChange={(e) => store.updateNodeData(selectedNode.id, { summaryFlag: e.target.checked })} className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 outline-none" />
              <label htmlFor="summaryFlag" className="text-sm text-gray-800 tracking-wide select-none cursor-pointer">Generate Completion Summary</label>
            </div>
          </>
        )}
      </form>
    </div>
  );
};
