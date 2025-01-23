import { Manifest } from '@/types/manifest';
import asanaLogo from '../../public/asana-assets/asana-logo';
import findTasksImage from '../../public/asana-assets/1-find-tasks';
import readTasksImage from '../../public/asana-assets/2-read-tasks';
import writeEnvelopeStatusImage from '../../public/asana-assets/3-write-envelope-status';
import exportDocumentsImage from '../../public/asana-assets/4-export-documents';

export default function getAppManifest(): Manifest {
  const baseUrl = `${process.env.BASE_URL}api/asana`;
  return {
    name: 'Asana',
    distribution: 'PUBLIC',
    description: {
      short:
        "Create and update tasks in Asana from Docusign's agreement workflow.",
      long: `Asana is a popular work management platform that helps teams organize, track, and manage their work. With the Asana extension app for Docusign, you can now keep your Docusign processes in sync with tasks on Asana.
The Asana extension app introduces several new steps for use in Maestro workflows. These steps let you find tasks assigned to document signers, update the tasks with envelope statuses, as well as upload envelopes to Asana tasks.
Sign up at Asana.com to get started!`,
    },
    publisher: {
      name: 'This Dot Labs',
      email: 'asana-support@thisdot.co',
    },
    termsOfServiceUrl: 'https://www.thisdot.co/terms-of-use',
    privacyUrl: 'https://www.thisdot.co/privacy-policy',
    supportUrl: 'https://thisdot.github.io/asana-docusign-app/',
    signupUrl: 'https://asana.com/',
    icon: {
      data: asanaLogo,
      mediaType: 'image/png',
    },
    connections: [
      {
        name: 'authentication',
        description: 'Secure connection to Asana',
        type: 'oauth2',
        params: {
          provider: 'CUSTOM',
          scopes: ['asana'],
          clientId: process.env.ASANA_CLIENT_ID,
          clientSecret: process.env.ASANA_CLIENT_SECRET,
          customConfig: {
            tokenUrl: `https://app.asana.com/-/oauth_token`,
            authorizationUrl: 'https://app.asana.com/-/oauth_authorize',
            authorizationParams: {
              client_id: process.env.ASANA_CLIENT_ID,
              response_type: 'code',
            },
            scopeSeparator: ' ',
            requiredScopes: [],
            authorizationMethod: 'body',
          },
        },
      },
    ],
    extensions: [
      {
        name: 'Export documents to Asana',
        description: 'Export documents to Asana',
        template: 'EAP.Version1.SpecifiedArchive',
        actionReferences: ['Archive File to Asana'],
      },
      {
        name: 'Data I/O for Asana',
        description: 'Search for tasks on Asana and update them',
        template: 'DataIO.Version6.DataInputOutput',
        actionReferences: [
          'Get Type Names',
          'Get Type Definitions',
          'Create Record',
          'Patch Record',
          'Search Records',
        ],
      },
    ],
    actions: [
      {
        name: 'Archive File to Asana',
        description: 'Archive an envelope to a Asana item in a board',
        template: 'Document.Version1.SpecifiedArchive',
        connectionsReference: 'authentication',
        params: {
          uri: `${baseUrl}/archive`,
        },
      },
      {
        name: 'Get Type Names',
        description: 'Action to get type names of the records',
        template: 'DataIO.Version6.GetTypeNames',
        connectionsReference: 'authentication',
        params: {
          uri: `${baseUrl}/data/get-type-names`,
        },
      },
      {
        name: 'Get Type Definitions',
        description: 'Action to get the definitions of the records',
        template: 'DataIO.Version6.GetTypeDefinitions',
        connectionsReference: 'authentication',
        params: {
          uri: `${baseUrl}/data/get-type-definitions`,
        },
      },
      {
        name: 'Create Record',
        description: 'Action to create an entity',
        template: 'DataIO.Version6.CreateRecord',
        connectionsReference: 'authentication',
        params: {
          uri: `${baseUrl}/data/create-entity`,
        },
      },
      {
        name: 'Patch Record',
        description: 'Action to update an entity',
        template: 'DataIO.Version6.PatchRecord',
        connectionsReference: 'authentication',
        params: {
          uri: `${baseUrl}/data/update-records`,
        },
      },
      {
        name: 'Search Records',
        description: 'Action to search entities',
        template: 'DataIO.Version6.SearchRecords',
        connectionsReference: 'authentication',
        params: {
          uri: `${baseUrl}/data/search-entities`,
        },
      },
    ],
    screenshots: [
      {
        data: findTasksImage,
        mediaType: 'image/png',
      },
      {
        data: readTasksImage,
        mediaType: 'image/png',
      },
      {
        data: writeEnvelopeStatusImage,
        mediaType: 'image/png',
      },
      {
        data: exportDocumentsImage,
        mediaType: 'image/png',
      },
    ],
  };
}
