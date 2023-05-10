import Fuse from 'fuse.js';

type SearchOptions = {
  q: string;
  limit: number;
};

const createFuse = (values: string[]) => {
  return new Fuse(values, {
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
    shouldSort: true,
  });
};

const search = (values: string[], { q, limit }: SearchOptions) => {
  const fuse = createFuse(values);
  const result = fuse.search(q, { limit });
  return result;
};

export { search };
