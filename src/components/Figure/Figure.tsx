import React from 'react';
import wp from '@assets/images/w_p.svg';
import bp from '@assets/images/b_p.svg';
import wh from '@assets/images/w_h.svg';
import bh from '@assets/images/b_h.svg';
import wk from '@assets/images/w_k.svg';
import bk from '@assets/images/b_k.svg';

import { FigureTypes } from '@enums/index';
import { IFigure } from '@interfaces/index';
import './Figure.scss';

function Figure({ figureType }: IFigure) {
  if (figureType === FigureTypes.BlackHorse) {
    return (
      <div className="figure_block">
        <img draggable="false" className="figure_img" src={bh} alt="horse" />
      </div>
    );
  }
  if (figureType === FigureTypes.WhiteHorse) {
    return (
      <div className="figure_block">
        <img draggable="false" className="figure_img" src={wh} alt="horse" />
      </div>
    );
  }
  if (figureType === FigureTypes.WhiteKing) {
    return (
      <div className="figure_block">
        <img draggable="false" className="figure_img" src={wk} alt="king" />
      </div>
    );
  }
  if (figureType === FigureTypes.BlackKing) {
    return (
      <div className="figure_block">
        <img draggable="false" className="figure_img" src={bk} alt="king" />
      </div>
    );
  }
  if (figureType === FigureTypes.BlackPawn) {
    return (
      <div className="figure_block">
        <img draggable="false" className="figure_img" src={bp} alt="pawn" />
      </div>
    );
  }
  if (figureType === FigureTypes.WhitePawn) {
    return (
      <div className="figure_block">
        <img draggable="false" className="figure_img" src={wp} alt="pawn" />
      </div>
    );
  }
  return null;
}

export default Figure;
