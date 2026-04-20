import type { Node } from '@xyflow/react';

export type NodeType = 'startNode' | 'taskNode' | 'approvalNode' | 'automatedNode' | 'endNode';

export type StartNodeData = Record<string, unknown> & {
  title: string;
  metadata: Record<string, string>;
};

export type TaskNodeData = Record<string, unknown> & {
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: Record<string, string>;
};

export type ApprovalNodeData = Record<string, unknown> & {
  title: string;
  role: string;
  autoApproveThreshold: number;
};

export type AutomatedNodeData = Record<string, unknown> & {
  title: string;
  actionId: string;
  params: Record<string, string>;
};

export type EndNodeData = Record<string, unknown> & {
  message: string;
  isSummary: boolean;
};

export type AppNode =
  | Node<StartNodeData, 'startNode'>
  | Node<TaskNodeData, 'taskNode'>
  | Node<ApprovalNodeData, 'approvalNode'>
  | Node<AutomatedNodeData, 'automatedNode'>
  | Node<EndNodeData, 'endNode'>;
