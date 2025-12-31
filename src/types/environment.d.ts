declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT?: string;
    DB_NAME: string;
    DB_PASSWORD: string;
    DB_SERVER: string;
    TOKEN_SECRET: string;
    GOOGLE_API_KEY?: string;
    ADMIN_SECRET_TOKEN?: string;
    // Dodaj tutaj inne zmienne środowiskowe, które są używane w projekcie
  }
}