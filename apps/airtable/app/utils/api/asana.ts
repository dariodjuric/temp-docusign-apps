import { getAsanaClient } from './get-asana-client';
import {
  ASANA_COLUMNS,
  ASANA_DEFAULT_PROJECT_NAME,
  ASANA_TASK_REQUIRED_OPTIONAL_FIELDS,
  RECORD_FIELDS,
} from '../../constants';
import type {
  NewCustomField,
  NewEnumOption,
  NewTask,
  Params,
  Project,
  Task,
  Workspace,
} from '@/types/asana';
import { type SimplifiedOperations } from '@/types/api';

const tasksByProjectIdCache: Map<string, Task[]> = new Map();
const tasksByIdCache: Map<string, Task> = new Map();

export async function getMatchingTasks({
  operations,
  accessToken,
}: {
  operations: SimplifiedOperations;
  accessToken: string;
}): Promise<Task[]> {
  console.log('Using query operations:', JSON.stringify(operations));

  // Extract the operator between conditions (right now there can be only one)
  const operator = operations.operator;

  // Retrieve all projects and their columns
  const projects = await getProjects(accessToken);

  const allTasks = new Map<string, Task>();

  let matchingTasksIds = new Set<string>();

  // For each condition, fetch matching tasks
  for (const condition of operations.equalsConditions) {
    const conditionMatchingTasks = new Set<Task>();

    if (condition.field === RECORD_FIELDS.TASK_ID) {
      const task = await getTaskById(condition.value, accessToken);
      if (task) {
        // This is the simplest condition
        conditionMatchingTasks.add(task);
      }
    } else if (condition.field === RECORD_FIELDS.PROJECT_NAME) {
      // Filter projects by name
      const matchingProjects = projects.filter(
        project =>
          project.name.toLowerCase().trim() === condition.value.toLowerCase(),
      );

      // For each matching project, get all tasks
      for (const project of matchingProjects) {
        const matchingProjectTasks = await getTasksByProjectId({
          projectId: project.gid,
          accessToken,
        });

        matchingProjectTasks.forEach(
          conditionMatchingTasks.add,
          conditionMatchingTasks,
        );
      }
    } else if (condition.field === RECORD_FIELDS.TASK_NAME) {
      for (const project of projects) {
        const tasks = await getTasksByProjectId({
          projectId: project.gid,
          accessToken,
        });

        const nameMatchingTasks = tasks.filter(
          task => task.name === condition.value,
        );

        nameMatchingTasks.forEach(
          conditionMatchingTasks.add,
          conditionMatchingTasks,
        );
      }
    } else {
      // For 'taskEmail', or 'taskDocusignStatus', we need to find the column IDs first
      for (const project of projects) {
        const tasks = await getTasksByProjectId({
          projectId: project.gid,
          accessToken,
        });

        if (condition.field === RECORD_FIELDS.TASK_EMAIL) {
          // search for the custom field with the name "Docusign Email" or "Email"
          const matchingTasksByEmail = tasks.filter(task => {
            const customField = task.custom_fields?.find(field => {
              const customFieldName = field.name.toLowerCase();

              return customFieldName === ASANA_COLUMNS.EMAIL.toLowerCase();
            });

            return customField?.display_value === condition.value;
          });

          matchingTasksByEmail.forEach(
            conditionMatchingTasks.add,
            conditionMatchingTasks,
          );
        }

        if (condition.field === RECORD_FIELDS.TASK_STATUS) {
          const matchingTasksByEmail = tasks.filter(task => {
            const customField = task.custom_fields?.find(field => {
              const customFieldName = field.name.toLowerCase();

              return customFieldName === ASANA_COLUMNS.STATUS;
            });

            return (
              customField?.display_value.toLowerCase() ===
              condition.value.toLowerCase()
            );
          });

          matchingTasksByEmail.forEach(
            conditionMatchingTasks.add,
            conditionMatchingTasks,
          );
        }

        if (condition.field === RECORD_FIELDS.TASK_ASSIGNEE_NAME) {
          const matchingTasksByEmail = tasks.filter(task => {
            const assignee = task.assignee;
            return (
              assignee?.name.toLowerCase() ===
              condition.value.toLowerCase().trim()
            );
          });

          matchingTasksByEmail.forEach(
            conditionMatchingTasks.add,
            conditionMatchingTasks,
          );
        }
      }
    }

    // Add all the tasks found by the condition to the allTasks Map
    conditionMatchingTasks.forEach(task => {
      allTasks.set(task.gid, task);
    });

    // Update the main matchingTasks based on the operator
    const conditionGids = new Set(
      Array.from(conditionMatchingTasks).map(task => task.gid),
    );
    if (operator === 'AND') {
      if (matchingTasksIds.size === 0) {
        // If matchingTasksIds is empty, we can just set it to the conditionGids
        matchingTasksIds = matchingTasksIds.union(conditionGids);
        continue;
      }

      matchingTasksIds = matchingTasksIds!.intersection(conditionGids);
    } else {
      matchingTasksIds = matchingTasksIds!.union(conditionGids);
    }
  }

  // convert the Map to an Array
  return Array.from(matchingTasksIds || [])
    .map(id => allTasks.get(id))
    .filter(task => task !== undefined);
}

