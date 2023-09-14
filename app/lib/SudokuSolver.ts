import SudokuBoard from './SudokuBoard';
import {
  assertIsSudokuValue,
  isSudokuValue,
  type IncompleteSudokuValue,
  type SudokuValue,
} from './SudokuBoard';

type Square = { row: SudokuValue; col: SudokuValue };
type Move = Square & { value: SudokuValue };

function union<T>(...sets: Set<T>[]) {
  const result: Set<T> = new Set();
  for (const set of sets) {
    for (const x of set) result.add(x);
  }
  return result;
}
function difference<T>(A: Set<T>, B: Set<T>) {
  const result = new Set(A);
  for (const x of B) result.delete(x);
  return result;
}

function containsDuplicateInUnit(inputBoard: SudokuBoard) {
  const board = inputBoard.toJSON();

  function getRows(): IncompleteSudokuValue[][] {
    return structuredClone(board);
  }

  function getColumns(): IncompleteSudokuValue[][] {
    const columns = new Array(9);
    for (let i = 0; i < columns.length; i++) {
      columns[i] = [];
    }

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        columns[j].push(board[i][j]);
      }
    }

    return columns;
  }

  function getNonants(): IncompleteSudokuValue[][] {
    const nonants = new Array(9);
    for (let i = 0; i < nonants.length; i++) {
      nonants[i] = [];
    }

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        const nonantIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        nonants[nonantIndex].push(board[i][j]);
      }
    }

    return nonants;
  }

  function containsDuplicates(units: IncompleteSudokuValue[][]): boolean {
    for (const unit of units) {
      unit.sort();
      for (let i = 1; i < unit.length; i++) {
        if (unit[i] !== 0 && unit[i] === unit[i - 1]) return true;
      }
    }
    return false;
  }

  return (
    containsDuplicates(getRows()) ||
    containsDuplicates(getColumns()) ||
    containsDuplicates(getNonants())
  );
}

// Solves a sudoku puzzle. If .getSolvedBoard() returns null, then there is no
// solution.
export default class SudokuSolver {
  private inputBoard: SudokuBoard | null;
  private solvedBoard: SudokuBoard | null;

  public constructor(board: SudokuBoard);
  public constructor(board: number[][]);
  public constructor(board: SudokuBoard | number[][]) {
    if (board instanceof SudokuBoard) {
      this.inputBoard = board.clone();
    } else {
      this.inputBoard = new SudokuBoard(board);
    }

    if (containsDuplicateInUnit(this.inputBoard)) this.inputBoard = null;

    this.solvedBoard =
      this.inputBoard === null ? null : this.solve(this.inputBoard);
  }

  public getInputBoard() {
    return this.inputBoard;
  }
  public getSolvedBoard() {
    return this.solvedBoard;
  }

  private solve(inputBoard: SudokuBoard): SudokuBoard | null {
    let board: SudokuBoard = inputBoard.clone();
    const moves: Move[] = [];
    let isSolved = false;

    // Returns the set of the candidate values for the given square, or return
    // null if the square is already filled.
    function findCandidates(
      row: SudokuValue,
      col: SudokuValue
    ): Set<SudokuValue> | null {
      if (board.getSquare(row, col) !== 0) return null;

      const SUDOKU_UNIVERSE: Set<SudokuValue> = new Set([
        1, 2, 3, 4, 5, 6, 7, 8, 9,
      ]);

      // These sets hold values that are already filled in the same row, column,
      // and "nonant" as the current square.
      const rowValues: Set<SudokuValue> = new Set();
      const colValues: Set<SudokuValue> = new Set();
      // A "nonant" is what I call a quadrant when you have nine of them.
      const nonantValues: Set<SudokuValue> = new Set();

      for (let i = 1; i <= 9; i++) {
        assertIsSudokuValue(i);

        const rowValue = board.getSquare(row, i);
        if (isSudokuValue(rowValue)) rowValues.add(rowValue);

        const colValue = board.getSquare(i, col);
        if (isSudokuValue(colValue)) colValues.add(colValue);
      }

      const nonantRow = Math.floor((row - 1) / 3);
      const nonantCol = Math.floor((col - 1) / 3);

      const startRow = nonantRow * 3 + 1;
      const startCol = nonantCol * 3 + 1;
      for (let i = startRow; i <= startRow + 2; i++) {
        assertIsSudokuValue(i);
        for (let j = startCol; j <= startCol + 2; j++) {
          assertIsSudokuValue(j);
          const nonantValue = board.getSquare(i, j);
          if (isSudokuValue(nonantValue)) nonantValues.add(nonantValue);
        }
      }

      const filledValues = union(rowValues, colValues, nonantValues);
      return difference(SUDOKU_UNIVERSE, filledValues);
    }

    function makeMove(row: SudokuValue, col: SudokuValue, value: SudokuValue) {
      board.setSquare(row, col, value);
      moves.push({ row, col, value });
    }

    function unmakeMove() {
      const lastMove = moves.pop();
      if (!lastMove)
        throw new Error(
          'Attempting to unmake a move, but no moves have been made yet.'
        );
      board.setSquare(lastMove.row, lastMove.col, 0);
    }

    // Return the next square (one with the fewest candidates) and its
    // candidates set as a pair. If all squares are filled, then return
    // [null, null]. If the candidates set is empty, then the current board
    // is invalid and we need to backtrack.
    function chooseNextSquare(): [Square | null, Set<SudokuValue> | null] {
      let nextSquare: Square | null = null;
      let nextSquareCandidates = null;

      for (let i = 1; i <= 9; i++) {
        for (let j = 1; j <= 9; j++) {
          assertIsSudokuValue(i);
          assertIsSudokuValue(j);

          const currentSquare: Square = { row: i, col: j };
          const currentSquareCandidates = findCandidates(i, j);

          // Skip to the next square if this one is already filled.
          if (currentSquareCandidates == null) continue;

          // Backtrack if we find an empty square with no candidates.
          if (currentSquareCandidates.size == 0)
            return [currentSquare, currentSquareCandidates];

          if (
            nextSquareCandidates == null ||
            currentSquareCandidates.size < nextSquareCandidates.size
          ) {
            nextSquareCandidates = currentSquareCandidates;
            nextSquare = currentSquare;
          }
        }
      }

      return [nextSquare, nextSquareCandidates];
    }

    function dfs() {
      // Choose the next square (one with the fewest candidates).
      const [nextSquare, nextSquareCandidates] = chooseNextSquare();

      // Did we find a solution?
      if (nextSquare == null || nextSquareCandidates == null) {
        isSolved = true;
        return;
      }

      // Backtrack if we find an empty square with no candidates.
      if (nextSquareCandidates.size == 0) return;

      // Try all the candidates for the next square.
      for (const candidate of nextSquareCandidates) {
        makeMove(nextSquare.row, nextSquare.col, candidate);
        dfs();
        if (isSolved) return;
        unmakeMove();
      }

      // No solution if we reach here.
    }

    dfs();
    return isSolved ? board : null;
  }
}
