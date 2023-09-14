export type SudokuValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type IncompleteSudokuValue = SudokuValue | 0;

export function assertIsIncompleteSudokuValue(
  value: unknown
): asserts value is IncompleteSudokuValue {
  if (typeof value !== 'number')
    throw new TypeError(`${value} is expected to be an IncompleteSudokuValue.`);
  if (value < 0 || value > 9)
    throw new RangeError(
      `IncompleteSudokuValue is out of range. Value is: ${value}`
    );
}

export function assertIsSudokuValue(
  value: unknown
): asserts value is SudokuValue {
  if (typeof value !== 'number')
    throw new TypeError(`${value} is expected to be a SudokuValue.`);
  if (value < 1 || value > 9)
    throw new RangeError(`SudokuValue is out of range. Value is: ${value}`);
}

export function isIncompleteSudokuValue(
  value: unknown
): value is IncompleteSudokuValue {
  return typeof value === 'number' && value >= 0 && value <= 9;
}

export function isSudokuValue(value: unknown): value is SudokuValue {
  return typeof value === 'number' && value >= 1 && value <= 9;
}

export default class SudokuBoard {
  private board: Int8Array;

  public constructor();
  public constructor(board: number[][]);
  public constructor(board: SudokuBoard);
  public constructor(board?: number[][] | SudokuBoard) {
    if (Array.isArray(board)) {
      if (board.length != 9 || board.some((row) => row.length != 9)) {
        throw new TypeError('A new sudoku board must by 9x9.');
      }

      this.board = new Int8Array(board.flat());
    } else if (board instanceof SudokuBoard) {
      this.board = new Int8Array(board.board);
    } else {
      this.board = new Int8Array(81);
      this.board.fill(0);
    }

    for (const value of this.board) {
      assertIsIncompleteSudokuValue(value);
    }
  }

  public getSquare(row: SudokuValue, col: SudokuValue) {
    const val = this.board[(row - 1) * 9 + (col - 1)];
    assertIsIncompleteSudokuValue(val);
    return val;
  }

  public setSquare(
    row: SudokuValue,
    col: SudokuValue,
    val: IncompleteSudokuValue
  ) {
    this.board[(row - 1) * 9 + (col - 1)] = val;
  }

  public clone() {
    return new SudokuBoard(this);
  }

  public toJSON() {
    const boardAsArray: Array<Array<IncompleteSudokuValue>> = new Array(9);

    for (let i = 1; i <= 9; i++) {
      assertIsSudokuValue(i);

      boardAsArray[i - 1] = new Array(9);
      for (let j = 1; j <= 9; j++) {
        assertIsSudokuValue(j);

        boardAsArray[i - 1][j - 1] = this.getSquare(i, j);
      }
    }

    return boardAsArray;
  }
}
