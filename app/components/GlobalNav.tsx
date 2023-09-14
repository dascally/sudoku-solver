import { useRef } from 'react';
import { Link } from '@remix-run/react';

import HistoryPanel, { historyPanelLinks } from './HistoryPanel';

import styles from '~/styles/GlobalNav.css';

export function globalNavLinks() {
  return [{ rel: 'stylesheet', href: styles }, ...historyPanelLinks()];
}

export default function GlobalNav() {
  const historyPanelRef = useRef<HTMLDialogElement>(null);
  const historyPanelID = 'HistoryPanel';

  return (
    <>
      <nav className='GlobalNav'>
        <ul>
          <li>
            <button
              className='Button'
              onClick={() => {
                historyPanelRef.current?.showModal();
              }}
              aria-controls={historyPanelID}
              aria-expanded={historyPanelRef.current?.open}
            >
              <span
                className='fa-solid fa-clock-rotate-left fa-lg'
                title='History'
                aria-label='History'
              ></span>
            </button>
          </li>
          <li>
            <Link to='/' className='Button'>
              Enter a new puzzle
            </Link>
          </li>
        </ul>
      </nav>
      <HistoryPanel id={historyPanelID} ref={historyPanelRef} />
    </>
  );
}
