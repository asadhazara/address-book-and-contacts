// @ts-check
import ContactSummary from 'components/ContactSummary';
import StatusFilter from 'components/StatusFilter';
import Button from 'components/shared/Button';
import Modal from 'components/shared/Modal';
import TextField from 'components/shared/TextField';
import useAddressBook from 'hooks/useAddressBook';
import { ReactComponent as EditIcon } from 'icons/edit.svg';
import { ReactComponent as TrashIcon } from 'icons/trash.svg';
import { ReactComponent as CrossIcon } from 'icons/x.svg';
import React, { useCallback, useMemo, useState } from 'react';

// validation patterns
const PATTERNS = {
  // matches at least one non-space character.
  NOT_EMPTY: /^(?!\s*$).+/,
  // matches emails
  EMAIL: /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  PHONE: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\\./0-9]*$/,
};

const validationSchema = {
  name: [{ pattern: PATTERNS.NOT_EMPTY, message: 'This field cannot be empty.' }],
  phone: [
    { pattern: PATTERNS.NOT_EMPTY, message: 'This field cannot be empty.' },
    { pattern: PATTERNS.PHONE, message: 'This field must be a correct phone number.' },
  ],
  email: [
    { pattern: PATTERNS.NOT_EMPTY, message: 'This field cannot be empty.' },
    { pattern: PATTERNS.EMAIL, message: 'This must be a correct email address.' },
  ],
};

/**
 * @type {React.FC}
 */
const ContactDialog = () => {
  const [{ selected, contacts, filters }, dispatch] = useAddressBook();
  const selectedContact = useMemo(() => contacts.find(contact => contact.id === selected), [contacts, selected]);
  const [form, setForm] = useState(
    selectedContact
      ? {
          ...selectedContact,
          isEditing: false,
          errors: {},
        }
      : {
          id: selected,
          status: filters.status,
          name: '',
          email: '',
          phone: '',
          isEditing: true,
          errors: {},
        }
  );

  const handleOnClose = useCallback(
    () =>
      dispatch({
        type: 'SET_SELECTED_CONTACT',
        payload: null,
      }),
    [dispatch]
  );

  const handleOnDelete = useCallback(
    /**
     * @param {() => void} onClose
     */
    onClose => {
      onClose();
      dispatch({
        type: 'DELETE_CONTACT',
        payload: selected,
      });
    },
    [dispatch, selected]
  );

  const handleOnChange = useCallback(
    /**
     * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>} event
     */
    event =>
      setForm(prev => {
        const newForm = {
          ...prev,
          errors: { ...prev.errors },
        };

        newForm[event.target.name] = event.target.value;

        delete newForm.errors[event.target.name];

        return newForm;
      }),
    []
  );

  const handleOnStatusChange = useCallback(
    /**
     * @param {import('contexts/addressBook').ContactStatus} status
     */
    status => setForm(prev => ({ ...prev, status })),
    []
  );

  const handleOnValidateForm = useCallback(
    /**
     * @returns {Record<string, string>}
     */
    () =>
      Object.entries(validationSchema).reduce((acc, [key, value]) => {
        let error;

        if (!acc[key]) error = value.find(({ pattern }) => !pattern.test(form[key]));
        if (error) acc[key] = error.message;

        return acc;
      }, {}),
    [form]
  );

  const handleOnSave = useCallback(
    /**
     * @param {() => void} onClose
     */
    onClose => {
      const validationErrors = handleOnValidateForm();

      if (Object.keys(validationErrors).length > 0) {
        setForm(prev => ({ ...prev, errors: validationErrors }));
        return;
      }

      if (selectedContact) setForm(prev => ({ ...prev, isEditing: false }));
      else onClose();

      const newContact = { ...form, errors: { ...form.errors } };

      delete newContact.isEditing;
      delete newContact.errors;

      setForm(prev => ({ ...prev, isEditing: false }));
      dispatch({
        type: selectedContact ? 'CHANGE_CONTACT' : 'ADD_CONTACT',
        payload: newContact,
      });
    },
    [form, dispatch, selectedContact, handleOnValidateForm]
  );

  const handleOnCancel = useCallback(
    () =>
      setForm({
        ...selectedContact,
        isEditing: false,
        errors: {},
      }),
    [selectedContact]
  );

  const handleOnStartEditing = useCallback(
    () =>
      setForm(prev => ({
        ...prev,
        isEditing: true,
      })),
    []
  );

  return (
    <Modal onClose={handleOnClose}>
      {onClose => (
        <React.Fragment>
          <Modal.Header>
            <p className="truncate">
              <span>{form.name || 'Name'}</span>
              <span> — </span>
              <span>{form.status}</span>
            </p>
            <div className="ml-auto flex">
              {!form.isEditing ? (
                <React.Fragment>
                  {selectedContact && (
                    <Button
                      aria-label="Delete Contact"
                      className="flex"
                      size="small"
                      onClick={handleOnDelete.bind(null, onClose)}
                    >
                      <TrashIcon aria-hidden width="16" height="16" />
                    </Button>
                  )}
                  <Button aria-label="Edit Contact" className="flex" size="small" onClick={handleOnStartEditing}>
                    <EditIcon aria-hidden width="16" height="16" />
                  </Button>
                  <Button aria-label="Close Dialog" className="flex" size="small" onClick={onClose}>
                    <CrossIcon aria-hidden width="16" height="16" />
                  </Button>
                </React.Fragment>
              ) : (
                <StatusFilter status={form.status} onChange={handleOnStatusChange} />
              )}
            </div>
          </Modal.Header>
          <Modal.Body>
            {form.isEditing ? (
              <React.Fragment>
                <TextField
                  id="name"
                  name="name"
                  label="Name"
                  value={form.name}
                  hasError={!!form.errors.name}
                  type="text"
                  placeholder="John Smith"
                  onChange={handleOnChange}
                />
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  value={form.email}
                  hasError={!!form.errors.email}
                  type="text"
                  placeholder="john@email.com"
                  onChange={handleOnChange}
                />
                <TextField
                  id="phone"
                  name="phone"
                  label="Phone"
                  value={form.phone}
                  hasError={!!form.errors.phone}
                  type="text"
                  placeholder="+31623121345"
                  onChange={handleOnChange}
                />
              </React.Fragment>
            ) : (
              <ContactSummary contact={form} />
            )}
            {Object.keys(form.errors).length > 0 && (
              <div className="text-danger">Please verify if all fields are filled correctly.</div>
            )}
          </Modal.Body>
          {form.isEditing && (
            <Modal.Footer>
              <Button className="ml-auto" onClick={selectedContact ? handleOnCancel : onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleOnSave.bind(null, onClose)}>
                Save
              </Button>
            </Modal.Footer>
          )}
        </React.Fragment>
      )}
    </Modal>
  );
};

export default ContactDialog;
