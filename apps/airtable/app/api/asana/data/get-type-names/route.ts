/**
 * This gets a list of types available to read from in the "Read from Asana" step.
 * It is called when the extension is connected or reconnected.
 */
export async function POST(request: Request, params: any) {
  console.log('Reading: get type names');

  return Response.json({
    typeNames: [
      {
        typeName: 'task',
        label: 'Task',
        description:
          'The task is the basic object around which many operations in Asana are centered.',
      },
    ],
  });
}
