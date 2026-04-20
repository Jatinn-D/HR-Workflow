import type { AppNode } from '../types/workflow';
import type { Edge } from '@xyflow/react';

export const MOCK_AUTOMATIONS = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'update_hris', label: 'Update HRIS', params: ['employeeId', 'status'] },
];

export const getAutomations = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_AUTOMATIONS), 300));
};

export const simulateWorkflow = async (nodes: AppNode[], edges: Edge[]) => {
  return new Promise<string[]>((resolve, reject) => {
    setTimeout(() => {
      const logs: string[] = [];
      if (nodes.length === 0) {
        return reject(new Error("Workflow is empty!"));
      }
      
      const startNodes = nodes.filter(n => n.type === 'startNode');
      if (startNodes.length === 0) {
        return reject(new Error("Missing Start Node."));
      }

      let currentNodeId = startNodes[0].id;
      let failsafe = 0;
      
      while (currentNodeId && failsafe < 50) {
        const node = nodes.find(n => n.id === currentNodeId);
        if (!node) break;
        
        logs.push(`Executed [${node.type.toUpperCase()}]: ${node.data.title || node.id}`);
        
        const outgoingEdges = edges.filter(e => e.source === currentNodeId);
        if (outgoingEdges.length > 0) {
          currentNodeId = outgoingEdges[0].target;
        } else {
          break;
        }
        failsafe++;
      }

      logs.push('Simulation Finished Successfully.');
      resolve(logs);
    }, 800);
  });
};
