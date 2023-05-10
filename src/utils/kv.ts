import { KVNamespace, R2Bucket } from '@cloudflare/workers-types';
import { getallAudiosList } from './audios';

const initializeIndexValue = async (audios: R2Bucket, KV: KVNamespace) => {
  const files = await getallAudiosList(audios);
  const keys = files.map((file) => file.key);

  // Insert all keys in a unique array to use as index.
  await KV.put('index', JSON.stringify(keys));

  return keys;
};

const getIndex = async (KV: KVNamespace) => {
  const index = await KV.get('index');
  return index ? JSON.parse(index) : [];
};

export { initializeIndexValue, getIndex };
