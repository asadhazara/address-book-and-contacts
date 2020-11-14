// @ts-check

import 'components/shared/Modal/style.scss';
import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import trapFocus from 'utils/trapFocus';

/**
 * @type {{ IN: 'in', OUT: 'out' }}
 */
const FADE = {
  IN: 'in',
  OUT: 'out',
};

/**
 * @typedef {() => void} OnCloseHandler
 * @typedef {Object} Props
 * @property {(onClose: OnCloseHandler) => JSX.Element} children
 * @property {OnCloseHandler} onClose
 */

/**
 * @type {React.FC<Props>}
 */
const Modal = ({ onClose, children }) => {
  const [fade, setFade] = useState(null);

  const handleOnTransitionEnd = useCallback(
    /**
     * @param {React.TransitionEvent<HTMLDivElement>} event
     */
    event => event.propertyName === 'opacity' && fade === FADE.OUT && onClose(),
    [fade, onClose]
  );

  const handleOnClose = useCallback(() => setFade(FADE.OUT), []);

  useEffect(() => {
    const timeout = setTimeout(() => setFade(FADE.IN), 50);

    return () => clearTimeout(timeout);
  }, []);

  return createPortal(
    <div
      className={cn('Modal', { fadeIn: fade === FADE.IN, fadeOut: fade === FADE.OUT })}
      onTransitionEnd={handleOnTransitionEnd}
      aria-label="Dialog"
    >
      <ModalContainer onClose={handleOnClose}>{children(handleOnClose)}</ModalContainer>
    </div>,
    document.body
  );
};

Modal.propTypes = {
  children: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

/**
 * @type {React.FC<React.PropsWithChildren<Pick<Props, 'onClose'>>>}
 */
const ModalContainer = ({ onClose, children }) => {
  /**
   * @type {React.RefObject<HTMLDivElement>}
   */
  const ref = useRef(null);

  // trap tab focus on modal
  useEffect(() => trapFocus(ref.current).release, []);

  // disable scrolling on body
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => void (document.body.style.overflow = '');
  }, []);

  return (
    <div className="Modal__Container" ref={ref}>
      <div className="Modal__Overlay" onClick={onClose} aria-hidden />
      <div className="Modal__Content">{children}</div>
    </div>
  );
};

ModalContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  onClose: PropTypes.func.isRequired,
};

/**
 * @type {React.FC<{ children: React.ReactNode }>}
 */
const ModalHeader = ({ children }) => {
  return <div className="Modal__Header">{children}</div>;
};

/**
 * @type {React.FC<{ children: React.ReactNode }>}
 */
const ModalFooter = ({ children }) => {
  return <div className="Modal__Footer">{children}</div>;
};

/**
 * @type {React.FC<{ children: React.ReactNode }>}
 */
const ModalBody = ({ children }) => {
  return (
    <div className="Modal__Body">
      <div>{children}</div>
    </div>
  );
};

export default Object.assign(memo(Modal), {
  Header: memo(ModalHeader),
  Footer: memo(ModalFooter),
  Body: memo(ModalBody),
});
