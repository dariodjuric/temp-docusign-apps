This repo is for Asana [Docusign Extension App](https://developers.docusign.com/extension-apps/overview/). We're leveraging Next.js to generate our API routes and deployed via Vercel.

## Getting Started

1. Clone the repo
2. `npm install`
3. `cp .env.example .env`
4. Fill in the `.env` file with your related credentials
5. `npm run dev`

~This will get you up and running with the Next.js server.~

Next we need to transfer the manifest to Docusign.

1. Run `npm run generate-manifest` to generate the manifest file
2. Sign into [DocuSign app center](https://devconsole.docusign.com/apps)
3. Select the applicable app (or create a new one)
4. Open the **App Manifest** and upload the generated manifest file
5. Validate and Save the file

You should now be able to test your app in the Docusign environment.

If you make any changes to the code, they will need to be published to Vercel as well as published within the Docusign environment.

## App Manifest

Each app will need its own app manifest. See the Docusign docs for more details. The manifest file should be stored in `src/app-manifests` and should be named with the following format: `<app-name>.manisfest.ts`.

You can quickly create a new app manifest by running `cp src/app-manifests/base.manifest.ts src/app-manifests/<app-name>.manifest.ts`. We've created our own types for safety and so you can use environment variables for secrets.

To generate a manifest to upload to Docusign, run `npm run generate-manifest`. This will create a new JSON version of the file in `.manifest-out` under the same name using the JSON extension. This is the file you should upload to Docusign.

## API Routes

All the code is in the app/api directory. Keep all code related to a specific app in its own directory. The shareable code should be specific types and utilities. These can be put the in the `src` directory.
sdfsd
