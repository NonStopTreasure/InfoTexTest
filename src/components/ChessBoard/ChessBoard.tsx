import React, { useEffect, useState } from 'react';
import './ChessBoard.scss';
import { IBoard, ICells } from '@interfaces/index';
import Figure from '@components/Figure/Figure';
import { FigureTypes } from '@enums/index';

const initialPositions = {
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

function ChessBoard() {
  // positions data
  const columns = ['a', 'b', 'c', 'd', 'e'];
  const rows = ['1', '2', '3', '4', '5'];
  const positions = columns.map((col) => rows.flatMap((row) => col + row));
  // players data
  const whiteSide = [
    FigureTypes.BlackKing,
    FigureTypes.BlackHorse,
    FigureTypes.BlackPawn,
  ];
  const blackSide = [
    FigureTypes.WhiteHorse,
    FigureTypes.WhitePawn,
    FigureTypes.WhiteKing,
  ];

  // status data
  const [isStart, setIsStart] = useState<boolean>(false);
  const [isCheck, setIsCheck] = useState<boolean>(false);
  const [isCheckMate, setIsCheckMate] = useState<boolean>(false);
  const [turn, setTurn] = useState<boolean>(false);
  const [mainMessage, setMainMessage] = useState<string>('Choose figure');
  // moves data
  const [focusedPosition, setFocusedPosition] = useState<string>('c3');
  const [codeMove, setCodeMove] = useState<string>('');
  const [selectedStartPos, setSelectedStartPos] = useState<{
    row: string;
    col: string;
  } | null>(null);
  const [selectedEndPos, setSelectedEndPos] = useState<{
    row: string;
    col: string;
  } | null>(null);
  const [positiveMoves, setPositivesMoves] = useState<string[]>([]);

  const initialCells = columns.flatMap((col) =>
    rows.flatMap((row) => {
      const match = Object.entries(initialPositions).find(
        ([key]) => key === col + row
      ) as [string, FigureTypes];
      const position = {
        row,
        col,
      };
      if (match) {
        const [, figureType] = match;
        return {
          position,
          figure: {
            figurePosition: position,
            figureType,
          },
        };
      }
      return {
        position,
        figure: null,
      };
    })
  );

  const [cells, setCells] = useState<ICells[]>(initialCells);

  const initialBoard = cells.flatMap((cell, i) => {
    const flag = cell.position.col + cell.position.row === focusedPosition;
    return {
      cell: (
        <div
          key={cell.position.col + cell.position.row}
          className={`${i % 2 === 0 ? 'tile-white' : 'tile-black'}${
            flag ? '_selected' : ''
          }`}
        >
          {cell.figure && (
            <Figure
              figurePosition={cell.figure.figurePosition}
              figureType={cell.figure.figureType}
            />
          )}
        </div>
      ),
    };
  });

  const [board, setBoard] = useState<IBoard[]>(initialBoard);

  const checkMateHandler = () => {
    if (isCheck) {
      setMainMessage('Check! Defend your King!');
    }
    if (isCheckMate) {
      setMainMessage('Check&Mate.Game Over');
    }
  };

  const positiveMovesHandler = (selectedCell: ICells) => {
    const colIndex = columns.findIndex(
      (col) => col === selectedCell?.position.col
    );
    const rowIndex = rows.findIndex(
      (row) => row === selectedCell?.position.row
    );
    if (selectedCell?.figure?.figureType === FigureTypes.WhiteKing) {
      console.log('213');
      const asd = positions.filter(
        (pos, i) =>
          (i === colIndex + 1 || i === colIndex - 1 || i === colIndex) &&
          pos.filter(
            (_s, j) =>
              j === rowIndex + 1 || j === rowIndex - 1 || j === colIndex
          )
      );
      console.log(asd);
    }
  };
  const movesHandler = () => {
    const selectedCell = cells.find(
      (cell) => cell.position.col + cell.position.row === focusedPosition
    );
    if (codeMove === 'Enter' && selectedCell) {
      if (!selectedStartPos && selectedCell && selectedCell.figure) {
        if (
          (whiteSide.some(
            (value) => value === selectedCell?.figure?.figureType
          ) &&
            !turn) ||
          (blackSide.some(
            (value) => value === selectedCell?.figure?.figureType
          ) &&
            turn)
        ) {
          return;
        }
        console.log('213');
        positiveMovesHandler(selectedCell);
        setSelectedStartPos(selectedCell.position);
        setMainMessage('Choose a destination for figure');
        return;
      }
      if (selectedStartPos && !selectedEndPos && selectedCell) {
        setSelectedEndPos(selectedCell.position);
        const startCellPos = cells.find(
          (cell) => cell.position === selectedStartPos
        )?.position;
        const startCellFig = cells.find(
          (cell) => cell.position === selectedStartPos
        )?.figure;
        const newCells = cells.map((cell) => {
          const newCell = cell;
          if (cell.position === startCellPos) {
            newCell.figure = null;
          }
          if (startCellFig && cell.position === selectedCell?.position) {
            newCell.figure = startCellFig;
          }
          return newCell;
        });
        setTurn(!turn);
        setFocusedPosition('c3');
        setMainMessage('Choose figure');
        setCells(newCells.reverse());
      }

      setSelectedStartPos(null);
      setSelectedEndPos(null);
    }
    const colIndex = columns.findIndex(
      (col) => col === selectedCell?.position.col
    );
    const rowIndex = rows.findIndex(
      (row) => row === selectedCell?.position.row
    );
    if (codeMove === 'ArrowUp') {
      if (turn ? colIndex >= 4 : colIndex <= 0) {
        return;
      }
      const newPosition =
        positions[turn ? colIndex + 1 : colIndex - 1][rowIndex];
      setFocusedPosition(newPosition);
    }
    if (codeMove === 'ArrowRight') {
      if (turn ? rowIndex <= 0 : rowIndex >= 4) {
        return;
      }
      const newPosition =
        positions[colIndex][turn ? rowIndex - 1 : rowIndex + 1];
      setFocusedPosition(newPosition);
    }
    if (codeMove === 'ArrowDown') {
      if (turn ? colIndex <= 0 : colIndex >= 4) {
        return;
      }
      const newPosition =
        positions[turn ? colIndex - 1 : colIndex + 1][rowIndex];
      setFocusedPosition(newPosition);
    }
    if (codeMove === 'ArrowLeft') {
      if (turn ? rowIndex >= 4 : rowIndex <= 0) {
        return;
      }
      const newPosition =
        positions[colIndex][turn ? rowIndex + 1 : rowIndex - 1];
      setFocusedPosition(newPosition);
    }
    setCodeMove('');
    setBoard(initialBoard);
  };
  useEffect(() => {
    movesHandler();
  }, [codeMove]);

  return (
    <div
      onClick={() => setIsStart(true)}
      tabIndex={-1}
      onKeyDown={(event) => setCodeMove(event.code)}
      className="board-block"
    >
      {isStart ? (
        <>
          <div className="choose-click">{mainMessage}</div>
          <h1 className="turn-info">{turn ? 'Black Turn' : 'White Turn'}</h1>
          <div className="board">
            <div className="column-bar">
              {columns.map((col) => (
                <i key={col}>{col}</i>
              ))}
            </div>
            <div className="row-bar">
              {rows.map((row) => (
                <i key={row}>{row}</i>
              ))}
            </div>
            {board.map((value) => value.cell)}
          </div>
        </>
      ) : (
        <div className="start-click">Click for play</div>
      )}
    </div>
  );
}

export default ChessBoard;
