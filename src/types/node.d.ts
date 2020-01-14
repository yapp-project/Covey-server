declare namespace NodeJS {
    interface Process {
      /** running on server */
      isServer: boolean
    }
    interface ProcessEnv {
      /** node environment */
      NODE_ENV: string,
      SESSION_SECRET: string,
      COOKIE_SECRET: string,
      KAKAO_ID: string,
      KAKAO_SECRET: string,
      FACEBOOK_ID: string,
      FACEBOOK_SECRET: string,
      SENS_ACCESSKEYID: string,
      SENS_SERVICESECRET: string,
      MONGODB_URI: string,
      MONGODB_URI_LOCAL: string,
      PORT: string
      PORT_LOCAL: string
    }
  }