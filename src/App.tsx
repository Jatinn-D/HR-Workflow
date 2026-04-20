import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { SandboxPanel } from './components/sandbox/SandboxPanel';
import { useWorkflowStore } from './store/workflowStore';
import { DashboardPane } from './components/dashboard/DashboardPane';
import { TemplatesPane } from './components/templates/TemplatesPane';
import { AutomationsPane } from './components/automations/AutomationsPane';
import { SettingsPane } from './components/settings/SettingsPane';

function App() {
  const { isSandboxOpen, toggleSandbox, activeTab, setActiveTab } = useWorkflowStore();
  const navLinks = ['Dashboard', 'Workflows', 'Templates', 'Automations', 'Settings'];

  return (
    <div className="h-screen w-full flex flex-col bg-white overflow-hidden text-gray-900 font-normal">
      <header className="bg-white border-b border-gray-200 flex items-center z-20 shadow-sm shrink-0 h-16 px-6 relative justify-between">
        <div className="z-10">
          <h1 className="text-2xl tracking-wider text-gray-900 font-bold cursor-pointer" onClick={() => setActiveTab('workflows')}>
            Workflow <span className="text-primary-600 font-italic">Designer</span>
          </h1>
        </div>
        
        <nav className="absolute left-1/2 -translate-x-1/2 flex gap-2 items-center px-2 py-1.5 z-10">
          {navLinks.map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-3 py-1 text-sm transition-colors rounded font-normal tracking-wide ${activeTab === tab.toLowerCase() ? 'bg-primary-600 text-white shadow-sm border border-gray-300' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="z-10">
           {/* Space reserved for profile or extra actions */}
        </div>
      </header>
      
      <main className="flex-1 flex flex-col min-h-0 bg-[#f8f9fa] relative">
        <div className="absolute inset-0 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardPane />}
          {activeTab === 'templates' && <TemplatesPane />}
          {activeTab === 'automations' && <AutomationsPane />}
          {activeTab === 'settings' && <SettingsPane />}
        </div>
        
        {activeTab === 'workflows' && (
           <div className="flex-1 h-full relative flex">
              <WorkflowCanvas />
           </div>
        )}
        
        {/* Terminal Sandbox (VSCode Style drawer) */}
        {isSandboxOpen && activeTab === 'workflows' && (
          <div className="h-64 border-t border-gray-300 bg-gray-50 shrink-0 w-full flex flex-col z-50 shadow-t absolute bottom-0 left-0">
            <SandboxPanel onClose={() => toggleSandbox()} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
