export function create(options: GreenLockOptions): any;

export type GreenLockOptions = {
    version: string,
    configDir: string,
    server: string,
    store: any,
    approveDomains: Function,
    renewWithin: number,
    renewBy: number
}

declare module 'greenlock-express';