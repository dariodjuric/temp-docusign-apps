// This mapping is to follow the error handling contract defined by Docusign
const codesToStatuses = new Map<number, string>();
codesToStatuses.set(404, 'NOT_FOUND');
codesToStatuses.set(400, 'BAD_REQUEST');
codesToStatuses.set(500, 'INTERNAL_SERVER_ERROR');

export function generateAndLogErrorResponse(
  statusCode: number,
  message: string = 'An error occurred',
) {
  console.error('Returning error response to Docusign', {
    statusCode,
    message,
  });
  return Response.json(
    { message, code: codesToStatuses.get(statusCode) },
    { status: statusCode },
  );
}
