export function makeArray(obj) {
  if (!obj) return [];

  return Object.keys(obj).reduce((result, key) => {
    if (obj[key]) { // ignore where the key value is null
      result.push({
        _key: key,
        ...obj[key],
      });
    }

    return result;
  }, []);
}
