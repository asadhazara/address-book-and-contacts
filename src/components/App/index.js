// @ts-check

import AddressBook from 'components/AddressBook';
import 'components/App/style.scss';
import React, { useEffect, useRef } from 'react';

/**
 * @type {React.FC}
 */
function App() {
  /**
   * @type {React.RefObject<HTMLDivElement>}
   */
  const ref = useRef(null);

  // this locks the height on iOS to stay same when scrolled
  useEffect(() => {
    const handleResize = () => (ref.current.style.height = `${window.innerHeight}px`);

    // initial mount
    handleResize();

    // TODO use throttle
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className="App" ref={ref}>
      <AddressBook />
    </main>
  );
}

export default App;
