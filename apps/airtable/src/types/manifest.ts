export type Manifest = {
  id?: string;
  name: string;
  distribution: 'PUBLIC' | 'PRIVATE';
  description: {
    short: string;
    long: string;
  };
  publisher: {
    name: string;
    phone?: string;
    email: string;
    website?: string;
  };
  termsOfServiceUrl: string;
  privacyUrl: string;
  supportUrl: string;
  signupUrl: string;
  icon: Icon;
  screenshots: Screenshot[];
  connections: Connection[];
  extensions: Extension[];
  actions: Action[];
};

type MediaType =
  | 'image/apng'
  | 'image/avif'
  | 'image/gif'
  | 'image/jpeg'
  | 'image/png'
  | 'image/svg+xml'
  | 'image/webp;';

type Icon = {
  id?: string;
  data: string;
  mediaType: MediaType;
};

type Screenshot = {
  id?: string;
  data: string;
  mediaType: MediaType;
};

type Connection = {
  id?: string;
  name: string;
  description: string;
  type: 'oauth2';
  params: {
    provider: 'CUSTOM';
    scopes: string[];
    clientId: string;
    clientSecret: string;
    customConfig: {
      authorizationUrl: string; // URL must be one of .com | .net | .org | .app
      tokenUrl: string;
      authorizationParams?: Record<string, string>;
      authorizationMethod?: 'header' | 'body';
      scopeSeparator?: string;
      requiredScopes: string[];
      profile?: {
        url: string;
        httpMethod?: 'GET' | 'POST';
        idKey: string;
        emailKey: string;
      };
    };
  };
};

type Extension = {
  name: string;
  description: string;
  template:
    | 'DataIO.Version3.DataInputOutput'
    | 'DataIO.Version6.DataInputOutput'
    | 'EAP.Version1.SpecifiedArchive'
    | 'Verify.Version1.BankAccountOwner'
    | 'Verify.Version3.BankAccount'
    | 'Verify.Version1.BusinessEntity'
    | 'Verify.Version1.Email'
    | 'Verify.Version1.PhoneNumber'
    | 'Verify.Version2.SocialSecurityNumber';
  actionReferences: string[];
};

type Action = {
  name: string;
  description: string;
  template:
    | 'DataIO.Version1.CreateEntity'
    | 'DataIO.Version1.DeleteEntity'
    | 'DataIO.Version1.ReadEntity'
    | 'DataIO.Version1.ReadModelFields'
    | 'DataIO.Version1.ReadModels'
    | 'DataIO.Version3.SearchEntities'
    | 'DataIO.Version1.UpdateEntity'
    | 'DataIO.Version2.UpsertEntity'
    | 'Document.Version1.SpecifiedArchive'
    | 'Verify.Version1.BankAccountOwner'
    | 'Verify.Version3.BankAccount'
    | 'Verify.Version1.BusinessEntity'
    | 'Verify.Version1.Email'
    | 'Verify.Version1.PhoneNumber'
    | 'Verify.Version2.SocialSecurityNumber'
    | 'DataIO.Version6.GetTypeNames'
    | 'DataIO.Version6.GetTypeDefinitions'
    | 'DataIO.Version6.CreateRecord'
    | 'DataIO.Version6.PatchRecord'
    | 'DataIO.Version6.SearchRecords';
  connectionsReference: string;
  params: {
    uri: string;
  };
};
