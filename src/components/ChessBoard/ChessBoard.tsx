import React, { useEffect, useState } from 'react';
import {
  IBoard,
  ICells,
  IFigure,
  IFigureMoves,
  IPosition,
} from '@interfaces/index';
import { positiveMovesHandler } from '../../utils/functions/positiveMovesHandler';
import { columns, initialCells, rows } from '../../utils/vars';
import { movesHandler } from '../../utils/functions/movesHandler';
import { initialBoard } from '../../utils/functions/initialBoard';
import './ChessBoard.scss';
import { FigureTypes } from '@enums/index';
import { checkMateHandler } from '../../utils/functions/checkMateHandler';

function ChessBoard() {
  const [displayRows, setDisplayRows] = useState<string[]>([
    'a',
    'b',
    'c',
    'd',
    'e',
  ]);
  const [displayCols, setDisplayCols] = useState<string[]>([
    '1',
    '2',
    '3',
    '4',
    '5',
  ]);

  const [cells, setCells] = useState<ICells[]>(initialCells(rows, columns));
  const [isStart, setIsStart] = useState<boolean>(false);
  const [turn, setTurn] = useState<boolean>(false);
  const [mainMessage, setMainMessage] = useState<string>('Choose figure');
  const [focusedPosition, setFocusedPosition] = useState<string>('c3');
  const [codeMove, setCodeMove] = useState<string>('');
  const [selectedStartPos, setSelectedStartPos] = useState<IPosition | null>(
    null
  );
  const [selectedEndPos, setSelectedEndPos] = useState<IPosition | null>(null);
  const [positiveMoves, setPositivesMoves] = useState<string[]>([]);
  const resInitialBoard = initialBoard(cells, focusedPosition, positiveMoves);
  const [board, setBoard] = useState<IBoard[]>(resInitialBoard);
  //////
  const [isCheck, setIsCheck] = useState<boolean>(false);
  const [checkPositions, setCheckPositions] = useState<IFigureMoves[]>([]);

  const changePositiveMoves = (newPositiveMoves: string[]) => {
    setPositivesMoves(newPositiveMoves);
  };

  const changeCodeMove = (newCodeMove: string) => {
    setCodeMove(newCodeMove);
  };
  const changeTurn = () => {
    setTurn(!turn);
  };
  const changeFocusedPosition = (newFocusedPosition: string) => {
    setFocusedPosition(newFocusedPosition);
  };
  const changeSelectedStartPos = (newSelectedStartPos: IPosition | null) => {
    setSelectedStartPos(newSelectedStartPos);
  };
  const changeSelectedEndPos = (newSelectedEndPos: IPosition | null) => {
    setSelectedEndPos(newSelectedEndPos);
  };

  const changeMainMessage = (newMessage: string) => {
    setMainMessage(newMessage);
  };
  const changeCells = (newCells: ICells[]) => {
    setCells(newCells);
  };

  const reverseBoard = () => {
    setDisplayRows(displayRows.reverse());
    setDisplayCols(displayCols.reverse());
  };

  const reRenderBoard = () => setBoard(resInitialBoard);

  useEffect(() => {
    console.log(checkMateHandler(cells));
  }, [turn]);

  useEffect(() => {
    if (selectedStartPos && !positiveMoves.length) {
      setMainMessage('You dont have moves for this pawn. Choose another');
      setSelectedStartPos(null);
      setPositivesMoves([]);
    }
    movesHandler(
      codeMove,
      positiveMoves,
      cells,
      focusedPosition,
      selectedStartPos,
      selectedEndPos,
      turn,
      changeCodeMove,
      changeTurn,
      changeFocusedPosition,
      changeSelectedStartPos,
      changeSelectedEndPos,
      changeMainMessage,
      reverseBoard,
      changeCells,
      changePositiveMoves,
      reRenderBoard
    );
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
            <div className="row-bar">
              {displayRows.map((row) => (
                <i key={row}>{row}</i>
              ))}
            </div>
            <div className="column-bar">
              {displayCols.map((col) => (
                <i key={col}>{col}</i>
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
