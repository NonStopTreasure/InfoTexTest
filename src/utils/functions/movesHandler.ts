import { ICells, IPosition } from '@interfaces/index';
import { blackSide, columns, positions, rows, whiteSide } from '../vars';
import { positiveMovesHandler } from './positiveMovesHandler';

export const movesHandler = (
  codeMove: string,
  positiveMoves: string[],
  cells: ICells[],
  focusedPosition: string,
  selectedStartPos: IPosition | null,
  selectedEndPos: IPosition | null,
  turn: boolean,
  changeCodeMove: (newCodeMove: string) => void,
  changeTurn: () => void,
  changeFocusedPosition: (newFocusedPosition: string) => void,
  changeSelectedStartPos: (newStartPos: IPosition | null) => void,
  changeSelectedEndPos: (newEndPos: IPosition | null) => void,
  changeMainMessage: (newMessage: string) => void,
  reverseBoard: () => void,
  changeCells: (newCells: ICells[]) => void,
  changePositiveMoves: (newPositiveMoves: string[]) => void,
  reRenderBoard: () => void
) => {
  const selectedCell = cells.find(
    (cell) => cell.position.row + cell.position.col === focusedPosition
  );
  const colIndex = columns.findIndex(
    (col) => col === selectedCell?.position.col
  );
  const rowIndex = rows.findIndex((row) => row === selectedCell?.position.row);
  if (codeMove === 'Enter' && selectedCell) {
    if (!selectedStartPos && selectedCell && selectedCell.figure) {
      if (
        (whiteSide.some(
          (value) => value === selectedCell?.figure?.figureType
        ) &&
          turn) ||
        (blackSide.some(
          (value) => value === selectedCell?.figure?.figureType
        ) &&
          !turn)
      ) {
        return;
      }
      changeCodeMove('');
      changePositiveMoves(positiveMovesHandler(selectedCell, false, cells));
      changeSelectedStartPos(selectedCell.position);
      changeMainMessage('Choose a destination for figure');
      return;
    }
    if (selectedStartPos && !selectedEndPos && selectedCell) {
      changeSelectedEndPos(selectedCell.position);
      const startCellPos = cells.find(
        (cell) => cell.position === selectedStartPos
      )?.position;
      const startCellFig = cells.find(
        (cell) => cell.position === selectedStartPos
      )?.figure;
      if (
        positiveMoves.every((move) => {
          return move !== selectedCell.position.row + selectedCell.position.col;
        })
      ) {
        changeMainMessage('You cant choose this cell. Choose another');
        changeSelectedEndPos(null);
      } else {
        const newCells = cells.map((cell) => {
          const newCell = cell;
          if (cell.position === startCellPos) {
            newCell.figure = null;
          }
          if (startCellFig && cell.position === selectedCell?.position) {
            startCellFig.isMoved = true;
            startCellFig.figurePosition = newCell.position;
            newCell.figure = startCellFig;
          }
          return newCell;
        });
        changeTurn();
        reverseBoard();
        changeFocusedPosition('c3');
        changeMainMessage('Choose figure');
        changeCells(newCells.reverse());
        changeSelectedStartPos(null);
        changeSelectedEndPos(null);
        changePositiveMoves([]);
      }
    }
  }
  if (codeMove === 'ArrowUp') {
    if (turn ? rowIndex >= 4 : rowIndex <= 0) {
      return;
    }
    const newPosition = positions[turn ? rowIndex + 1 : rowIndex - 1][colIndex];
    changeFocusedPosition(newPosition);
  }
  if (codeMove === 'ArrowRight') {
    if (turn ? colIndex <= 0 : colIndex >= 4) {
      return;
    }
    const newPosition = positions[rowIndex][turn ? colIndex - 1 : colIndex + 1];
    changeFocusedPosition(newPosition);
  }
  if (codeMove === 'ArrowDown') {
    if (turn ? rowIndex <= 0 : rowIndex >= 4) {
      return;
    }
    const newPosition = positions[turn ? rowIndex - 1 : rowIndex + 1][colIndex];
    changeFocusedPosition(newPosition);
  }
  if (codeMove === 'ArrowLeft') {
    if (turn ? colIndex >= 4 : colIndex <= 0) {
      return;
    }
    const newPosition = positions[rowIndex][turn ? colIndex + 1 : colIndex - 1];
    changeFocusedPosition(newPosition);
  }
  changeCodeMove('');
  reRenderBoard();
};
