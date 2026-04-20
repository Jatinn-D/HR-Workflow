export const SettingsPane = () => {
  return (
    <div className="p-10 max-w-6xl mx-auto font-normal">
      <h2 className="text-2xl text-gray-900 mb-8 tracking-wide">Application Configuration</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h3 className="text-lg text-gray-900 border-b border-gray-100 pb-4 mb-6 tracking-wide">Styling & Interface</h3>
          
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="pr-4">
                <div className="text-gray-800 text-sm mb-1 tracking-wide">Canvas Grid Density</div>
                <div className="text-xs text-gray-500 leading-relaxed">Modify the dot-scale layout rendering distance inside the workflow engine.</div>
              </div>
              <select className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none bg-white cursor-pointer hover:border-gray-400 transition-colors shadow-sm">
                <option>Comfortable (16px)</option>
                <option>Compact (8px)</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="pr-4">
                <div className="text-gray-800 text-sm mb-1 tracking-wide">Accessibility Mode</div>
                <div className="text-xs text-gray-500 leading-relaxed">Increases contrast and thickens path strokes globally across UI components.</div>
              </div>
              <div className="w-11 h-6 bg-gray-200 rounded-full relative cursor-pointer hover:bg-gray-300 transition-colors shadow-inner">
                 <div className="w-4 h-4 bg-white rounded-full shadow absolute top-1 left-1"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h3 className="text-lg text-gray-900 border-b border-gray-100 pb-4 mb-6 tracking-wide">API & Logic Connectors</h3>
          
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-800 tracking-wide">Target API Webhook Route</label>
              <input type="text" disabled value="http://localhost:disabled/api/v2/" className="bg-gray-50 cursor-not-allowed shadow-inner text-gray-400 border border-gray-200 p-2.5 rounded text-sm w-full" />
            </div>
            
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-sm text-gray-800 tracking-wide">Global Secret Token Payload</label>
              <input type="password" value="****************" disabled className="bg-gray-50 cursor-not-allowed shadow-inner text-gray-400 border border-gray-200 p-2.5 rounded text-sm w-full" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
