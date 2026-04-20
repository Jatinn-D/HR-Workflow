import { Handle, Position } from '@xyflow/react';
import { PlayIcon, CheckSquareIcon, UserCheckIcon, CpuIcon, StopCircleIcon } from '../../icons/icons';

const BaseNode = ({ label, icon, isSelected, children, typeLabel }: any) => {
  return (
    <div className={`px-4 py-3 bg-white shadow-md rounded-xl border-2 transition-all flex flex-col gap-2 min-w-[200px] font-normal ${isSelected ? 'border-primary-500 shadow-lg' : 'border-gray-200'}`}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-normal">{typeLabel}</div>
          <div className="text-sm text-gray-900 font-normal">{label}</div>
        </div>
      </div>
      {children && <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded font-normal">{children}</div>}
    </div>
  );
};

const SmartHandle = ({ type, position, className }: any) => (
  <Handle 
    type={type} 
    position={position} 
    className={`w-6 h-6 flex items-center justify-center bg-white border border-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-crosshair z-20 shadow-sm rounded-full ${className}`}
  >
    <span className="text-gray-500 text-[16px] leading-[0px] font-normal pointer-events-none">+</span>
  </Handle>
);

export const StartNode = ({ data, selected }: any) => (
  <div className="group relative">
    <BaseNode label={data.title || 'Start'} icon={<PlayIcon className="w-6 h-6" />} typeLabel="Start Node" isSelected={selected} />
    <SmartHandle type="source" position={Position.Bottom} className="-bottom-3" />
  </div>
);

export const TaskNode = ({ data, selected }: any) => (
  <div className="group relative">
    <SmartHandle type="target" position={Position.Top} className="-top-3" />
    <BaseNode label={data.title || 'Task'} icon={<CheckSquareIcon className="w-6 h-6" />} typeLabel="Task Node" isSelected={selected}>
      {data.assignee && <div>Assignee: {data.assignee}</div>}
    </BaseNode>
    <SmartHandle type="source" position={Position.Bottom} className="-bottom-3" />
  </div>
);

export const ApprovalNode = ({ data, selected }: any) => (
  <div className="group relative">
    <SmartHandle type="target" position={Position.Top} className="-top-3" />
    <BaseNode label={data.title || 'Approval'} icon={<UserCheckIcon className="w-6 h-6" />} typeLabel="Approval Node" isSelected={selected}>
      {data.role && <div>Role: {data.role}</div>}
    </BaseNode>
    <SmartHandle type="source" position={Position.Bottom} className="-bottom-3" />
  </div>
);

export const AutomatedNode = ({ data, selected }: any) => (
  <div className="group relative">
    <SmartHandle type="target" position={Position.Top} className="-top-3" />
    <BaseNode label={data.title || 'Automation'} icon={<CpuIcon className="w-6 h-6" />} typeLabel="Automated Node" isSelected={selected}>
      {data.actionId && <div>Action: {data.actionId}</div>}
    </BaseNode>
    <SmartHandle type="source" position={Position.Bottom} className="-bottom-3" />
  </div>
);

export const EndNode = ({ data, selected }: any) => (
  <div className="group relative">
    <SmartHandle type="target" position={Position.Top} className="-top-3" />
    <BaseNode label={data.title || 'End'} icon={<StopCircleIcon className="w-6 h-6" />} typeLabel="End Node" isSelected={selected} />
  </div>
);
