import fuzzy from 'fuzzy';

export function fuzzySearch({searchStr, arr, prop}) {
  const options = {
    pre: '<strong>',
    post: '</strong>',
    extract: el => el[prop],
  };

  return fuzzy
    .filter(searchStr, arr, options)
    .map(el => ({
      ...el.original,
      matchString: el.string,
    }));
}
