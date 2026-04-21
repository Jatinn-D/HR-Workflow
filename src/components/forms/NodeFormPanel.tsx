import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWorkflowStore } from '../../store/workflowStore';

const KeyValueEditor = ({ nodeId, fieldName, initialValue }: { nodeId: string, fieldName: string, initialValue: string | any }) => {
  const store = useWorkflowStore();
  
  const [pairs, setPairs] = useState<{k: string, v: string, id: number}[]>(() => {
     try {
       const obj = typeof initialValue === 'string' ? JSON.parse(initialValue || '{}') : (initialValue || {});
       const parsed = Object.entries(obj).map(([k,v]) => ({ k, v: String(v), id: Math.random() }));
       return parsed.length > 0 ? parsed : [{k: '', v: '', id: Math.random()}];
     } catch {
       return [{k: '', v: '', id: Math.random()}];
     }
  });

  const sync = (newPairs: {k: string, v: string, id: number}[]) => {
     setPairs(newPairs);
     const obj = newPairs.reduce((acc, curr) => {
        if (curr.k.trim()) acc[curr.k.trim()] = curr.v.trim();
        return acc;
     }, {} as any);
     store.updateNodeData(nodeId, { [fieldName]: JSON.stringify(obj) });
  };

  const updatePair = (index: number, key: 'k'|'v', val: string) => {
     const n = [...pairs];
     n[index][key] = val;
     sync(n);
  };

  return (
    <div className="flex flex-col gap-2">
      {pairs.map((p, i) => (
         <div key={p.id} className="flex gap-2 items-center">
           <input className="flex-1 w-1/2 px-2 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow placeholder:text-gray-400" placeholder="Key" value={p.k} onChange={e => updatePair(i, 'k', e.target.value)} />
           <input className="flex-1 w-1/2 px-2 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow placeholder:text-gray-400" placeholder="Value" value={p.v} onChange={e => updatePair(i, 'v', e.target.value)} />
           <button onClick={(e) => { e.preventDefault(); sync(pairs.filter((_, idx) => idx !== i)); }} className="text-gray-400 hover:text-red-500 transition-colors p-1 leading-none text-lg shrink-0">&times;</button>
         </div>
      ))}
      <button onClick={(e) => { e.preventDefault(); sync([...pairs, {k: '', v: '', id: Math.random()}]); }} className="text-xs text-primary-600 hover:text-primary-800 self-start transition-colors font-normal flex items-center gap-1 mt-1">
         <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Add Property
      </button>
    </div>
  );
};

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
             <label className="text-gray-800 text-sm tracking-wide font-normal">Initial Config</label>
             <KeyValueEditor key={selectedNode.id} nodeId={selectedNode.id} fieldName="metadata" initialValue={selectedNode.data.metadata} />
          </div>
        )}

        {selectedNode.type === 'taskNode' && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-800 text-sm tracking-wide font-normal">Description</label>
              <textarea {...register('description')} onChange={(e) => store.updateNodeData(selectedNode.id, { description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-800 text-sm tracking-wide font-normal">Assignee</label>
              <input {...register('assignee')} onChange={(e) => store.updateNodeData(selectedNode.id, { assignee: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow" placeholder="e.g. IT Department" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-800 text-sm tracking-wide font-normal">Due Date</label>
              <input type="date" {...register('dueDate')} onChange={(e) => store.updateNodeData(selectedNode.id, { dueDate: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow" />
            </div>
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-gray-800 text-sm tracking-wide font-normal">Custom Fields</label>
              <KeyValueEditor key={selectedNode.id} nodeId={selectedNode.id} fieldName="customFields" initialValue={selectedNode.data.customFields} />
            </div>
          </>
        )}

        {selectedNode.type === 'approvalNode' && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-800 text-sm tracking-wide font-normal">Approver Role</label>
              <select {...register('role')} onChange={(e) => store.updateNodeData(selectedNode.id, { role: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow">
                <option value="">Select Role</option>
                <option value="Manager">Manager</option>
                <option value="Director">Director</option>
                <option value="HRBP">HRBP</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-800 text-sm tracking-wide font-normal">Auto-approve Threshold</label>
              <input type="number" {...register('threshold')} onChange={(e) => store.updateNodeData(selectedNode.id, { threshold: Number(e.target.value) })} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow" placeholder="e.g. 500" />
            </div>
          </>
        )}

        {selectedNode.type === 'automatedNode' && (
          <>
             <div className="flex flex-col gap-1.5">
              <label className="text-gray-800 text-sm tracking-wide font-normal">Automated Action</label>
              <select {...register('actionId')} onChange={(e) => store.updateNodeData(selectedNode.id, { actionId: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow">
                <option value="">Select Action</option>
                <option value="send_email">Send Email</option>
                <option value="generate_doc">Generate Document</option>
                <option value="update_hris">Update HRIS</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-gray-800 text-sm tracking-wide font-normal">Action Parameters</label>
              <KeyValueEditor key={selectedNode.id} nodeId={selectedNode.id} fieldName="actionParams" initialValue={selectedNode.data.actionParams} />
            </div>
          </>
        )}

        {selectedNode.type === 'endNode' && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-800 text-sm tracking-wide font-normal">End Message</label>
              <input {...register('endMessage')} onChange={(e) => store.updateNodeData(selectedNode.id, { endMessage: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-shadow" placeholder="Workflow Completed." />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="summaryFlag" {...register('summaryFlag')} onChange={(e) => store.updateNodeData(selectedNode.id, { summaryFlag: e.target.checked })} className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 outline-none" />
              <label htmlFor="summaryFlag" className="text-sm text-gray-800 tracking-wide select-none cursor-pointer">Generate Completion Summary</label>
            </div>
          </>
        )}

        {/* Global Metadata for all nodes */}
        <div className="border-t border-gray-100 pt-6 mt-2 flex flex-col gap-3">
          <label className="text-gray-800 text-sm tracking-wide font-normal">Node Metadata</label>
          <KeyValueEditor key={`${selectedNode.id}-meta`} nodeId={selectedNode.id} fieldName="universalMetadata" initialValue={selectedNode.data.universalMetadata} />
        </div>
      </form>
    </div>
  );
};
