//@ts-check
import { useEffect, useState } from 'react';

/**
 * @param {string} localStorageKey
 * @return {[string, React.Dispatch<React.SetStateAction<string>>]}
 */
const useStateWithLocalStorage = localStorageKey => {
  const [value, setValue] = useState(localStorage.getItem(localStorageKey) || '');

  useEffect(() => void localStorage.setItem(localStorageKey, value), [value, localStorageKey]);

  return [value, setValue];
};

export default useStateWithLocalStorage;
