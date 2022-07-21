import React, {useEffect, useMemo, useState} from 'react';
import './ChessBoard.scss'
import {IBoard, ICells} from "../../interfaces";
import {FigureTypes} from "../../enums";
import Figure from "../Figure/Figure";

const initialPositions = {
    'e1': FigureTypes.WhitePawn,
    'e2': FigureTypes.WhitePawn,
    'e3': FigureTypes.WhitePawn,
    'e4': FigureTypes.WhitePawn,
    'e5': FigureTypes.WhitePawn,
    'a1': FigureTypes.BlackPawn,
    'a2': FigureTypes.BlackPawn,
    'a3': FigureTypes.BlackPawn,
    "a4": FigureTypes.BlackPawn,
    'a5': FigureTypes.BlackPawn,
}


const ChessBoard = () => {
    const columns = useMemo(() => ['a', 'b', 'c', 'd', 'e'], []);
    const rows = useMemo(() => ['1', '2', '3', '4', '5'], []);

    const positions = columns.map(col => rows.flatMap(row => col + row))

    const [focusedPosition, setFocusedPosition] = useState<string>('c3');
    const [codeMove, setCodeMove] = useState<string>('');
    const [isStart, setIsStart] = useState<boolean>(false);
    const [selectedStartPos, setSelectedStartPos] = useState<{ row: string; col: string; } | null>(null)
    const [selectedEndPos, setSelectedEndPos] = useState<{ row: string; col: string; } | null>(null)
    const [turn, setTurn] = useState<boolean>(false);

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
        const flag = cell.position.col + cell.position.row === focusedPosition;
        return ({
            cell: (
                <div key={cell.position.col + cell.position.row}
                     className={`${i % 2 === 0 ? 'tile-white' : 'tile-black'}${flag ? '_selected' : ''}`}>
                    {cell.figure &&
                        <Figure figurePosition={cell.figure.figurePosition} figureType={cell.figure.figureType}/>}
                </div>
            )
        })
    })

    const [board, setBoard] = useState<IBoard[]>(initialBoard);

    useEffect(() => {
        const selectedCell = cells.find(cell => cell.position.col + cell.position.row === focusedPosition);
        if (codeMove === 'Enter' && selectedCell) {
            const findCell = cells.find(value => value.position === selectedCell.position)
            if (!selectedStartPos && findCell && findCell.figure) {
                setSelectedStartPos(findCell.position)
                return;
            }
            if (selectedStartPos && !selectedEndPos && findCell) {
                setSelectedEndPos(findCell.position);
                const startCellPos = cells.find(cell => cell.position === selectedStartPos)?.position;
                const startCellFig = cells.find(cell => cell.position === selectedStartPos)?.figure;
                const newCells = cells.map(cell => {
                    const newCell = cell;
                    if (cell.position === startCellPos) {
                        newCell.figure = null;
                    }
                    if (startCellFig && cell.position === findCell?.position) {
                        newCell.figure = startCellFig;
                    }
                    return newCell
                })
                setTurn(!turn);
                setFocusedPosition('c3');
                setCells(newCells.reverse());
            }

            setSelectedStartPos(null);
            setSelectedEndPos(null);
        }
        const colIndex = columns.findIndex(col => col === selectedCell?.position.col)
        const rowIndex = rows.findIndex(row => row === selectedCell?.position.row)
        if (codeMove === 'ArrowUp') {
            if (turn ? colIndex >= 4 : colIndex <= 0) {
                return;
            }
            const newPosition = positions[turn ? colIndex + 1 : colIndex - 1][rowIndex]
            setFocusedPosition(newPosition);
        }
        if (codeMove === 'ArrowRight') {
            if (turn ? rowIndex <= 0 : rowIndex >= 4) {
                return;
            }
            const newPosition = positions[colIndex][turn ? rowIndex - 1 : rowIndex + 1]
            setFocusedPosition(newPosition);
        }
        if (codeMove === 'ArrowDown') {
            if (turn ? colIndex <= 0 : colIndex >= 4) {
                return;
            }
            const newPosition = positions[turn ? colIndex - 1 : colIndex + 1][rowIndex]
            setFocusedPosition(newPosition);
        }
        if (codeMove === 'ArrowLeft') {
            if (turn ? rowIndex >= 4 : rowIndex <= 0) {
                return;
            }
            const newPosition = positions[colIndex][turn ? rowIndex + 1 : rowIndex - 1]
            setFocusedPosition(newPosition);
        }
        setCodeMove('');
        setBoard(initialBoard);
        return;
    }, [cells, codeMove, columns, focusedPosition, initialBoard, positions, rows, selectedEndPos, selectedStartPos, turn])


    return (
        <div onClick={() => setIsStart(true)} tabIndex={-1} onKeyDown={event => setCodeMove(event.code)}
             className='board-block'>
            {isStart ? (
                <>
                    {!selectedStartPos && <div className="choose-click">Choose a figure</div>}
                    {selectedStartPos && !selectedEndPos &&
                        <div className="choose-click">Choose a figure destination</div>}
                    <h1 className="turn-info">{turn ? 'Black Turn' : 'White Turn'}</h1>
                    <div className='board'>
                        <div className='column-bar'>{columns.map(col => <i key={col}>{col}</i>)}</div>
                        <div className='row-bar'>{rows.map(row => <i key={row}>{row}</i>)}</div>
                        {board.map(value => value.cell)}
                    </div>
                </>) : <div className="start-click">Click for play</div>
            }
        </div>
    );
};

export default ChessBoard;