async function getProjects(accessToken: string) {
  const asanaClient = getAsanaClient(accessToken);

  // We need to retrieve all the workspaces first, to get all the projects
  const allWorkSpaces = await getAllWorkSpaces(accessToken);
  const allProjects: Project[] = [];

  const projectsApiInstance = new asanaClient.ProjectsApi();

  // TODO: Filter by teams also to reduce possible time out
  // Asana: Note: This endpoint may timeout for large domains. Try filtering by team! // https://developers.asana.com/reference/getprojects

  // Per every workspace, get all projects and add them to the set
  for (const workspace of allWorkSpaces) {
    const opts: Partial<Params> = {
      limit: 100,
      workspace: workspace.gid,
    };

    let hasMore = true;
    let offset = '';

    while (hasMore) {
      const projects = await projectsApiInstance.getProjects({
        ...opts,
        ...(offset && { offset }),
      });

      projects.data.forEach(project => {
        allProjects.push(project);
      });

      if (projects._response.next_page) {
        offset = projects._response.next_page.offset;
      } else {
        hasMore = false;
      }
    }
  }

  return allProjects;
}

async function getAllWorkSpaces(accessToken: string) {
  const asanaClient = getAsanaClient(accessToken);

  const workspacesApiInstance = new asanaClient.WorkspacesApi();
  const opts = {
    limit: 100,
    opt_fields: '',
  };

  // Create a Set to store all workspaces
  const allWorkspaces: Workspace[] = [];

  let hasMore = true;
  let offset = '';

  while (hasMore) {
    const workspaces = await workspacesApiInstance.getWorkspaces({
      ...opts,
      ...(offset && { offset }),
    });

    allWorkspaces.push(...workspaces.data);

    if (workspaces._response.next_page) {
      offset = workspaces._response.next_page.offset;
    } else {
      hasMore = false;
    }
  }

  return allWorkspaces;
}

async function getTasksByProjectId({
  projectId,
  accessToken,
}: {
  projectId: string;
  accessToken: string;
}) {
  if (tasksByProjectIdCache.has(projectId)) {
    return tasksByProjectIdCache.get(projectId)!;
  }

  const asanaClient = getAsanaClient(accessToken);
  const tasksApiInstance = new asanaClient.TasksApi();

  // Create a Set to store all tasks
  const allTasks: Task[] = [];

  let hasMore = true;
  let offset = '';

  const opts = {
    limit: 100,
    project: projectId,
    opt_fields: ASANA_TASK_REQUIRED_OPTIONAL_FIELDS,
  };

  while (hasMore) {
    const tasks = await tasksApiInstance.getTasks({
      ...opts,
      ...(offset && { offset }),
    });

    allTasks.push(...tasks.data);

    if (tasks._response.next_page) {
      offset = tasks._response.next_page.offset;
    } else {
      hasMore = false;
    }
  }

  // Add the tasks to the cache
  tasksByProjectIdCache.set(projectId, allTasks);

  return allTasks;
}

export async function getTaskById(taskId: string, accessToken: string) {
  if (tasksByIdCache.has(taskId)) {
    return tasksByIdCache.get(taskId)!;
  }
  const asanaClient = getAsanaClient(accessToken);
  const tasksApiInstance = new asanaClient.TasksApi();

  const opts = {
    opt_fields: ASANA_TASK_REQUIRED_OPTIONAL_FIELDS,
  };

  try {
    const task = await tasksApiInstance.getTask(taskId, opts);

    // Add the task to the cache
    tasksByIdCache.set(task.data.gid, task.data);

    return task.data;
  } catch (error: any) {
    if (
      error &&
      typeof error === 'object' &&
      'status' in error &&
      error.status === 404
    ) {
      return null;
    }

    throw error;
  }
}

