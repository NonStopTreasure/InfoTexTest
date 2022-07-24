import { ICells } from '@interfaces/index';
import Figure from '@components/Figure/Figure';
import React from 'react';

export function initialBoard(
  cells: ICells[],
  focusedPosition: string,
  positiveMoves: string[]
) {
  return cells.flatMap((cell, i) => {
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
}
