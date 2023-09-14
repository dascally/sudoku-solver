import type { LinksFunction, V2_MetaFunction } from '@remix-run/node';

import { useState } from 'react';

import SudokuBoardDisplay, {
  sudokuBoardDisplayLinks,
} from '~/components/SudokuBoardDisplay';

import SudokuBoard from '~/lib/SudokuBoard';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Sudoku Solver' },
    { name: 'description', content: 'A sudoku solver web app.' },
  ];
};

export const links: LinksFunction = () => {
  return [...sudokuBoardDisplayLinks()];
};

export default function Index() {
  const [board, setBoard] = useState(new SudokuBoard());

  return (
    <>
      <h1>Sudoku Solver</h1>
      <p>
        Enter a sudoku problem below and then click <b>Solve</b> to solve.
      </p>
      <form className='SudokuInputForm' name='sudoku-input' action='/solution'>
        <SudokuBoardDisplay board={board} size='large' setBoard={setBoard} />
        <button type='submit' className='Button'>
          Solve
        </button>
      </form>
    </>
  );
}