export async function createNewTaskOnExistingProject(
  accessToken: string,
  taskName: string = 'New task',
) {
  const projects = await getProjects(accessToken);

  // For now, we will just create tasks in the project with the name 'Docusign envelopes'
  // That way we reduce complexity, do not add tasks in unwanted projects, and we can focus on the main feature for v1 (creating tasks)
  const project = projects.find(
    project =>
      project.name.toLowerCase() === ASANA_DEFAULT_PROJECT_NAME.toLowerCase(),
  );

  if (!project) {
    // We can not create a project as we need to create a workspace first, and the latter is not possible with the current API
    return {
      error:
        "Project 'Docusign Envelopes' not found. Please create the project first",
    };
  }
  // create task in project with the name 'Docusign envelopes'
  const asanaClient = getAsanaClient(accessToken);
  const tasksApiInstance = new asanaClient.TasksApi();

  const response = await tasksApiInstance.createTask(
    {
      data: {
        name: taskName,
        projects: [project.gid],
      },
    },
    {
      opt_fields: ASANA_TASK_REQUIRED_OPTIONAL_FIELDS,
    },
  );
  return {
    task: response.data,
    projectId: project.gid,
  };
}

export async function createOrUpdateCustomFieldOnTask({
  task,
  accessToken,
  customFieldName,
  customFieldDisplayValue,
}: {
  task: Task;
  accessToken: string;
  customFieldName: string;
  customFieldDisplayValue: string;
}): Promise<{
  task?: Task;
  error?: string;
}> {
  // Check if custom field exists on the task
  let customField = await fetchCustomFieldForTask({
    task,
    accessToken,
    customFieldName,
  });

  const asanaClient = getAsanaClient(accessToken);
  if (!customField) {
    console.log('Custom field not found, creating it');

    customField = await createCustomFieldOnWorkspace({
      workspaceId: task.workspace?.gid || '',
      accessToken,
      customFieldName,
      customFieldDisplayValue,
    });
  }

  // If still not found, return an error
  if (!customField) {
    return {
      error: "Custom field not found and couldn't be created",
    };
  }

  // Before updating the task we need to check if the custom field is inside the task project
  // If it is not, we need to add it to the project
  let projectId = task.projects?.[0].gid;
  if (task.projects.length > 1) {
    console.log(
      'Task has multiple projects, trying to find "Docusign Envelopes" project or use the first one from the list',
    );
    const project = task.projects.find(
      project =>
        project.name.toLowerCase() === ASANA_DEFAULT_PROJECT_NAME.toLowerCase(),
    );

    if (!project) {
      console.log(
        'Project "Docusign Envelopes" not found, using the first project',
      );
    }

    projectId = project?.gid || projectId;
  }

  const projectCustomField = await fetchCustomFieldOnProject({
    projectId,
    accessToken,
    customFieldName,
  });

  if (!projectCustomField) {
    await addCustomFieldToProject({
      projectId,
      accessToken,
      customFieldId: customField.gid,
    });
  }

  // find the ID of the custom field enum value based on the display value
  let enumOption = customField.enum_options?.find(
    option => option.name === customFieldDisplayValue,
  );

  // It is possible that the enum option is disabled inside the project, we need to enable it before updating the task
  const disabledEnumOption =
    projectCustomField?.custom_field.enum_options?.find(
      option => option.name === customFieldDisplayValue,
    );

  if (disabledEnumOption && !disabledEnumOption.enabled) {
    const customFieldsApiInstance = new asanaClient.CustomFieldsApi();
    // update it and enable it
    await customFieldsApiInstance.updateEnumOption(disabledEnumOption.gid!, {
      body: {
        data: {
          enabled: true,
        },
      },
    });

    enumOption = disabledEnumOption;
  }

  if (!enumOption?.gid) {
    console.log('Enum option not found, creating it or enabling it');

    const createdEnumOptionResult = await createEnumOptionOnCustomField({
      customFieldId: customField.gid,
      accessToken,
      enumOptionName: customFieldDisplayValue,
    });

    if (!createdEnumOptionResult) {
      return {
        error: "Enum option not found and couldn't be created",
      };
    }

    enumOption = createdEnumOptionResult;
  }

  // Update the task with the custom field
  const updatedTask: Partial<NewTask> = {
    custom_fields: {
      [customField.gid]: enumOption?.gid || '',
    },
  };

  const tasksApiInstance = new asanaClient.TasksApi();
  const updatedTaskResponse = await tasksApiInstance.updateTask(
    { data: updatedTask },
    task.gid,
    {
      opt_fields: ASANA_TASK_REQUIRED_OPTIONAL_FIELDS,
    },
  );

  return {
    task: updatedTaskResponse,
  };
}

