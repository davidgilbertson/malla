export function makeArray(obj) {
  return Object.keys(obj).reduce((result, key) => {
    result.push({
      _key: key,
      ...obj[key],
    });

    return result;
  }, []);
}
