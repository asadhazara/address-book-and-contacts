// @ts-check
import 'components/shared/Button/style.scss';
import cn from 'classnames';
import React from 'react';

/**
 * @typedef {object} Props
 * @property {'primary'|'secondary'|'success'} [variant]
 * @property {'default'|'small'|'large'} [size]
 */

/**
 * @type {React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & Props>}
 */
const Button = ({ className, variant, size = 'default', ...props }) => {
  return (
    <button
      className={cn('Button', className, {
        ['Button--' + size]: ['small', 'large'].includes(size),
        ['Button--' + variant]: variant,
      })}
      {...props}
    />
  );
};

export default Button;
