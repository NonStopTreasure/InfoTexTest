import React, {useEffect, useMemo, useState} from 'react';
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

    const positions = columns.map(col => rows.flatMap(row => col + row))

    const [selectedPosition, setSelectedPosition] = useState('c3');
    const [codeMove,setCodeMove] = useState('');

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

    const [cells, ] = useState<ICells[]>(initialCells);

    const initialBoard = cells.flatMap((cell, i) => {
        const flag = cell.position.col + cell.position.row === selectedPosition;
        return ({
            cell: (
                <div key={cell.position.col + cell.position.row} className={`${i % 2 === 0 ? 'tile-white' : 'tile-black'}${flag ? '_selected' : ''}`}>
                    {cell.figure &&
                        <Figure figurePosition={cell.figure.figurePosition} figureType={cell.figure.figureType}/>}
                </div>
            )
        })
    })

    const [board, setBoard] = useState<IBoard[]>(initialBoard);

    useEffect(() => {
        const selectedCell = cells.find(cell => cell.position.col + cell.position.row === selectedPosition);
        const colIndex = columns.findIndex(col => col === selectedCell?.position.col)
        const rowIndex = rows.findIndex(row => row === selectedCell?.position.row)
        if (codeMove === 'Enter') {
            console.log('1', codeMove)

        }
        if (codeMove === 'ArrowUp') {
            if (colIndex <= 0){
                return;
            }
            const newPosition = positions[colIndex-1][rowIndex]
            setSelectedPosition(newPosition);
        }
        if (codeMove === 'ArrowRight') {
            if (rowIndex >= 4){
                return;
            }
            const newPosition = positions[colIndex][rowIndex+1]
            setSelectedPosition(newPosition);
        }
        if (codeMove === 'ArrowDown') {
            if (colIndex >= 4){
                return;
            }
            const newPosition = positions[colIndex+1][rowIndex]
            setSelectedPosition(newPosition);
        }
        if (codeMove === 'ArrowLeft') {
            if (rowIndex <= 0){
                return;
            }
            const newPosition = positions[colIndex][rowIndex-1]
            setSelectedPosition(newPosition);
        }
        setCodeMove('');
        setBoard(initialBoard);
        return;
    },[codeMove])

    return (
        <div tabIndex={-1} onKeyDown={event => setCodeMove(event.code)} className='board-block'>
            <div style={{fontSize:'60px', textAlign:'center'}}>Click for play</div>
            <div className='board'>
                <div className='column-bar'>{columns.map(col => <i key={col}>{col}</i>)}</div>
                <div className='row-bar'>{rows.map(row => <i key={row}>{row}</i>)}</div>
                {board.map(value => value.cell)}
            </div>
        </div>
    );
};

export default ChessBoard;
