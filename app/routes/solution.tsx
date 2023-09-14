import type {
  LinksFunction,
  LoaderArgs,
  V2_MetaFunction,
} from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';

import type { IncompleteSudokuValue } from '~/lib/SudokuBoard';
import SudokuBoard, { assertIsIncompleteSudokuValue } from '~/lib/SudokuBoard';
import SudokuSolver from '~/lib/SudokuSolver';

import SudokuBoardDisplay, {
  sudokuBoardDisplayLinks,
} from '~/components/SudokuBoardDisplay';

function coordsToBoardIndex(coords: string): [number, number] {
  coords = coords.toUpperCase();
  const coordsRow = coords.charAt(0);
  const coordsCol = coords.charAt(1);

  if (
    coords.length !== 2 ||
    coordsRow < 'A' ||
    coordsRow > 'Z' ||
    coordsCol < '0' ||
    coordsCol > '9'
  ) {
    throw new Error(
      'Sudoku coords must be in letter-number format, e.g. A6 or I7.\n' +
        `Received: \`${coords}\``
    );
  }

  // Remember that sudoku coords are 1-indexed, not 0-
  const indexRow = coordsRow.charCodeAt(0) - 'A'.charCodeAt(0);
  const indexCol = Number.parseInt(coordsCol) - 1;

  return [indexRow, indexCol];
}

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);

  // Initialize an empty board.
  const inputBoard: IncompleteSudokuValue[][] = new Array(9);
  for (let i = 0; i < 9; i++) inputBoard[i] = new Array(9).fill(0);

  for (const [coords, rawValue] of url.searchParams) {
    const [row, col] = coordsToBoardIndex(coords);

    if (!(rawValue === '' || (rawValue >= '1' && rawValue <= '9'))) {
      throw new Error(
        'Sudoku squares must have values between 1 and 9 or be empty.\n' +
          `Received: \`${rawValue}\``
      );
    }

    const cookedValue = rawValue === '' ? 0 : Number.parseInt(rawValue);
    assertIsIncompleteSudokuValue(cookedValue);

    inputBoard[row][col] = cookedValue;
  }

  const sudokuSolver = new SudokuSolver(inputBoard);
  const solvedBoard = sudokuSolver.getSolvedBoard();

  return json({ inputBoard, solvedBoard });
}

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Solved Sudoku Puzzle' }];
};

export const links: LinksFunction = () => {
  return [...sudokuBoardDisplayLinks()];
};

export default function Solution() {
  const data = useLoaderData<typeof loader>();
  const inputBoardArray = data.inputBoard;
  const solvedBoardArray = data.solvedBoard;

  // Add input board as entry to localStorage, or move to front of list if
  // already in history.
  useEffect(() => {
    const storage = window.localStorage;
    const serializedHistory = storage.getItem('history');

    let history: string[];
    if (!serializedHistory) history = [];
    else history = JSON.parse(serializedHistory);

    const historyIndex = history.findIndex(
      (sudokuBoard) => sudokuBoard === JSON.stringify(inputBoardArray)
    );
    if (historyIndex !== -1) {
      history.splice(historyIndex, 1);
    }

    history.unshift(JSON.stringify(inputBoardArray));

    storage.setItem('history', JSON.stringify(history));

    // Dispatch a synthetic storage event so the HistoryPanel will update.
    // (storage.setItem() will dispatch native storage events on other windows
    // with the same origin, but not on the current window.)
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'history',
        oldValue: serializedHistory,
        newValue: JSON.stringify(history),
        url: window.location.toString(),
        storageArea: window.localStorage,
      })
    );
  }, [inputBoardArray]);

  const inputBoard = new SudokuBoard(inputBoardArray);
  const displayBoard =
    solvedBoardArray === null ? inputBoard : new SudokuBoard(solvedBoardArray);

  return (
    <>
      <h1>Solved Sudoku Puzzle</h1>
      <p>The faded squares are the original puzzle.</p>
      {solvedBoardArray === null ? (
        <p>
          <span className='fa-solid fa-triangle-exclamation fa-sm'></span>{' '}
          <strong>This sudoku puzzle has no solution.</strong>
        </p>
      ) : null}
      <SudokuBoardDisplay
        board={displayBoard}
        size='large'
        originalBoard={inputBoard}
        className='u-mx-auto'
      />
    </>
  );
}
