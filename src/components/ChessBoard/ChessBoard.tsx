import React, {useMemo, useState} from 'react';
import './ChessBoard.scss'
import {IBoard, ICells} from "../../interfaces";
import {FigureTypes} from "../../enums";
import Figure from "../Figure/Figure";

const initialPositions = {
    'a1': FigureTypes.WhitePawn,
    'a2': FigureTypes.WhitePawn,
    'a3': FigureTypes.WhitePawn,
    'a4': FigureTypes.WhitePawn,
    'a5': FigureTypes.WhitePawn,
    'e1': FigureTypes.BlackPawn,
    'e2': FigureTypes.BlackPawn,
    'e3': FigureTypes.BlackPawn,
    "e4": FigureTypes.BlackPawn,
    'e5': FigureTypes.BlackPawn,
}
const ChessBoard = () => {
    const columns = useMemo(() => ['a', 'b', 'c', 'd', 'e'], []);
    const rows = useMemo(() => ['1', '2', '3', '4', '5'], []);

    const initialCells = columns.flatMap(col =>
        rows.flatMap(row => {
            const match = Object.entries(initialPositions).find(([key]) => key === col + row) as [string, FigureTypes];
            const position = {row: row, col: col}
            if (match) {
                const [, figureType] = match;
                return ({
                    position: position,
                    figure: {
                        figurePosition: position,
                        figureType
                    },
                })
            }
            return ({
                position: position,
                figure: null,
            })
        }))

    const [cells, setCells] = useState<ICells[]>(initialCells);

    const initialBoard = cells.flatMap((cell, i) => {
        return ({
            cell: (
                <div className={i % 2 === 0 ? 'tile-white' : 'tile-black'}>
                    {cell.figure &&
                        <Figure figurePosition={cell.figure.figurePosition} figureType={cell.figure.figureType}/>}
                </div>
            )
        })
    })

    const [board, setBoard] = useState<IBoard[]>(initialBoard);


    return (
        <div className='board-block'>
            <div className='board'>
                <div className='column-bar'>{columns.map(col => <i key={col}>{col}</i>)}</div>
                <div className='row-bar'>{rows.map(row => <i key={row}>{row}</i>)}</div>
                {board.map(value => value.cell)}
            </div>
        </div>
    );
};

export default ChessBoard;