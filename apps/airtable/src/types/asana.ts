import { RECORD_FIELDS } from '../../app/constants';
import { ReadStream } from 'node:fs';

export type DocusignRecord = {
  [RECORD_FIELDS.PROJECT_NAME]: string | null;
  [RECORD_FIELDS.PROJECT_ID]: string | null;
  [RECORD_FIELDS.TASK_ID]: string;
  [RECORD_FIELDS.TASK_EMAIL]: string | null;
  [RECORD_FIELDS.TASK_NAME]: string | null;
};

export interface ResponseList<T> {
  data: T[];
  _response: {
    next_page: {
      offset: string;
    };
    data: T[];
  };
}

export interface RequestBody<T> {
  data: T;
}

export interface ResponseBody<T> {
  data: T;
}
export interface BaseCustomField {
  name: string;
  display_value: string;
  enum_options: EnumOption[];
  workspace: Workspace;
}

export interface ExistingCustomField extends BaseCustomField {
  gid: string; // Existing fields must have a GID
}

export interface NewCustomField
  extends Omit<
    BaseCustomField,
    'workspace' | 'enum_options' | 'display_value'
  > {
  gid?: string;
  display_value?: string;
  workspace: string;
  enum_value?: EnumOption;
  enum_options?: EnumOption[]; // now it's optional without conflict
  type: 'enum' | 'text' | 'multi_enum' | 'number' | 'date' | 'people';
}

export interface Task {
  gid: string;
  name: string;
  assignee?: {
    gid: string;
    name: string;
  };
  custom_fields?: ExistingCustomField[];
  projects: Project[];
  workspace: Workspace;
}

export interface NewTask {
  name: string;
  projects: string[];
  custom_fields?: {
    [key: string]: string;
  };
}

export interface Project {
  gid: string;
  name: string;
}

export interface NewProject extends Partial<Project> {
  custom_fields?: {
    [key: string]: string;
  };
}

export interface Workspace {
  gid: string;
  name: string;
  custom_fields?: ExistingCustomField[];
}

export interface Params {
  body: Record<string, any>;
  limit: number;
  offset: string;
  workspace: string;
  team: string;
  archived: boolean;
  opt_fields: string;
}

export interface BaseEnumOption {
  gid: string;
  name: string;
  color?: string;
  enabled: boolean;
}

export interface NewEnumOption extends Omit<BaseEnumOption, 'gid'> {
  gid?: string;
}

export type EnumOption = BaseEnumOption | NewEnumOption;

export interface CustomFieldSetting {
  gid: string;
  project: Project;
  is_important: boolean;
  custom_field: ExistingCustomField;
}

export interface Attachment {
  resource_subtype?: string;
  // required for Asana attachments
  file?: File | ReadStream;
  // Required identifier of the parent task, project, or project_brief, as a string.
  parent: string;
  // Required for External attachments
  url?: string;
  // Required for External attachments
  name?: string;
  // Optional. only relevant for external attachments with a parent task. a boolean indicating whether the current app should be connected with the attachment for the purposes of showing an app components widget. requires the app to have been added to a project the parent task is in.
  connect_to_app?: boolean;
}

export interface AttachmentApiResponse {
  gid: string;
  resource_type: string;
  name: string;
  resource_subtype: string;
  created_at: string;
  download_url: string;
  permanent_url: string;
  host: string;
  parent: {
    gid: string;
    resource_type: string;
    name: string;
    resource_subtype: string;
    created_by: {
      gid: string;
      resource_type: string;
    };
  };
  size: number;
  view_url: string;
  connected_to_app: boolean;
}
