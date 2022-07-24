import { ICells, IFigure } from '@interfaces/index';
import { positiveMovesHandler } from './positiveMovesHandler';
import { FigureTypes } from '@enums/index';

export const checkMateHandler = (cells: ICells[]) => {
  const allFiguresData = cells
    .filter((cell) => cell.figure)
    .map((cell) => {
      return {
        figure: cell.figure as IFigure,
        moves: positiveMovesHandler(cell, true, cells),
      };
    });
  const whiteKing = allFiguresData.find(
    (data) => data.figure.figureType === FigureTypes.WhiteKing
  );
  const isWhiteCheck = allFiguresData.some(
    (data) =>
      data.figure.figureType !== FigureTypes.WhiteKing &&
      data.moves.some(
        (move) =>
          move ===
          (whiteKing &&
            whiteKing.figure.figurePosition.row +
              whiteKing.figure.figurePosition.col)
      )
  );
  return allFiguresData;
};
