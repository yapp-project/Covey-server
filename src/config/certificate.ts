import greenlock from 'greenlock-express';
import greenlockStore from 'greenlock-store-fs';

export const lex = greenlock.create({
    version: 'v02',
    configDir: '/etc/letsencrypt',
    server: 'https://acme-v02.api.letsencrypt.org/directory',
    store: greenlockStore,
    approveDomains: (opts: any, certs: any, cb: any) => {
        if (certs) {
            opts.domains = ['covey.kr', 'www.covey.kr'];
        } else {
            opts.email = 'wowo0201@gmail.com';
            opts.agreeTos = true;
        }
        cb(null, { options: opts, certs });
    },
    renewWithin: 81 * 24 * 60 * 60 * 1000,
    renewBy: 80 * 24 * 60 * 60 * 1000,
  });