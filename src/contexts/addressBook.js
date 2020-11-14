// @ts-check
import { createContext } from 'react';

/**
 * @typedef {'Work' | 'Private'} ContactStatus
 */

/**
 * @typedef {object} Contact
 * @property {number} id
 * @property {ContactStatus} status
 * @property {string} name
 * @property {string} phone
 * @property {string} email
 */

/**
 * @typedef {object} AddressBookFilters
 * @property {ContactStatus} status
 */

/**
 * @typedef {object} AddressBookState
 * @property {Contact[]} contacts
 * @property {AddressBookFilters} filters
 * @property {number | null} selected
 */

/**
 * @typedef {object} AddContactAction
 * @property {'ADD_CONTACT'} type
 * @property {Contact} payload
 */

/**
 * @typedef {object} DeleteContactAction
 * @property {'DELETE_CONTACT'} type
 * @property {number} payload
 */

/**
 * @typedef {object} ChangeContactAction
 * @property {'CHANGE_CONTACT'} type
 * @property {Contact} payload
 */

/**
 * @typedef {object} SetSelectedContactAction
 * @property {'SET_SELECTED_CONTACT'} type
 * @property {number} payload
 */

/**
 * @typedef {object} SetStatusFilterAction
 * @property {'SET_STATUS_FILTER'} type
 * @property {ContactStatus} payload
 */

/**
 * @typedef {AddContactAction|DeleteContactAction|ChangeContactAction|SetSelectedContactAction|SetStatusFilterAction} AddressBookActions
 */

/**
 * @type {React.Context<[AddressBookState, React.Dispatch<AddressBookActions>]>}
 */
const addressBookContext = createContext([null, null]);

export default addressBookContext;
