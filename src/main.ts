import config from "./config";
import {initControls} from './utils/controls';
import Snake from "./classes/snake";
import Matrix from "./classes/matrix";
import Controls from "./classes/controls";

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const matrix = new Matrix(width, height);
const snake = new Snake(matrix);

function draw() {
	ctx.fillStyle = config.style.backgroundColor;
	ctx.fillRect(0, 0, width, height);

	matrix.draw(ctx);

	snake.draw(ctx);
}

function update() {
	snake.update();

	draw();
}

const interval = setInterval(update, 100);

draw();

const OPPOSITES = {
	up: 'down',
	right: 'left',
	down: 'up',
	left: 'right',
};

new Controls((dir) => {
	const snakeHead = snake.head;
	const cell = matrix.getCell(snakeHead.x, snakeHead.y);

	if (
		!cell.redirect &&
		dir !== snakeHead.dir &&
		dir !== OPPOSITES[snakeHead.dir] &&
		!snake.contains(snakeHead.x, snakeHead.y, true)
	) {
		cell.redirect = dir;
	}
});