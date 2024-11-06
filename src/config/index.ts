const config = {
	board: {
		cellSize: 20,
		cellWidth: 20,
		cellHeight: 20,
		cellGap: 2,
	},
	snake: {
		initialLength: 20,
		initialDirection: 'right',
	},
	controls: {
		keyboard: {
			enabled: true,
			arrows: true,
			wasd: true,
		},
		touch: {
			enabled: true,
			threshold: 20,
		},
	},
	style: {
		backgroundColor: '#9bbf00',
		cellColor: '#8baf00',
		foregroundColor: '#3e5711',
	},
};

config.board.cellWidth = config.board.cellSize;
config.board.cellHeight = config.board.cellSize;

export default config;