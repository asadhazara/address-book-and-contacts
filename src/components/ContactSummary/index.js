// @ts-check
import 'components/ContactSummary/style.scss';
import React from 'react';

/**
 * @typedef {object} Props
 * @property {import('contexts/addressBook').Contact} contact
 */

/**
 * @type {React.FC<Props>}
 */
const ContactSummary = ({ contact }) => {
  return (
    <div className="ContactSummary">
      <ul className="ContactSummary__List">
        {['status', 'name', 'email', 'phone'].map(field => (
          <li className="ContactSummary__Item" key={field}>
            <div className="ContactSummary__Label">{field}</div>
            <div className="ContactSummary__Value">{contact[field]}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactSummary;
