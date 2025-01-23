import { generateAndLogErrorResponse } from '../../../../utils/api/response';
import { type DataIOCreateRecordInputType } from '@/types/docusign-types';
import { ASANA_COLUMNS, RECORD_FIELDS } from '../../../../constants';
import {
  createNewTaskOnExistingProject,
  createOrUpdateCustomFieldOnTask,
} from '../../../../utils/api/asana';

export async function POST(request: Request) {
  try {
    const accessToken = request.headers.get('Authorization') || '';
    const body: DataIOCreateRecordInputType = await request.json();

    if (body.typeName !== 'task') {
      // Support just tasks for now
      return generateAndLogErrorResponse(400, 'Unsupported type name');
    }

    const taskName = body.data[RECORD_FIELDS.TASK_NAME];

    const createTaskResult = await createNewTaskOnExistingProject(
      accessToken,
      taskName,
    );

    if (createTaskResult.error) {
      return generateAndLogErrorResponse(400, createTaskResult.error);
    }

    if (!createTaskResult.task) {
      return generateAndLogErrorResponse(500, 'Task creation failed');
    }

    const docusignStatus = body.data[RECORD_FIELDS.TASK_STATUS];

    if (docusignStatus) {
      const createOrUpdateCustomFieldResult =
        await createOrUpdateCustomFieldOnTask({
          accessToken,
          task: createTaskResult.task,
          customFieldName: ASANA_COLUMNS.STATUS,
          customFieldDisplayValue: docusignStatus,
        });

      if (createOrUpdateCustomFieldResult.error) {
        return generateAndLogErrorResponse(
          400,
          createOrUpdateCustomFieldResult.error,
        );
      }
    }

    return Response.json({
      recordId: `${createTaskResult.task.gid}`,
    });
  } catch (err: any) {
    console.error({
      err,
      message: err.message,
    });
    return generateAndLogErrorResponse(500);
  }
}