async function fetchCustomFieldForTask({
  task,
  accessToken,
  customFieldName,
}: {
  task: Task;
  accessToken: string;
  customFieldName: string;
}) {
  // Check if custom field exists on the task
  let customField = task.custom_fields?.find(
    field => field.name.toLowerCase() === customFieldName.toLowerCase(),
  );

  const asanaClient = getAsanaClient(accessToken);
  if (!customField) {
    console.log(
      'Custom field not found in the task, trying to find it in the workspace',
    );
    const customFieldsApiInstance = new asanaClient.CustomFieldsApi();

    const workspaceCustomFields =
      await customFieldsApiInstance.getCustomFieldsForWorkspace(
        task.workspace?.gid || '',
      );

    customField = workspaceCustomFields.data.find(
      field => field.name.toLowerCase() === customFieldName.toLowerCase(),
    );
  }

  return customField;
}

async function createCustomFieldOnWorkspace({
  workspaceId,
  accessToken,
  customFieldName,
  customFieldDisplayValue,
}: {
  workspaceId: string;
  accessToken: string;
  customFieldName: string;
  customFieldDisplayValue: string;
}) {
  const asanaClient = getAsanaClient(accessToken);
  const customFieldsApiInstance = new asanaClient.CustomFieldsApi();

  const newCustomField: NewCustomField = {
    name: customFieldName,
    workspace: workspaceId,
    enum_options: [
      {
        name: customFieldDisplayValue,
        enabled: true,
      },
    ],
    type: 'enum',
    enum_value: {
      name: customFieldDisplayValue,
      enabled: true,
    },
  };

  // Create the custom field in the workspace
  const res = await customFieldsApiInstance.createCustomField({
    data: newCustomField,
  });

  return res.data;
}

async function fetchCustomFieldOnProject({
  projectId,
  accessToken,
  customFieldName,
}: {
  projectId: string;
  accessToken: string;
  customFieldName: string;
}) {
  const asanaClient = getAsanaClient(accessToken);
  const customFieldsApiInstance = new asanaClient.CustomFieldSettingsApi();

  const projectCustomFields =
    await customFieldsApiInstance.getCustomFieldSettingsForProject(projectId);

  return projectCustomFields.data.find(
    field =>
      field.custom_field.name.toLowerCase() === customFieldName.toLowerCase(),
  );
}

async function addCustomFieldToProject({
  projectId,
  accessToken,
  customFieldId,
}: {
  projectId: string;
  accessToken: string;
  customFieldId: string;
}) {
  const asanaClient = getAsanaClient(accessToken);
  const projectsApiInstance = new asanaClient.ProjectsApi();

  const updatedProject = {
    data: {
      custom_field: customFieldId,
    },
  };
  await projectsApiInstance.addCustomFieldSettingForProject(
    updatedProject,
    projectId,
  );
}

export async function updateTask({
  taskId,
  newTask,
  accessToken,
}: {
  taskId: string;
  newTask: Partial<NewTask>;
  accessToken: string;
}) {
  const asanaClient = getAsanaClient(accessToken);
  const tasksApiInstance = new asanaClient.TasksApi();

  return tasksApiInstance.updateTask({ data: newTask }, taskId);
}

async function createEnumOptionOnCustomField({
  customFieldId,
  accessToken,
  enumOptionName,
}: {
  customFieldId: string;
  accessToken: string;
  enumOptionName: string;
}) {
  const asanaClient = getAsanaClient(accessToken);
  const customFieldsApiInstance = new asanaClient.CustomFieldsApi();

  const newEnumOption: NewEnumOption = {
    name: enumOptionName,
    enabled: true,
  };

  const { data } = await customFieldsApiInstance.createEnumOptionForCustomField(
    customFieldId,
    {
      body: {
        data: {
          ...newEnumOption,
        },
      },
    },
  );

  return data;
}
