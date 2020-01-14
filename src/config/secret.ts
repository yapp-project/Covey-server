import 'dotenv/config';

import logger from './logger';

export const NODE_ENV: string = process.env.NODE_ENV;

const isProduction: boolean = NODE_ENV === 'production';

export const PORT: string = isProduction? process.env.PORT : process.env.PORT_LOCAL;

export const MONGODB_URI: string = isProduction ? process.env.MONGODB_URI : process.env.MONGODB_URI_LOCAL;

export const SESSION_SECRET: string = process.env.SESSION_SECRET;
export const KAKAO_ID: string = process.env.KAKAO_ID;
export const KAKAO_SECRET: string = process.env.KAKAO_SECRET;
export const FACEBOOK_ID: string = process.env.FACEBOOK_ID;
export const FACEBOOK_SECRET: string = process.env.FACEBOOK_SECRET;
export const SENS_ACCESSKEYID: string = process.env.SENS_ACCESSKEYID;
export const SENS_SERVICESECRET: string = process.env.SENS_SERVICESECRET;

if (!MONGODB_URI) {
    if (isProduction) {
        logger.error('No mongo connection string. Set MONGODB_URI environment variable.');
    } else {
        logger.error('No mongo connection string. Set MONGODB_URI_LOCAL environment variable.');
    }
    process.exit(1);
}

if (!SESSION_SECRET) {
    logger.error('No client secret. Set SESSION_SECRET environment variable.');
    process.exit(1);
}
























export default {
    auth: {
        key: process.env.COOKIE_SECRET || 'yappCovey',
    },
    db: {
        url: process.env.MONGO_URI || 'mongodb://{username}:{password}}@localhost:{port}/{database}',
    },
    kakao: {
        id: process.env.KAKAO_ID || '767c05c1d69f4e8d0f0fc11d5517bab6',
    },
    facebook: {
        id: process.env.FACEBOOK_ID || '560670554763276',
        secret: process.env.FACEBOOK_SECRET || '6146205c59fdc8d2cb186de2c43c0d39',
    },
    sens: {
        id: process.env.SENS_ACCESSKEYID || 'B9sh5OVaaiTGDzyZQ2Ox',
        secret: process.env.SENS_SERVICESECRET || 'ae70f49029954e3b9da77ad787d65aaa',
    }
};
  