import { LogicalOperator } from '@/types/docusign-types';

export interface File {
  name: string;
  path: string;
  pathTemplateValues: string[];
  content: string;
}

export interface Files {
  files: File[];
}

export type EqualsCondition = {
  field: string;
  value: string;
};

export type SimplifiedOperations = {
  equalsConditions: EqualsCondition[];
  operator: LogicalOperator;
};
