import { R2Bucket } from '@cloudflare/workers-types';

export type Env = {
  BUCKET: R2Bucket;
};
