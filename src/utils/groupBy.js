/**
 * Creates an object composed of keys generated from the results of running each element of collection through
 * iteratee. The corresponding value of each key is an array of the elements responsible for generating the
 * key. The iteratee is invoked with one argument: (value).
 * @template T
 * @template K
 * @param {T[]} collection
 * @param {((value: T) => K) | K} iteratee
 * @return {Record<K, T[]>} Returns the composed aggregate object.
 */
const groupBy = (collection, iteratee) =>
  collection.reduce((acc, cur) => {
    const key = typeof iteratee === 'string' ? cur[iteratee] : iteratee(cur);

    if (acc[key]) acc[key].push(cur);
    else acc[key] = [cur];

    return acc;
  }, {});

export default groupBy;
