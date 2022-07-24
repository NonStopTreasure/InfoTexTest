import { FigureTypes } from '../enums';

export interface IFigure {
  figurePosition: {
    row: string;
    col: string;
  };
  isMoved: boolean;
  figureType: FigureTypes;
}

export interface ICells {
  position: {
    row: string;
    col: string;
  };
  figure: IFigure | null;
}

export interface IBoard {
  cell: JSX.Element;
}
