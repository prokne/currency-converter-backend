declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      APIKEY: string;
    }
  }
}
export {};
