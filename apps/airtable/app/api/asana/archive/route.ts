import { generateAndLogErrorResponse } from '../../../utils/api/response';
import type { Files } from '@/types/api';
import { LogicalOperator } from '@/types/docusign-types';
import { ASANA_DEFAULT_PROJECT_NAME, RECORD_FIELDS } from '../../../constants';
import { getMatchingTasks, getTaskById } from '../../../utils/api/asana';
import { getAsanaClient } from '../../../utils/api/get-asana-client';
import path from 'path';
import * as os from 'node:os';
import fs from 'fs';
import { Attachment, Task } from '@/types/asana';

export async function POST(request: Request) {
  let tempFilePath = '';
  try {
    console.log('Reading: archive files');
    const accessToken = request.headers.get('Authorization') || '';

    // parse the request body to get the files array
    const body: Files = await request.json();

    const files = body.files;

    for (const file of files) {
      // We expect the task ID or name to be provided through file path
      const task = await getTaskFromPath(file.path, accessToken);

      // Convert base64 to Buffer
      const content = Buffer.from(file.content, 'base64');

      // Replace placeholders in the file name with actual values.
      // Placeholders are in the format {{placeholder}}.
      // Use a regex to match all placeholders and replace them with values from the pathTemplateValues array.
      // The pathTemplateValues array is used to replace placeholders in the order they appear in the file name.
      // The values in the array are always sorted in order.
      // docs: https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/file-archive-extension/
      const fileName = file.name.replace(
        /{{[^}]+}}/g,
        () => file.pathTemplateValues.shift() || '',
      );

      tempFilePath = path.join(os.tmpdir(), fileName);
      // Create a temporary file
      fs.writeFileSync(tempFilePath, content);

      // Now use fs.createReadStream to get a proper file stream
      const fileContent: Attachment = {
        file: fs.createReadStream(tempFilePath),
        parent: task.gid,
        name: fileName,
        connect_to_app: true,
      };

      await addFileToTask({
        fileContent,
        accessToken,
      });
    }
    return Response.json({ message: 'Files uploaded successfully' });
  } catch (err: any) {
    console.error({
      err,
      message: err.message || '',
    });
    return generateAndLogErrorResponse(500);
  } finally {
    // Delete the temporary file
    fs.unlinkSync(tempFilePath);
  }
}
async function getTaskFromPath(
  path: string,
  accessToken: string,
): Promise<Task> {
  const taskId = parseInt(path);
  if (!isNaN(taskId)) {
    const task = await getTaskById(path, accessToken);
    if (task) {
      return task;
    }
  }

  // If the path is not a number, we assume it's a task name
  const tasks = await getMatchingTasks({
    operations: {
      operator: LogicalOperator.AND,
      equalsConditions: [{ field: RECORD_FIELDS.TASK_NAME, value: path }],
    },
    accessToken,
  });

  if (tasks.length === 0) {
    throw new Error(`No task found for path: ${path}`);
  }

  if (tasks.length > 1) {
    // As there are multiple tasks with the same name, let's try to find the one with the "Docusign Envelopes" project
    const task = tasks.find(task =>
      task.projects.some(
        project => project.name === ASANA_DEFAULT_PROJECT_NAME.toLowerCase(),
      ),
    );
    if (task) {
      return task;
    }
  }

  // Else, return the first task
  return tasks[0];
}

async function addFileToTask({
  fileContent,
  accessToken,
}: {
  fileContent: Attachment;
  accessToken: string;
}) {
  const asanaClient = getAsanaClient(accessToken);
  const attachmentsApiInstance = new asanaClient.AttachmentsApi();

  const res =
    await attachmentsApiInstance.createAttachmentForObject(fileContent);

  return res.data;
}
