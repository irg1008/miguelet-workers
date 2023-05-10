import { KVNamespace, R2Bucket } from '@cloudflare/workers-types';

export type Env = {
  audiosBucket: R2Bucket;
  audiosKV: KVNamespace;
};
