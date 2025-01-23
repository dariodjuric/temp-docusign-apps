declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BASE_URL: string;
      ASANA_CLIENT_ID: string;
      ASANA_CLIENT_SECRET: string;
    }
  }
}

export {};
