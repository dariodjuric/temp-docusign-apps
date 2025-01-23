import { RECORD_FIELDS } from '../../../../constants';

export async function POST(request: Request) {
  console.log('Reading: get type definitions');
  const body = await request.json();
  console.log('Request Body:', JSON.stringify(body, null, 2));

  const declarations = [];

  if (body.typeNames.includes('task')) {
    declarations.push(TASK_MODEL);
  }

  return Response.json({
    declarations,
  });
}

const TASK_MODEL = {
  $class: 'concerto.metamodel@1.0.0.ConceptDeclaration',
  decorators: [
    {
      $class: 'concerto.metamodel@1.0.0.Decorator',
      arguments: [
        {
          $class: 'concerto.metamodel@1.0.0.DecoratorString',
          value: 'Task',
        },
      ],
      name: 'Term',
    },
    {
      $class: 'concerto.metamodel@1.0.0.Decorator',
      arguments: [
        {
          $class: 'concerto.metamodel@1.0.0.DecoratorString',
          value: 'Createable,Readable,Updateable',
        },
      ],
      name: 'Crud',
    },
  ],
  identified: {
    $class: 'concerto.metamodel@1.0.0.IdentifiedBy',
    name: RECORD_FIELDS.TASK_ID,
  },
  isAbstract: false,
  name: 'task',
  properties: [
    {
      $class: 'concerto.metamodel@1.0.0.StringProperty',
      decorators: [
        {
          $class: 'concerto.metamodel@1.0.0.Decorator',
          arguments: [
            {
              $class: 'concerto.metamodel@1.0.0.DecoratorString',
              value: 'Project Name',
            },
          ],
          name: 'Term',
        },
        {
          $class: 'concerto.metamodel@1.0.0.Decorator',
          arguments: [
            {
              $class: 'concerto.metamodel@1.0.0.DecoratorString',
              value: 'Readable',
            },
          ],
          name: 'Crud',
        },
      ],
      isArray: false,
      isOptional: false,
      lengthValidator: undefined,
      name: RECORD_FIELDS.PROJECT_NAME,
      validator: undefined,
    },
    {
      $class: 'concerto.metamodel@1.0.0.StringProperty',
      decorators: [
        {
          $class: 'concerto.metamodel@1.0.0.Decorator',
          arguments: [
            {
              $class: 'concerto.metamodel@1.0.0.DecoratorString',
              value: 'Signer Email Field',
            },
          ],
          name: 'Term',
        },
        {
          $class: 'concerto.metamodel@1.0.0.Decorator',
          arguments: [
            {
              $class: 'concerto.metamodel@1.0.0.DecoratorString',
              value: 'Readable',
            },
          ],
          name: 'Crud',
        },
      ],
      isArray: false,
      isOptional: false,
      lengthValidator: undefined,
      name: RECORD_FIELDS.TASK_EMAIL,
      validator: undefined,
    },
    {
      $class: 'concerto.metamodel@1.0.0.StringProperty',
      decorators: [
        {
          $class: 'concerto.metamodel@1.0.0.Decorator',
          arguments: [
            {
              $class: 'concerto.metamodel@1.0.0.DecoratorString',
              value: 'Task Assignee Name',
            },
          ],
          name: 'Term',
        },
        {
          $class: 'concerto.metamodel@1.0.0.Decorator',
          arguments: [
            {
              $class: 'concerto.metamodel@1.0.0.DecoratorString',
              value: 'Readable',
            },
          ],
          name: 'Crud',
        },
      ],
      isArray: false,
      isOptional: false,
      lengthValidator: undefined,
      name: RECORD_FIELDS.TASK_ASSIGNEE_NAME,
      validator: undefined,
    },
    {
      $class: 'concerto.metamodel@1.0.0.StringProperty',
      decorators: [
        {
          $class: 'concerto.metamodel@1.0.0.Decorator',
          arguments: [
            {
              $class: 'concerto.metamodel@1.0.0.DecoratorString',
              value: '"Docusign Envelope Status" Field',
            },
          ],
          name: 'Term',
        },
        {
          $class: 'concerto.metamodel@1.0.0.Decorator',
          arguments: [
            {
              $class: 'concerto.metamodel@1.0.0.DecoratorString',
              value: 'Updateable,Createable',
            },
          ],
          name: 'Crud',
        },
      ],
      isArray: false,
      isOptional: true,
      lengthValidator: undefined,
      name: RECORD_FIELDS.TASK_STATUS,
      validator: undefined,
    },
    {
      $class: 'concerto.metamodel@1.0.0.StringProperty',
      decorators: [
        {
          $class: 'concerto.metamodel@1.0.0.Decorator',
          arguments: [
            {
              $class: 'concerto.metamodel@1.0.0.DecoratorString',
              value: 'Task Name',
            },
          ],
          name: 'Term',
        },
        {
          $class: 'concerto.metamodel@1.0.0.Decorator',
          arguments: [
            {
              $class: 'concerto.metamodel@1.0.0.DecoratorString',
              value: 'Readable,Updateable,Createable',
            },
          ],
          name: 'Crud',
        },
      ],
      isArray: false,
      isOptional: true,
      lengthValidator: undefined,
      name: RECORD_FIELDS.TASK_NAME,
      validator: undefined,
    },
    {
      $class: 'concerto.metamodel@1.0.0.StringProperty',
      decorators: [
        {
          $class: 'concerto.metamodel@1.0.0.Decorator',
          arguments: [
            {
              $class: 'concerto.metamodel@1.0.0.DecoratorString',
              value: 'Task ID',
            },
          ],
          name: 'Term',
        },
        {
          $class: 'concerto.metamodel@1.0.0.Decorator',
          arguments: [
            {
              $class: 'concerto.metamodel@1.0.0.DecoratorString',
              value: 'Readable',
            },
          ],
          name: 'Crud',
        },
      ],
      isArray: false,
      isOptional: false,
      lengthValidator: undefined,
      name: RECORD_FIELDS.TASK_ID,
      validator: undefined,
    },
  ],
};
