import { FigureTypes } from '@enums/index';

export const initialPositions = {
  e1: FigureTypes.WhitePawn,
  e2: FigureTypes.WhiteHorse,
  e3: FigureTypes.WhiteKing,
  e4: FigureTypes.WhitePawn,
  e5: FigureTypes.WhitePawn,
  a1: FigureTypes.BlackPawn,
  a2: FigureTypes.BlackPawn,
  a3: FigureTypes.BlackKing,
  a4: FigureTypes.BlackHorse,
  a5: FigureTypes.BlackPawn,
};

export const rows = ['a', 'b', 'c', 'd', 'e'];
export const columns = ['1', '2', '3', '4', '5'];
export const positions = rows.map((row) => columns.flatMap((col) => row + col));

export const blackSide = [
  FigureTypes.BlackKing,
  FigureTypes.BlackHorse,
  FigureTypes.BlackPawn,
];
export const whiteSide = [
  FigureTypes.WhiteHorse,
  FigureTypes.WhitePawn,
  FigureTypes.WhiteKing,
];

export const initialCells = rows.flatMap((row) =>
  columns.flatMap((col) => {
    const match = Object.entries(initialPositions).find(
      ([key]) => key === row + col
    ) as [string, FigureTypes];
    const position = {
      row, // ex - e
      col, // ex - 3
      // -> e3
    };
    if (match) {
      const [, figureType] = match;
      return {
        position,
        figure: {
          figurePosition: position,
          figureType,
          isMoved: false,
        },
      };
    }
    return {
      position,
      figure: null,
    };
  })
);
