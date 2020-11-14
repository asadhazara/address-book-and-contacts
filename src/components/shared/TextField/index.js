// @ts-check
import 'components/shared/TextField/style.scss';
import cn from 'classnames';
import React from 'react';

/**
 * @typedef {object} Props
 * @property {string} label
 * @property {boolean} [hasError]
 */

/**
 * @type {React.FC<React.InputHTMLAttributes<HTMLInputElement> & Props>}
 */
const TextField = ({ id, label, hasError, ...props }) => {
  return (
    <div className="TextField">
      <label className="TextField__Label" htmlFor={id}>
        {label}
      </label>
      <div>
        <input className={cn('TextField__Input', { hasError })} id={id} {...props} />
      </div>
    </div>
  );
};

export default TextField;
