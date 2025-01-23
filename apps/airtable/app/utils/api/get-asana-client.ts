import * as Asana from 'asana';

export function getAsanaClient(accessToken: string) {
  const client = Asana.ApiClient.instance;

  const token = client.authentications['token'];
  token.accessToken = accessToken.replace('Bearer ', '');

  return Asana;
}
