// @ts-check
import 'components/AddressBook/style.scss';
import ContactDialog from 'components/ContactDialog';
import StatusFilter from 'components/StatusFilter';
import Button from 'components/shared/Button';
import addressBookContext from 'contexts/addressBook';
import useAddressBook from 'hooks/useAddressBook';
import useStateWithLocalStorage from 'hooks/useStateWithLocalStorage';
import { ReactComponent as PlusIcon } from 'icons/plus.svg';
import React, { useCallback, useEffect, useReducer } from 'react';
import groupBy from 'utils/groupBy';

/**
 * @typedef {import('contexts/addressBook').AddressBookState} AddressBookState
 * @typedef {import('contexts/addressBook').AddressBookActions} AddressBookActions
 * @type {React.Reducer<AddressBookState, AddressBookActions>}
 */
const addressBookReducer = (state, action) => {
  let newState = { ...state };

  switch (action.type) {
    case 'ADD_CONTACT':
      newState.filters.status = action.payload.status;
      newState.contacts = [...newState.contacts, action.payload];

      return newState;
    case 'DELETE_CONTACT':
      newState.contacts = newState.contacts.filter(contact => contact.id !== action.payload);

      return newState;
    case 'CHANGE_CONTACT':
      newState.filters.status = action.payload.status;
      newState.contacts = newState.contacts.map(contact =>
        contact.id === action.payload.id ? action.payload : contact
      );

      return newState;
    case 'SET_SELECTED_CONTACT':
      newState.selected = action.payload;
      return newState;
    case 'SET_STATUS_FILTER':
      newState.filters.status = action.payload;
      return newState;
    default:
      return state;
  }
};

/**
 * @type {React.FC}
 */
const AddressBook = () => {
  const [contacts, SetContacts] = useStateWithLocalStorage('AddressBook');

  const [state, dispatch] = useReducer(addressBookReducer, {
    contacts: JSON.parse(contacts || '[]'),
    filters: {
      status: 'Work',
    },
    selected: null,
  });

  // save contacts everytime it changes
  useEffect(() => void SetContacts(JSON.stringify(state.contacts)), [state.contacts, SetContacts]);

  // initial contact, this will be fetched
  // everytime no contact is found in state
  useEffect(() => {
    if (state.contacts.length > 0) return;

    fetch('https://randomuser.me/api/')
      .then(res => res.json())
      .then(({ results: [result] }) => result)
      .then(result =>
        dispatch({
          type: 'ADD_CONTACT',
          payload: {
            id: 1,
            name: `${result.name.first} ${result.name.last}`,
            status: state.filters.status,
            email: result.email,
            phone: result.phone,
          },
        })
      )
      .catch(console.log);
  }, [state.contacts, state.filters.status]);

  return (
    <addressBookContext.Provider value={[state, dispatch]}>
      <div className="AddressBook">
        <AddressBookHeader />
        <AddressBookList />
        {state.selected && <ContactDialog />}
      </div>
    </addressBookContext.Provider>
  );
};

/**
 * @type {React.FC}
 */
const AddressBookHeader = () => {
  const [{ contacts, filters }, dispatch] = useAddressBook();

  const handleOnAddContact = useCallback(
    () => dispatch({ type: 'SET_SELECTED_CONTACT', payload: Math.max(...contacts.map(contact => contact.id), 1) + 1 }),
    [contacts, dispatch]
  );

  const handleOnStatusChange = useCallback(
    /**
     * @param {import('contexts/addressBook').ContactStatus} status
     */
    status => dispatch({ type: 'SET_STATUS_FILTER', payload: status }),
    [dispatch]
  );

  return (
    <div className="AddressBook__Header">
      <h1 className="AddressBook__Title truncate">Address Book</h1>
      <div className="AddressBook__Actions ml-auto">
        <Button aria-label="Add Contact" className="flex" size="small" variant="secondary" onClick={handleOnAddContact}>
          <PlusIcon height="16" width="16" aria-hidden />
        </Button>
      </div>
      <div className="AddressBook__Filters">
        <StatusFilter status={filters.status} onChange={handleOnStatusChange} />
      </div>
    </div>
  );
};

/**
 * @type {React.FC}
 */
const AddressBookList = () => {
  const [{ contacts, filters }, dispatch] = useAddressBook();

  const groupedContacts = groupBy(
    contacts.filter(contact => contact.status === filters.status).sort((a, b) => (a.name[0] > b.name[0] ? 1 : -1)),
    item => item.name[0]
  );

  const handleOnSelect = useCallback(
    /**
     * @param {number} id
     */
    id => dispatch({ type: 'SET_SELECTED_CONTACT', payload: id }),
    [dispatch]
  );

  return (
    <ul className="AddressBook__List">
      {Object.keys(groupedContacts).map(key => (
        <React.Fragment key={key}>
          <li className="AddressBook__Item sticky top-0 bg-light">
            <div className="uppercase">{key}</div>
          </li>
          {groupedContacts[key].map(contact => (
            <li key={contact.name} className="AddressBook__Item">
              <button onClick={handleOnSelect.bind(null, contact.id)}>{contact.name}</button>
            </li>
          ))}
        </React.Fragment>
      ))}
    </ul>
  );
};

export default AddressBook;
