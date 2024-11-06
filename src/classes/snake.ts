import config from "../config";
import Matrix from "./matrix";

const STEPS = {
	up: -1,
	right: 1,
	down: 1,
	left: -1,
};

const AXIS = {
	up: 'y',
	right: 'x',
	down: 'y',
	left: 'x',
};

export type TDirection = 'up' | 'down' | 'left' | 'right';

export type TSnakePiece = { x: number; y: number; dir: TDirection };

class Snake {
	matrix: Matrix;
	snake: TSnakePiece[];
	deadPieces: TSnakePiece[] = [];

	get head(): TSnakePiece {
		return this.snake[0];
	}

	constructor(matrix: Matrix) {
		const cy = Math.round(matrix.size.y / 2);
		const cx = Math.round(matrix.size.x / 2);

		this.matrix = matrix;

		const dir = config.snake.initialDirection;
		const xMultiplier = ['up', 'down'].includes(dir) ? 0 : 1;
		const yMultiplier = ['up', 'down'].includes(dir) ? 1 : 0;
		const step = STEPS[dir];

		if (config.snake.initialLength > matrix.size[AXIS[config.snake.initialDirection]]) {
			config.snake.initialLength = matrix.size[AXIS[config.snake.initialDirection]]
		}

		this.snake = new Array(config.snake.initialLength).fill(null).map((_, i) => ({
			x: cx - i * xMultiplier * step,
			y: cy - i * yMultiplier * step,
			dir: config.snake.initialDirection,
		}));

		this.snake.forEach((piece) => {
			if (piece.x < 0) {
				piece.x = matrix.size.x + piece.x;
			} else if (piece.x >= matrix.size.x) {
				piece.x = piece.x - matrix.size.x;
			}

			if (piece.y < 0) {
				piece.y = matrix.size.y + piece.y;
			} else if (piece.y >= matrix.size.y) {
				piece.y = piece.y - matrix.size.y;
			}
		})
	}

	draw(ctx) {
		ctx.fillStyle = config.style.foregroundColor;

		this.snake.forEach(({x, y}) => {
			ctx.fillRect(
				x * (config.board.cellWidth + config.board.cellGap),
				y * (config.board.cellHeight + config.board.cellGap),
				config.board.cellWidth,
				config.board.cellHeight
			);
		});

		const now = Date.now();

		this.deadPieces.forEach(({ x, y, died_at }) => {
			const opacity = Math.floor(((1000 - (now - died_at)) / 1000) * 255);
			if (opacity > 0) {
				ctx.fillStyle = config.style.foregroundColor + opacity.toString(16).padStart(2, '0');

				ctx.fillRect(
					x * (config.board.cellWidth + config.board.cellGap),
					y * (config.board.cellHeight + config.board.cellGap),
					config.board.cellWidth,
					config.board.cellHeight
				);
			}
		});
	}

	update() {
		for (let i = 0; i < this.snake.length; i++) {
			const piece = this.snake[i];
			const cell = this.matrix.getCell(piece.x, piece.y);

			if (cell.redirect && cell.redirect !== piece.dir) {
				piece.dir = cell.redirect;
			}

			if (i === this.snake.length - 1) {
				delete cell.redirect;
			}

			piece[AXIS[piece.dir]] += STEPS[piece.dir];

			const axisSize = this.matrix.size[AXIS[piece.dir]];
			if (piece[AXIS[piece.dir]] === -1) {
				piece[AXIS[piece.dir]] = axisSize - 1;
			} else if (piece[AXIS[piece.dir]] === axisSize) {
				piece[AXIS[piece.dir]] = 0;
			}

			if (i === 0) {
				if (this.contains(piece.x, piece.y, true)) {
					this.biteSelf();
				}
			}
		}
	}

	private biteSelf() {
		const index = this.snake.slice(1).findIndex((p) => p.x === this.head.x && p.y === this.head.y);

		// clear redirects
		for (let j = index + 2; j < this.snake.length; j++) {
			const tpiece = this.snake[j];
			const tcell = this.matrix.getCell(tpiece.x, tpiece.y);

			if (tcell.redirect) {
				delete tcell.redirect;
			}
		}

		const now = Date.now();

		this.deadPieces.push(...this.snake.slice(index + 2).map((piece) => ({ ...piece, died_at: now })));

		this.snake = this.snake.slice(0, index + 2);
	}

	contains(x: number, y: number, excludeHead = false): boolean {
		if (excludeHead) {
			return this.snake.slice(1).some((piece) => piece.x === x && piece.y === y);
		}

		return this.snake.some((piece) => piece.x === x && piece.y === y);
	}
}

export default Snake;