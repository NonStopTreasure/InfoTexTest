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
  const rows = ['a', 'b', 'c', 'd', 'e'];
  const columns = ['1', '2', '3', '4', '5'];
  const positions = rows.map((row) => columns.flatMap((col) => row + col));
  // players data
  const blackSide = [
    FigureTypes.BlackKing,
    FigureTypes.BlackHorse,
    FigureTypes.BlackPawn,
  ];
  const whiteSide = [
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

  const initialCells = rows.flatMap((row) =>
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

  const [cells, setCells] = useState<ICells[]>(initialCells);

  const initialBoard = cells.flatMap((cell, i) => {
    const selected = cell.position.row + cell.position.col === focusedPosition;
    const positive = positiveMoves.includes(
      cell.position.row + cell.position.col
    );
    return {
      cell: (
        <div
          key={cell.position.row + cell.position.col}
          className={`${i % 2 === 0 ? 'tile-white' : 'tile-black'}${
            selected ? '_selected' : positive ? '_positive' : ''
          }`}
        >
          {cell.figure && (
            <Figure
              isMoved={cell.figure.isMoved}
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
    const rowIndex = rows.findIndex(
      (row) => row === selectedCell?.position.row
    );
    const colIndex = columns.findIndex(
      (col) => col === selectedCell?.position.col
    );

    if (whiteSide.some((type) => type === selectedCell?.figure?.figureType)) {
      if (selectedCell.figure?.figureType === FigureTypes.WhiteKing) {
        const allPositivePositions = positions
          .filter(
            (pos, i) =>
              i === rowIndex + 1 || i === rowIndex - 1 || i === rowIndex
          )
          .flatMap((pos) =>
            pos.filter(
              (_s, j) =>
                j === colIndex + 1 || j === colIndex - 1 || j === colIndex
            )
          );
        const moveTurn = allPositivePositions.filter((pos) =>
          cells.some(
            (cell) =>
              cell.position.row + cell.position.col === pos &&
              !whiteSide.some((type) => type === cell?.figure?.figureType)
          )
        );
        setPositivesMoves(moveTurn);
        return;
      }
      if (selectedCell.figure?.figureType === FigureTypes.WhitePawn) {
        const isMoved = cells.find(
          (cell) => cell.position === selectedCell.position
        )?.figure?.isMoved;
        const allPositivePositions = positions
          .filter(
            (pos, i) => i === rowIndex - 1 || (!isMoved && i === rowIndex - 2)
          )
          .flatMap((pos) =>
            pos.filter(
              (_s, j) =>
                j === colIndex + 1 || j === colIndex - 1 || j === colIndex
            )
          );
        const updateCells = cells.map((cell) => {
          if (selectedCell.position === cell.position && cell.figure) {
            cell.figure.isMoved = true;
          }
          return cell;
        });
        setCells(updateCells);
        const fightTurn = allPositivePositions.filter((pos) => {
          const find = positions.findIndex((row) =>
            row.some((col) => col === pos)
          );
          return cells.some(
            (cell) =>
              cell.position.row + cell.position.col === pos &&
              Math.abs(find - rowIndex) === 1 &&
              !(selectedCell.position.col === pos.split('')[1]) &&
              blackSide.some((type) => type === cell?.figure?.figureType)
          );
        });

        const moveTurn = allPositivePositions.filter((pos) =>
          cells.some((cell) => {
            return (
              cell.position.row + cell.position.col === pos &&
              selectedCell.position.col === pos.split('')[1] &&
              !cell.figure
            );
          })
        );

        const cellAbove = cells.find(
          (cell) =>
            cell.position.row + cell.position.col ===
            positions[rowIndex - 1][colIndex]
        );
        const res = cellAbove?.figure ? fightTurn : moveTurn.concat(fightTurn);
        setPositivesMoves(res);
        return;
      }
      if (selectedCell.figure?.figureType === FigureTypes.WhiteHorse) {
        const allPositivePositions = positions.flatMap((pos, i) =>
          pos.filter((_s, j) => {
            if (
              i === rowIndex + 2 &&
              (j === colIndex - 1 || j === colIndex + 1)
            ) {
              return true;
            }
            if (
              i === rowIndex - 2 &&
              (j === colIndex - 1 || j === colIndex + 1)
            ) {
              return true;
            }
            if (
              i === colIndex + 2 &&
              (j === rowIndex - 1 || j === rowIndex + 1)
            ) {
              return true;
            }
            if (
              i === colIndex - 2 &&
              (j === rowIndex - 1 || j === rowIndex + 1)
            ) {
              return true;
            }
          })
        );
        const moveTurn = allPositivePositions.filter((pos) =>
          cells.some(
            (cell) =>
              cell.position.col + cell.position.row === pos &&
              !whiteSide.some((type) => type === cell?.figure?.figureType)
          )
        );
        setPositivesMoves(moveTurn);
        return;
      }
    }
    if (blackSide.some((type) => type === selectedCell?.figure?.figureType)) {
      if (selectedCell.figure?.figureType === FigureTypes.BlackKing) {
        const allPositivePositions = positions
          .filter(
            (pos, i) =>
              i === rowIndex + 1 || i === rowIndex - 1 || i === rowIndex
          )
          .flatMap((pos) =>
            pos.filter(
              (_s, j) =>
                j === colIndex + 1 || j === colIndex - 1 || j === colIndex
            )
          );
        const moveTurn = allPositivePositions.filter((pos) =>
          cells.some(
            (cell) =>
              cell.position.row + cell.position.col === pos &&
              !blackSide.some((type) => type === cell?.figure?.figureType)
          )
        );
        setPositivesMoves(moveTurn);
        return;
      }
      if (selectedCell.figure?.figureType === FigureTypes.BlackPawn) {
        const isMoved = cells.find(
          (cell) => cell.position === selectedCell.position
        )?.figure?.isMoved;
        const allPositivePositions = positions
          .filter(
            (pos, i) => i === rowIndex + 1 || (!isMoved && i === rowIndex + 2)
          )
          .flatMap((pos) =>
            pos.filter(
              (_s, j) =>
                j === colIndex + 1 || j === colIndex - 1 || j === colIndex
            )
          );
        const updateCells = cells.map((cell) => {
          if (selectedCell.position === cell.position && cell.figure) {
            cell.figure.isMoved = true;
          }
          return cell;
        });
        setCells(updateCells);

        const fightTurn = allPositivePositions.filter((pos) => {
          const find = positions.findIndex((row) =>
            row.some((col) => col === pos)
          );
          return cells.some(
            (cell) =>
              cell.position.row + cell.position.col === pos &&
              Math.abs(find - rowIndex) === 1 &&
              !(selectedCell.position.col === pos.split('')[1]) &&
              whiteSide.some((type) => type === cell?.figure?.figureType)
          );
        });
        const moveTurn = allPositivePositions.filter((pos) =>
          cells.some((cell) => {
            if (colIndex) {
              return (
                cell.position.row + cell.position.col === pos &&
                selectedCell.position.col === pos.split('')[1] &&
                !cell.figure
              );
            }
          })
        );
        const cellAbove = cells.find(
          (cell) =>
            cell.position.row + cell.position.col ===
            positions[rowIndex + 1][colIndex]
        );
        const res = cellAbove?.figure ? fightTurn : moveTurn.concat(fightTurn);
        setPositivesMoves(res);
        return;
      }
      if (selectedCell.figure?.figureType === FigureTypes.BlackHorse) {
        const allPositivePositions = positions
          .filter((pos, i) => i === rowIndex - 2 || rowIndex + 2)
          .flatMap((pos) =>
            pos.filter((_s, j) => j === colIndex + 1 || j === colIndex - 1)
          );
        const moveTurn = allPositivePositions.filter((pos) =>
          cells.some(
            (cell) =>
              cell.position.col + cell.position.row === pos &&
              !blackSide.some((type) => type === cell?.figure?.figureType)
          )
        );
        setPositivesMoves(moveTurn);
        return;
      }
    }
  };

  const movesHandler = () => {
    const selectedCell = cells.find(
      (cell) => cell.position.row + cell.position.col === focusedPosition
    );
    if (codeMove === 'Enter' && selectedCell) {
      if (!selectedStartPos && selectedCell && selectedCell.figure) {
        if (
          (whiteSide.some(
            (value) => value === selectedCell?.figure?.figureType
          ) &&
            turn) ||
          (blackSide.some(
            (value) => value === selectedCell?.figure?.figureType
          ) &&
            !turn)
        ) {
          return;
        }
        setCodeMove('');
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
        if (
          positiveMoves.every((move) => {
            return (
              move !== selectedCell.position.row + selectedCell.position.col
            );
          })
        ) {
          setMainMessage('You cant choose this cell. Choose another');
          setSelectedEndPos(null);
        } else {
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
          setSelectedStartPos(null);
          setSelectedEndPos(null);
          setPositivesMoves([]);
        }
      }
    }
    const colIndex = columns.findIndex(
      (col) => col === selectedCell?.position.col
    );
    const rowIndex = rows.findIndex(
      (row) => row === selectedCell?.position.row
    );
    if (codeMove === 'ArrowUp') {
      if (turn ? rowIndex >= 4 : rowIndex <= 0) {
        return;
      }
      const newPosition =
        positions[turn ? rowIndex + 1 : rowIndex - 1][colIndex];
      setFocusedPosition(newPosition);
    }
    if (codeMove === 'ArrowRight') {
      if (turn ? colIndex <= 0 : colIndex >= 4) {
        return;
      }
      const newPosition =
        positions[rowIndex][turn ? colIndex - 1 : colIndex + 1];
      setFocusedPosition(newPosition);
    }
    if (codeMove === 'ArrowDown') {
      if (turn ? rowIndex <= 0 : rowIndex >= 4) {
        return;
      }
      const newPosition =
        positions[turn ? rowIndex - 1 : rowIndex + 1][colIndex];
      setFocusedPosition(newPosition);
    }
    if (codeMove === 'ArrowLeft') {
      if (turn ? colIndex >= 4 : colIndex <= 0) {
        return;
      }
      const newPosition =
        positions[rowIndex][turn ? colIndex + 1 : colIndex - 1];
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
            <div className="row-bar">
              {rows.map((col) => (
                <i key={col}>{col}</i>
              ))}
            </div>
            <div className="column-bar">
              {columns.map((row) => (
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
