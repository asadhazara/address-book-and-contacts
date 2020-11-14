// @ts-check
import addressBookContext from 'contexts/addressBook';
import { useContext } from 'react';

const useAddressBook = () => {
  return useContext(addressBookContext);
};

export default useAddressBook;
