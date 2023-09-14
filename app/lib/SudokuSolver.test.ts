import { expect, test } from 'vitest';
import SudokuSolver from './SudokuSolver';

test('correctly solves a simple sudoku puzzle that requires no backtracking', () => {
  const inputBoard = [
    [0, 3, 0, 2, 0, 8, 4, 5, 0],
    [5, 0, 0, 0, 0, 0, 0, 8, 0],
    [0, 0, 8, 6, 3, 0, 0, 0, 0],
    [0, 0, 0, 0, 7, 4, 0, 0, 5],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 0, 0],
    [7, 0, 4, 0, 1, 0, 0, 0, 6],
    [6, 0, 0, 0, 0, 0, 0, 0, 2],
    [8, 0, 2, 7, 0, 0, 0, 3, 0],
  ];

  const solution = [
    [1, 3, 6, 2, 9, 8, 4, 5, 7],
    [5, 2, 9, 1, 4, 7, 6, 8, 3],
    [4, 7, 8, 6, 3, 5, 9, 2, 1],
    [2, 8, 1, 9, 7, 4, 3, 6, 5],
    [3, 6, 5, 8, 2, 1, 7, 4, 9],
    [9, 4, 7, 5, 6, 3, 2, 1, 8],
    [7, 5, 4, 3, 1, 2, 8, 9, 6],
    [6, 1, 3, 4, 8, 9, 5, 7, 2],
    [8, 9, 2, 7, 5, 6, 1, 3, 4],
  ];

  const sudokuSolver = new SudokuSolver(inputBoard);
  const solvedBoard = sudokuSolver.getSolvedBoard();

  expect(JSON.stringify(solvedBoard)).toBe(JSON.stringify(solution));
});

test('returns null for an unsolvable puzzle without duplicate numbers in input', () => {
  const inputBoard = [
    [0, 3, 0, 2, 0, 8, 4, 5, 0],
    [5, 7, 0, 0, 0, 0, 0, 8, 0],
    [0, 0, 8, 6, 3, 0, 0, 0, 0],
    [0, 0, 0, 0, 7, 4, 0, 0, 5],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 0, 0],
    [7, 0, 4, 0, 1, 0, 0, 0, 6],
    [6, 0, 0, 0, 0, 0, 0, 0, 2],
    [8, 0, 2, 7, 0, 0, 0, 3, 0],
  ];

  const sudokuSolver = new SudokuSolver(inputBoard);
  const solvedBoard = sudokuSolver.getSolvedBoard();

  expect(solvedBoard).toBeNull();
});

test('returns null for an unsolvable puzzle with duplicate numbers in input', () => {
  const inputBoard = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const sudokuSolver = new SudokuSolver(inputBoard);
  const solvedBoard = sudokuSolver.getSolvedBoard();

  expect(solvedBoard).toBeNull();
});
