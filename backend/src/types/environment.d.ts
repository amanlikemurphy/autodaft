declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production'
        PORT: string
        DATABASE_URL: string
        AWS_ACCESS_KEY_ID: string
        AWS_SECRET_ACCESS_KEY: string
        AWS_REGION: string
        // Add other environment variables as needed
      }
    }
  }
  
  export {}  // This file needs to be a module