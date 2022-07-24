import { ICells } from '@interfaces/index';
import { FigureTypes } from '@enums/index';
import { blackSide, columns, positions, rows, whiteSide } from '../vars';

export const positiveMovesHandler = (
  selectedCell: ICells,
  isCheck: boolean,
  cells: ICells[],
  setNewPositiveMoves: (newPositiveMoves: string[]) => void
): string[] => {
  const rowIndex = rows.findIndex((row) => row === selectedCell?.position.row);
  const colIndex = columns.findIndex(
    (col) => col === selectedCell?.position.col
  );

  if (whiteSide.some((type) => type === selectedCell?.figure?.figureType)) {
    if (selectedCell.figure?.figureType === FigureTypes.WhiteKing) {
      const allPositivePositions = positions
        .filter(
          (pos, i) => i === rowIndex + 1 || i === rowIndex - 1 || i === rowIndex
        )
        .flatMap((pos) =>
          pos.filter(
            (_s, j) =>
              j === colIndex + 1 || j === colIndex - 1 || j === colIndex
          )
        );

      const moveTurn = allPositivePositions.filter((pos) =>
        cells.some(
          (cell) =>
            cell.position.row + cell.position.col === pos &&
            !whiteSide.some((type) => type === cell?.figure?.figureType)
        )
      );
      if (isCheck) return moveTurn;
      setNewPositiveMoves(moveTurn);
      return moveTurn;
    }
    if (selectedCell.figure?.figureType === FigureTypes.WhitePawn) {
      const isMoved = cells.find(
        (cell) => cell.position === selectedCell.position
      )?.figure?.isMoved;
      const allPositivePositions = positions
        .filter(
          (pos, i) => i === rowIndex - 1 || (!isMoved && i === rowIndex - 2)
        )
        .flatMap((pos) =>
          pos.filter(
            (_s, j) =>
              j === colIndex + 1 || j === colIndex - 1 || j === colIndex
          )
        );
      const fightTurn = allPositivePositions.filter((pos) => {
        const find = positions.findIndex((row) =>
          row.some((col) => col === pos)
        );
        return cells.some(
          (cell) =>
            cell.position.row + cell.position.col === pos &&
            Math.abs(find - rowIndex) === 1 &&
            !(selectedCell.position.col === pos.split('')[1]) &&
            blackSide.some((type) => type === cell?.figure?.figureType)
        );
      });

      const moveTurn = allPositivePositions.filter((pos) =>
        cells.some((cell) => {
          return (
            cell.position.row + cell.position.col === pos &&
            selectedCell.position.col === pos.split('')[1] &&
            !cell.figure
          );
        })
      );

      const cellAbove = cells.find(
        (cell) =>
          cell.position.row + cell.position.col ===
          positions[rowIndex - 1][colIndex]
      );
      const res = cellAbove?.figure ? fightTurn : moveTurn.concat(fightTurn);
      if (isCheck) return res;
      setNewPositiveMoves(res);
      return res;
    }
    if (selectedCell.figure?.figureType === FigureTypes.WhiteHorse) {
      const allPositivePositions = positions.flatMap((row, i) =>
        row.filter((_s, k) => {
          // top -> left and right pos
          if (rowIndex >= 2 && i === rowIndex - 2) {
            if (colIndex > 0 && k === colIndex - 1) {
              return true;
            }
            if (colIndex < 4 && k === colIndex + 1) {
              return true;
            }
          }
          // bot -> left and right pos
          if (rowIndex <= 4 && i === rowIndex + 2) {
            if (colIndex > 0 && k === colIndex - 1) {
              return true;
            }
            if (colIndex < 4 && k === colIndex + 1) {
              return true;
            }
          }
          // right -> top and bot pos
          if (colIndex <= 4 && k === colIndex + 2) {
            if (rowIndex > 0 && i === rowIndex - 1) {
              return true;
            }
            if (rowIndex < 4 && i === rowIndex + 1) {
              return true;
            }
          }
          // left -> top and bot pos
          if (colIndex >= 2 && k === colIndex - 2) {
            if (rowIndex > 0 && i === rowIndex - 1) {
              return true;
            }
            if (rowIndex < 4 && i === rowIndex + 1) {
              return true;
            }
          }
          return false;
        })
      );
      const moveTurn = allPositivePositions.filter((pos) =>
        cells.some(
          (cell) =>
            cell.position.row + cell.position.col === pos &&
            !whiteSide.some((type) => type === cell?.figure?.figureType)
        )
      );

      if (isCheck) return moveTurn;
      setNewPositiveMoves(moveTurn);
      return moveTurn;
    }
  }
  if (blackSide.some((type) => type === selectedCell?.figure?.figureType)) {
    if (selectedCell.figure?.figureType === FigureTypes.BlackKing) {
      const allPositivePositions = positions
        .filter(
          (pos, i) => i === rowIndex + 1 || i === rowIndex - 1 || i === rowIndex
        )
        .flatMap((pos) =>
          pos.filter(
            (_s, j) =>
              j === colIndex + 1 || j === colIndex - 1 || j === colIndex
          )
        );
      const moveTurn = allPositivePositions.filter((pos) =>
        cells.some(
          (cell) =>
            cell.position.row + cell.position.col === pos &&
            !blackSide.some((type) => type === cell?.figure?.figureType)
        )
      );
      if (isCheck) return moveTurn;
      setNewPositiveMoves(moveTurn);
      return moveTurn;
    }
    if (selectedCell.figure?.figureType === FigureTypes.BlackPawn) {
      const isMoved = cells.find(
        (cell) => cell.position === selectedCell.position
      )?.figure?.isMoved;
      const allPositivePositions = positions
        .filter(
          (pos, i) => i === rowIndex + 1 || (!isMoved && i === rowIndex + 2)
        )
        .flatMap((pos) =>
          pos.filter(
            (_s, j) =>
              j === colIndex + 1 || j === colIndex - 1 || j === colIndex
          )
        );
      const fightTurn = allPositivePositions.filter((pos) => {
        const find = positions.findIndex((row) =>
          row.some((col) => col === pos)
        );
        return cells.some(
          (cell) =>
            cell.position.row + cell.position.col === pos &&
            Math.abs(find - rowIndex) === 1 &&
            !(selectedCell.position.col === pos.split('')[1]) &&
            whiteSide.some((type) => type === cell?.figure?.figureType)
        );
      });
      const moveTurn = allPositivePositions.filter((pos) =>
        cells.some((cell) => {
          if (colIndex) {
            return (
              cell.position.row + cell.position.col === pos &&
              selectedCell.position.col === pos.split('')[1] &&
              !cell.figure
            );
          }
        })
      );
      const cellAbove = cells.find(
        (cell) =>
          cell.position.row + cell.position.col ===
          positions[rowIndex + 1][colIndex]
      );
      const res = cellAbove?.figure ? fightTurn : moveTurn.concat(fightTurn);
      if (isCheck) return res;
      setNewPositiveMoves(res);
      return res;
    }
    if (selectedCell.figure?.figureType === FigureTypes.BlackHorse) {
      const allPositivePositions = positions.flatMap((row, i) =>
        row.filter((_s, k) => {
          // top -> left and right pos
          if (rowIndex >= 2 && i === rowIndex - 2) {
            if (colIndex > 0 && k === colIndex - 1) {
              return true;
            }
            if (colIndex < 4 && k === colIndex + 1) {
              return true;
            }
          }
          // bot -> left and right pos
          if (rowIndex <= 4 && i === rowIndex + 2) {
            if (colIndex > 0 && k === colIndex - 1) {
              return true;
            }
            if (colIndex < 4 && k === colIndex + 1) {
              return true;
            }
          }
          // right -> top and bot pos
          if (colIndex <= 4 && k === colIndex + 2) {
            if (rowIndex > 0 && i === rowIndex - 1) {
              return true;
            }
            if (rowIndex < 4 && i === rowIndex + 1) {
              return true;
            }
          }
          // left -> top and bot pos
          if (colIndex >= 2 && k === colIndex - 2) {
            if (rowIndex > 0 && i === rowIndex - 1) {
              return true;
            }
            if (rowIndex < 4 && i === rowIndex + 1) {
              return true;
            }
          }
          return false;
        })
      );
      const moveTurn = allPositivePositions.filter((pos) =>
        cells.some(
          (cell) =>
            cell.position.row + cell.position.col === pos &&
            !blackSide.some((type) => type === cell?.figure?.figureType)
        )
      );
      if (isCheck) return moveTurn;
      setNewPositiveMoves(moveTurn);
      return moveTurn;
    }
  }
  return [];
};
