// @ts-check

import Button from 'components/shared/Button';
import React from 'react';

/**
 * @typedef {import('contexts/addressBook').ContactStatus} ContactStatus
 * @typedef {object} Props
 * @property {ContactStatus} status
 * @property {(status: ContactStatus) => void} onChange
 */

/**
 * @type {React.FC<Props>}
 */
const StatusFilter = ({ status, onChange }) => {
  return (
    <div className="flex">
      <Button size="small" variant={status === 'Work' ? 'success' : 'secondary'} onClick={onChange.bind(null, 'Work')}>
        Work
      </Button>
      <Button
        size="small"
        variant={status === 'Private' ? 'success' : 'secondary'}
        onClick={onChange.bind(null, 'Private')}
      >
        Private
      </Button>
    </div>
  );
};

export default StatusFilter;
