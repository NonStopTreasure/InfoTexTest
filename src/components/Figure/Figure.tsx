import React from 'react';
import {FigureTypes} from '../../enums'
import {IFigure} from "../../interfaces";
import './Figure.scss'
// @ts-ignore
import wp from 'assets/images/w_p.svg'
// @ts-ignore
import bp from 'assets/images/b_p.svg'

const Figure = ({figureType}: IFigure) => {
    if (figureType === FigureTypes.BlackPawn) {
        return (
            <div className='figure_block'>
                <img draggable='true' className="figure_img" src={wp} alt='pawn'/>
            </div>
        )
    }
    if (figureType === FigureTypes.WhitePawn) {
        return (
            <div className='figure_block'>
                <img draggable='false' className="figure_img" src={bp} alt='pawn'/>
            </div>

        )
    }
    return <p>HUI</p>
};

export default Figure;
