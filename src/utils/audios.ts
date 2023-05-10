import { R2Bucket, R2ListOptions, R2Object } from '@cloudflare/workers-types';

const getAllAudios = async function* (bucket: R2Bucket, limit: number) {
  const fetchAudios = (cursor?: R2ListOptions['cursor']) => bucket.list({ limit, cursor });

  let audios = await fetchAudios();

  while (audios.truncated) {
    yield audios.objects;
    audios = await fetchAudios(audios.cursor);
  }

  yield audios.objects;
};

const getallAudiosList = async (bucket: R2Bucket, limit = 1000) => {
  const iterator = getAllAudios(bucket, limit);

  const audios: R2Object[] = [];

  for await (const audio of iterator) {
    audios.push(...audio);
  }

  return audios;
};

export { getAllAudios, getallAudiosList };
