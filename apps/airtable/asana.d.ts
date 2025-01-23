declare module 'asana' {
  import type {
    AttachmentApiResponse,
    CustomFieldSetting,
    EnumOption,
    ExistingCustomField,
    NewCustomField,
    NewTask,
    Params,
    Project,
    RequestBody,
    ResponseBody,
    ResponseList,
    Task,
    Workspace,
  } from '@/types/asana';

  export class ApiClient {
    // Static instance property
    static instance: ApiClient;

    authentications: {
      token: {
        accessToken: string;
      };
    };
  }

  export class ProjectsApi {
    /**
     * Creates a new ProjectsApi instance.
     * No arguments are required for instantiation.
     */
    constructor();

    getProject(
      project_gid: string,
      opts?: Partial<Params>,
    ): Promise<ResponseBody<Project>>;

    getProjects(ops: Partial<Params>): Promise<ResponseList<Project>>;

    addCustomFieldSettingForProject(
      body: RequestBody<{
        custom_field: string;
      }>,
      project_gid,
      opts?: Partial<Params>,
    ): Promise<ResponseBody<Project>>;
  }

  export class TasksApi {
    /**
     * Creates a new TasksApi instance.
     * No arguments are required for instantiation.
     */
    constructor();

    getTasks(ops: Partial<Params>): Promise<ResponseList<Task>>;

    getTask(
      task_gid: string,
      opts: Partial<Params>,
    ): Promise<ResponseBody<Task>>;

    createTask(
      body: RequestBody<NewTask>,
      opts?: Partial<Params>,
    ): Promise<{ data: Task }>;

    updateTask(
      body: RequestBody<Partial<NewTask>>,
      task_gid: string,
      opts?: Partial<Params>,
    ): Promise<Task>;
  }

  export class WorkspacesApi {
    /**
     * Creates a new WorkspacesApi instance.
     * No arguments are required for instantiation.
     */
    constructor();

    getWorkspace(
      workspace_gid: string,
      opts?: Partial<Params>,
    ): Promise<ResponseBody<Workspace>>;

    getWorkspaces(opts: Partial<Params>): Promise<ResponseList<Workspace>>;
  }

  export class CustomFieldsApi {
    /**
     * Creates a new CustomFieldsApi instance.
     * No arguments are required for instantiation.
     */
    constructor();

    createCustomField(
      body: RequestBody<NewCustomField>,
      opts?: Partial<Params>,
    ): Promise<ResponseBody<ExistingCustomField>>;

    getCustomFieldsForWorkspace(
      workspace_gid: string,
      opts?: Partial<Params>,
    ): Promise<ResponseBody<ExistingCustomField[]>>;

    createEnumOptionForCustomField(
      custom_field_gid: string,
      opts: Partial<Params>,
    ): Promise<ResponseBody<EnumOption>>;

    updateEnumOption(
      enum_potion_gid: string,
      opts: Partial<Params>,
    ): Promise<EnumOption>;
  }

  export class CustomFieldSettingsApi {
    /**
     * Creates a new CustomFieldSettingsApi instance.
     * No arguments are required for instantiation.
     */
    constructor();

    getCustomFieldSettingsForProject(
      project_gid: string,
      opts?: Partial<Params>,
    ): Promise<ResponseBody<CustomFieldSetting[]>>;
  }

  export class AttachmentsApi {
    /**
     * Creates a new AttachmentsApi instance.
     * No arguments are required for instantiation.
     */
    constructor();

    createAttachmentForObject(
      Attachment,
    ): Promise<ResponseBody<AttachmentApiResponse>>;
  }
}
