import { FigureTypes } from '../enums';

export interface IPosition {
  row: string;
  col: string;
}

export interface IFigure {
  figurePosition: IPosition;
  isMoved: boolean;
  figureType: FigureTypes;
}

export interface ICells {
  position: IPosition;
  figure: IFigure | null;
}

export interface IBoard {
  cell: JSX.Element;
}

export interface IFigureMoves {
  figure: IFigure;
  moves: string[] | undefined;
}
