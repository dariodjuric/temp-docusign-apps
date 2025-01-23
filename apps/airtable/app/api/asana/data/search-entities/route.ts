import { generateAndLogErrorResponse } from '../../../../utils/api/response';
import { type DataIOSearchRecordsInputType } from '@/types/docusign-types';
import { getMatchingTasks } from '../../../../utils/api/asana';
import { parseOperation } from '../../../../utils/utils';
import type { DocusignRecord, Project, Task } from '@/types/asana';
import { type SimplifiedOperations } from '@/types/api';

export async function POST(request: Request) {
  try {
    console.debug('Reading: search records');
    const accessToken = request.headers.get('Authorization') || '';

    const body = (await request.json()) as DataIOSearchRecordsInputType;

    const operations = parseOperation(body.query.queryFilter.operation);

    const tasks = await getMatchingTasks({
      accessToken,
      operations,
    });

    const records = convertTasksToRecords(tasks, operations);

    return Response.json({
      records,
    });
  } catch (err: any) {
    console.error({
      err,
      message: err.message,
    });
    return generateAndLogErrorResponse(500);
  }
}

function convertTasksToRecords(
  tasks: Task[],
  operations: SimplifiedOperations,
): DocusignRecord[] {
  if (!tasks.length) {
    return [];
  }

  const projectNameFromCondition = operations.equalsConditions.find(
    condition => condition.field === 'projectName',
  )?.value;

  return tasks.map(task => {
    // transform it to a DocusignRecord
    const taskEmail =
      task.custom_fields?.find(
        field => field.name.toLowerCase() === 'signer email',
      )?.display_value || null;

    // A task can be in multiple projects, we can just retrieve one of them. If the user doesn't specify the project name
    // we retrieve the first entry in the projects array
    const project = selectProject(task, projectNameFromCondition);

    return {
      projectId: project?.gid || null,
      projectName: project?.name || null,
      taskId: task.gid,
      taskName: task.name,
      taskEmail,
      taskAssigneeName: task.assignee?.name,
    };
  });
}

function selectProject(
  task: Task,
  projectName: string | undefined,
): Project | undefined {
  // If a project name is specified, attempt to find the matching project.
  if (projectName) {
    const matchedProject = task.projects.find(
      project => project.name === projectName,
    );

    // If a matching project is found, return it.
    if (matchedProject) {
      return matchedProject;
    }

    // If no matching project is found, fall back to the first project in the array.
    return task.projects[0];
  }

  // If no project name is specified, return the first project in the array.
  return task.projects[0];
}
