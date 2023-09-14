import { forwardRef, useEffect, useState } from 'react';

import SudokuBoard from '~/lib/SudokuBoard';

import SudokuBoardDisplay from './SudokuBoardDisplay';

import styles from '~/styles/HistoryPanel.css';
import { Link } from '@remix-run/react';

export function historyPanelLinks() {
  return [{ rel: 'stylesheet', href: styles }];
}

type Props = {
  id?: string;
  // setIsHistoryOpen: (open: boolean) => void;
};

const HistoryPanel = forwardRef<HTMLDialogElement, Props>(function HistoryPanel(
  { id },
  ref
) {
  id = id ?? 'HistoryPanel';
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setHistory(JSON.parse(window.localStorage.getItem('history') ?? '[]'));
  }, []);

  useEffect(() => {
    function handleStorage(evt: StorageEvent) {
      if (evt.key === 'history') setHistory(JSON.parse(evt.newValue ?? '[]'));
    }

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  function handleClearHistoryClick() {
    window.localStorage.removeItem('history');
    setHistory([]);
  }
  function handleCloseHistoryClick() {
    if (ref === null || typeof ref === 'function')
      throw new Error('Error accessing HistoryPanel ref.');
    ref.current?.close();
  }

  return (
    <dialog
      ref={ref}
      id={id}
      className='HistoryPanel'
      aria-modal='true'
      aria-labelledby='historyPanelTitle'
      onClick={(evt) => {
        if (evt.target === evt.currentTarget) evt.currentTarget.close();
      }}
    >
      <div className='HistoryPanel__paddingWrapper'>
        <div className='HistoryPanel__controls'>
          <h2 id='historyPanelTitle'>History</h2>
          <button className='Button' onClick={handleClearHistoryClick}>
            <span
              className='fa-solid fa-broom fa-lg'
              title='Clear History'
              aria-label='Clear History'
            ></span>
          </button>
          <button
            className='Button'
            style={{ padding: '0.5rem 0.6rem 0.33rem' }}
            onClick={handleCloseHistoryClick}
            autoFocus={true}
          >
            <span
              className='fa-solid fa-xmark fa-xl'
              title='Close History Panel'
              aria-label='Close History Panel'
            ></span>
          </button>
        </div>
        <nav className='HistoryPanel__list'>
          {history
            .map((inputBoard, index) => {
              const parsedBoard = JSON.parse(inputBoard);
              const urlSearchParams = new URLSearchParams();
              for (let i = 0; i < parsedBoard.length; i++) {
                const row = 'A'.charCodeAt(0) + i;
                for (let j = 0; j < parsedBoard[i].length; j++) {
                  const col = 1 + j;
                  const squareCoords = String.fromCharCode(row) + col;
                  const squareValue =
                    parsedBoard[i][j] === 0 ? '' : parsedBoard[i][j];
                  urlSearchParams.append(squareCoords, squareValue);
                }
              }

              try {
                return (
                  <Link
                    to={`/solution?${urlSearchParams}`}
                    key={inputBoard}
                    // tabIndex={index === 0 ? 0 : -1}
                    className='HistoryPanel__link'
                    onClick={() => {
                      if (ref === null || typeof ref === 'function')
                        throw new Error('Error accessing HistoryPanel ref.');
                      ref.current?.close();
                    }}
                    // onKeyDown={(evt) => {
                    //   switch (evt.key) {
                    //     case 'ArrowUp': {
                    //       const currentElt = evt.currentTarget;
                    //       const prevElt = currentElt.previousElementSibling;

                    //       if (prevElt instanceof HTMLElement) {
                    //         currentElt.tabIndex = -1;
                    //         prevElt.tabIndex = 0;
                    //         prevElt.focus();
                    //       }

                    //       break;
                    //     }
                    //     case 'ArrowDown': {
                    //       const currentElt = evt.currentTarget;
                    //       const nextElt = currentElt.nextElementSibling;

                    //       if (nextElt instanceof HTMLElement) {
                    //         currentElt.tabIndex = -1;
                    //         nextElt.tabIndex = 0;
                    //         nextElt.focus();
                    //       }
                    //       break;
                    //     }
                    //     default: {
                    //       break;
                    //     }
                    //   }
                    // }}
                  >
                    <SudokuBoardDisplay
                      board={new SudokuBoard(JSON.parse(inputBoard))}
                      size='small'
                    />
                  </Link>
                );
              } catch (err) {
                console.error(err);
                return null;
              }
            })
            .filter((board) => board !== null)}
        </nav>
      </div>
    </dialog>
  );
});

export default HistoryPanel;
