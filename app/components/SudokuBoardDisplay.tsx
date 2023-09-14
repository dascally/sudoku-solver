import { useState } from 'react';
import type SudokuBoard from '~/lib/SudokuBoard';
import {
  assertIsSudokuValue,
  isIncompleteSudokuValue,
} from '~/lib/SudokuBoard';

import styles from '~/styles/SudokuBoardDisplay.css';

type Props = {
  board: SudokuBoard;
  size: 'large' | 'small';
  setBoard?: (board: SudokuBoard) => void;
  originalBoard?: SudokuBoard;
  className?: string;
};

export function sudokuBoardDisplayLinks() {
  return [{ rel: 'stylesheet', href: styles }];
}

function numericToStandardCoords(row: number, col: number) {
  return String.fromCharCode('A'.charCodeAt(0) - 1 + row) + col;
}

export default function SudokuBoardDisplay({
  board,
  size,
  setBoard,
  originalBoard,
  className = '',
}: Props) {
  const [focusedSquare, setFocusedSquare] = useState('A1');

  function focusSquare(row: number, col: number) {
    const newCoords = numericToStandardCoords(row, col);
    const elt = document.querySelector(`input[name="${newCoords}"]`);
    if (elt instanceof HTMLElement) {
      setFocusedSquare(newCoords);
      elt.focus();
    }
  }

  return (
    <div
      role='grid'
      aria-label='Sudoku grid'
      className={`SudokuBoardDisplay SudokuBoardDisplay--${size} ${className}`}
    >
      {new Array(81).fill(null).map((_, i) => {
        const row = Math.floor(i / 9) + 1;
        const col = (i % 9) + 1;

        assertIsSudokuValue(row);
        assertIsSudokuValue(col);

        const name = numericToStandardCoords(row, col);
        let value = board.getSquare(row, col);

        if (setBoard) {
          return (
            <div
              key={name}
              role='gridcell'
              className='SudokuBoardDisplay__outerSquare SudokuBoardDisplay__outerSquare--input'
            >
              <input
                name={name}
                aria-label={'Sudoku square ' + name}
                tabIndex={name === focusedSquare ? 0 : -1}
                className='SudokuBoardDisplay__innerSquare'
                type='text'
                inputMode='numeric'
                value={value == 0 ? '' : String(value)}
                onChange={(evt) => {
                  let newValue;
                  if (evt.currentTarget.value == '') {
                    newValue = 0;
                  } else {
                    newValue = Number.parseInt(evt.currentTarget.value);
                  }
                  if (!isIncompleteSudokuValue(newValue)) return;

                  const newBoard = board.clone();
                  newBoard.setSquare(row, col, newValue);
                  setBoard(newBoard);
                }}
                onKeyDown={(evt) => {
                  switch (evt.key) {
                    case 'ArrowUp': {
                      focusSquare(((row + 7) % 9) + 1, col);
                      break;
                    }
                    case 'ArrowRight': {
                      focusSquare(row, ((col + 9) % 9) + 1);
                      break;
                    }
                    case 'ArrowDown': {
                      focusSquare(((row + 9) % 9) + 1, col);
                      break;
                    }
                    case 'ArrowLeft': {
                      focusSquare(row, ((col + 7) % 9) + 1);
                      break;
                    }
                    default: {
                      let newValue;
                      if (evt.key == '') {
                        newValue = 0;
                      } else {
                        newValue = Number.parseInt(evt.key);
                      }
                      if (!isIncompleteSudokuValue(newValue)) return;

                      const newBoard = board.clone();
                      newBoard.setSquare(row, col, newValue);
                      setBoard(newBoard);
                      break;
                    }
                  }
                }}
                autoComplete='off'
              />
            </div>
          );
        } else {
          return (
            <div key={name} className={'SudokuBoardDisplay__outerSquare'}>
              <div
                aria-label={'Sudoku square ' + name}
                className={
                  'SudokuBoardDisplay__innerSquare' +
                  (originalBoard?.getSquare(row, col) !== 0
                    ? ' SudokuBoardDisplay__innerSquare--faded'
                    : '')
                }
              >
                {value == 0 ? '' : String(value)}
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
