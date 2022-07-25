import { ICells, IFigure, IFigureMoves } from '@interfaces/index';
import { positiveMovesHandler } from './positiveMovesHandler';
// import { FigureTypes } from '@enums/index';

export const allMovesHandler = (cells: ICells[]): IFigureMoves[] => {
  return cells
    .filter((cell) => cell.figure)
    .map((cell) => {
      return {
        figure: cell.figure as IFigure,
        moves: positiveMovesHandler(cell, cells),
      };
    });
  // const whiteKing = allFiguresData.find(
  //   (data) => data.figure.figureType === FigureTypes.WhiteKing
  // );
  // const isWhiteCheck = allFiguresData.some(
  //   (data) =>
  //     data.figure.figureType !== FigureTypes.WhiteKing &&
  //     data.moves.some(
  //       (move) =>
  //         move ===
  //         (whiteKing &&
  //           whiteKing.figure.figurePosition.row +
  //             whiteKing.figure.figurePosition.col)
  //     )
  // );
  // return isWhiteCheck;
};
