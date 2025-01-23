import { generateAndLogErrorResponse } from '../../../../utils/api/response';
import type { DataIOCreateRecordInputType } from '@/types/docusign-types';
import { ASANA_COLUMNS, RECORD_FIELDS } from '../../../../constants';
import {
  createOrUpdateCustomFieldOnTask,
  getTaskById,
  updateTask,
} from '../../../../utils/api/asana';

export async function POST(request: Request) {
  try {
    console.log('Reading: update records');
    const accessToken = request.headers.get('Authorization') || '';
    const body: DataIOCreateRecordInputType = await request.json();

    if (body.typeName !== 'task') {
      // Support just tasks for now
      return generateAndLogErrorResponse(400, 'Unsupported type name');
    }

    const taskId = body.recordId;

    if (!taskId) {
      return generateAndLogErrorResponse(
        404,
        'No record was found for the provided recordId',
      );
    }

    const docusignStatus = body.data[RECORD_FIELDS.TASK_STATUS];
    const taskName = body.data[RECORD_FIELDS.TASK_NAME];

    if (taskName) {
      await updateTask({
        accessToken,
        taskId,
        newTask: {
          name: taskName,
        },
      });
    }

    if (docusignStatus) {
      const task = await getTaskById(taskId, accessToken);
      if (task) {
        const createOrUpdateCustomFieldResult =
          await createOrUpdateCustomFieldOnTask({
            accessToken,
            task: task,
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
    }

    return Response.json({
      success: true,
    });
  } catch (err: any) {
    console.error({
      err,
      message: err.message,
    });
    return generateAndLogErrorResponse(500);
  }
}
