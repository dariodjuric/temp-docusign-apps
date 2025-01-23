# DocuSign Apps Monorepo

This repo is for the DocuSign Apps Monorepo. It is built with Turborepo.

## Getting started

1. Clone the repo
2. `npm install`
3. `npm run dev:$APP_NAME` or go to `apps/$APP_NAME` and run `npm run dev`

## Deploying

Deploying is done via Vercel. Each app has its own GitHub workflow that will deploy the app to Vercel when a change is pushed to the `main` branch. The workflow checks if the app has been modified and if so, it will deploy the app to Vercel.

If for whatever reason the app detection did not work, you can manually trigger the workflow by going to the GitHub Actions tab and clicking the `Deploy Airtable app to Vercel` workflow.

## Creating additional apps

To create a new app, you can just clone one of the existing ones. For example, if you were to create a `monday` app from the `airtable` app, you would run:

```bash
> npx turbo gen workspace --name monday --copy airtable
turbo 2.3.3


>>> Copy an existing workspace from "docusign-apps"

? What type of workspace should be added? app
? Where should "monday" be added? ./apps/monday
? Add workspace dependencies to "monday"? No

>>> Success! Created monday at "./apps/monday"
```

Then you can make your changes to the `monday` app.

To enable deployment for the new app, you will need to add a new workflow file to the `.github/workflows` folder. Just copy the `deploy-airtable.yml` file and change the `FOLDER` variable to the name of the new app.
