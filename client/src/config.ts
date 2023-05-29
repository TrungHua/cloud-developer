// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'i8tn99veqi'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-154pfqqp2anne7j2.us.auth0.com',            // Auth0 domain
  clientId: 'tsFoBXbD6t02Wj7uMmfQX0z8bkhBB8is',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
