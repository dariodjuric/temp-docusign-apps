export const ASANA_COLUMNS = {
  STATUS: 'Docusign Envelope Status',
  EMAIL: 'Signer Email',
} as const;

export const ASANA_DEFAULT_PROJECT_NAME = 'Docusign Envelopes';

export const RECORD_FIELDS = {
  TASK_ID: 'taskId',
  PROJECT_NAME: 'projectName',
  PROJECT_ID: 'projectId',
  TASK_EMAIL: 'taskEmail',
  TASK_ASSIGNEE_NAME: 'taskAssigneeName',
  TASK_STATUS: 'taskDocusignStatus',
  TASK_NAME: 'taskName',
} as const;

export const ASANA_TASK_REQUIRED_OPTIONAL_FIELDS =
  'projects, projects.name, name, gid, custom_fields, custom_fields.name, custom_fields.display_value, custom_fields.enum_options, workspace, assignee, assignee.name';
