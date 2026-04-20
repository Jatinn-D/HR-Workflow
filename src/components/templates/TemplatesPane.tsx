import { useWorkflowStore } from '../../store/workflowStore';

const TEMPLATES = [
  {
    id: 'emp_onboard',
    name: 'Employee Onboarding',
    description: 'A standard comprehensive onboarding sequence covering IT setup, HR briefing, and Managerial sync.',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    nodes: 8
  },
  {
    id: 'hw_req',
    name: 'Hardware Request',
    description: 'Approval pipeline for fetching new laptops mapping directly to IT allocation DB routing.',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    nodes: 5
  },
  {
    id: 'offboarding',
    name: 'Silent Offboarding',
    description: 'Data lockdown, automated asset recovery emails, and exit interview routing procedures.',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    nodes: 12
  }
];

export const TemplatesPane = () => {
  const { createTab, saveCurrentWorkflow } = useWorkflowStore();

  const handleApplyTemplate = (templateName: string) => {
    // Generate functional pre-set node flows based on the template
    const nodes = [
      { id: `start-${Date.now()}`, type: 'startNode', position: { x: 250, y: 100 }, data: { title: `${templateName} Initialization` } },
      { id: `task-${Date.now()}`, type: 'taskNode', position: { x: 250, y: 250 }, data: { title: `Automated Routing Setup` } },
      { id: `end-${Date.now()}`, type: 'endNode', position: { x: 250, y: 400 }, data: { title: `Pipeline Terminated` } }
    ];
    const edges = [
      { id: `e1-${Date.now()}`, source: nodes[0].id, target: nodes[1].id },
      { id: `e2-${Date.now()}`, source: nodes[1].id, target: nodes[2].id }
    ];

    createTab(nodes as any, edges as any, templateName);
    // createTab updates the active workspace ID synchronously, allowing instant save.
    saveCurrentWorkflow(templateName);
  };

  return (
    <div className="p-10 max-w-6xl mx-auto font-normal">
      <div className="flex justify-between items-center mb-8">
         <h2 className="text-2xl text-gray-900 tracking-wide">Workflow Templates</h2>
         <button className="text-sm px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700 transition-colors">Request Template</button>
      </div>
      
      <p className="text-gray-600 mb-10 max-w-2xl text-sm leading-relaxed tracking-wide">
        Kickstart your logic by importing complex preset mappings automatically reviewed and optimized by HR system architects.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map(t => (
          <div key={t.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow">
            <div className={`h-24 ${t.color.split(' ')[0]} w-full border-b border-gray-100 flex items-center justify-center`}>
                <div className={`text-4xl opacity-50 font-normal ${t.color.split(' ')[2]}`}>✦</div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg text-gray-900 mb-2">{t.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">{t.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{t.nodes} Nodes</span>
                <button onClick={() => handleApplyTemplate(t.name)} className="text-sm text-primary-600 hover:text-primary-800 transition-colors">
                  Import Recipe &rarr;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
