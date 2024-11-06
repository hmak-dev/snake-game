import config from "../config";
import { TDirection } from "./snake";

export type TMatrixCell = { redirect?: TDirection };
export type TMatrixSize = { x: number; y: number };

class Matrix {
	size: TMatrixSize;
	matrix: TMatrixCell[][];

	constructor(width: number, height: number) {
		const xCount = Math.ceil(width / (config.board.cellSize + config.board.cellGap));
		const yCount = Math.ceil(height / (config.board.cellSize + config.board.cellGap));

		config.board.cellWidth = (width - (xCount - 1) * config.board.cellGap) / xCount;
		config.board.cellHeight = (height - (yCount - 1) * config.board.cellGap) / yCount;

		this.matrix = Array(yCount).fill(null).map(() => new Array(xCount).fill(null).map(() => ({})));
		this.size = { x: xCount, y: yCount };
	}

	draw(ctx) {
		ctx.fillStyle = config.style.cellColor;

		this.matrix.forEach((row, i) => {
			row.forEach((cell, j) => {
				ctx.fillRect(
					j * (config.board.cellWidth + config.board.cellGap),
					i * (config.board.cellHeight + config.board.cellGap),
					config.board.cellWidth,
					config.board.cellHeight
				);
			});
		});
	}

	getCell(x: number, y: number): TMatrixCell {
		return this.matrix[y][x];
	}
}

export default Matrix;