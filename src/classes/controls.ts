import config from '../config';
import { getTouchDirection, getTouchPosition } from "../utils/touch";
import { TDirection } from "./snake";

export type TControlsHandler = (direction: TDirection) => void;

class Controls {
	handler: TControlsHandler;

	private startPosition = {x: 0, y: 0};

	constructor(handler: TControlsHandler) {
		this.handler = handler;

		if (config.controls.keyboard.enabled) {
			this.initKeyboard();
		}

		if (config.controls.touch.enabled) {
			this.initTouch();
		}
	}

	initKeyboard() {
		window.addEventListener('keyup', (e) => {
			if (config.controls.keyboard.arrows) {
				if (e.key === 'ArrowUp') {
					this.handler('up');
				} else if (e.key === 'ArrowDown') {
					this.handler('down');
				} else if (e.key === 'ArrowLeft') {
					this.handler('left');
				} else if (e.key === 'ArrowRight') {
					this.handler('right');
				}
			}

			if (config.controls.keyboard.wasd) {
				if (e.key === 'w') {
					this.handler('up');
				} else if (e.key === 's') {
					this.handler('down');
				} else if (e.key === 'a') {
					this.handler('left');
				} else if (e.key === 'd') {
					this.handler('right');
				}
			}
		});
	}


	private handleTouchStart(e) {
		this.startPosition = getTouchPosition(e);
	}

	private handleTouchEnd(e) {
		const pos = getTouchPosition(e);
		const drag = {
			x: pos.x - this.startPosition.x,
			y: pos.y - this.startPosition.y,
		};

		const distance = Math.hypot(drag.x, drag.y);

		if (distance > config.controls.touch.threshold) {
			this.handler(getTouchDirection(drag))
		}
	}

	initTouch() {
		window.addEventListener('touchstart', this.handleTouchStart.bind(this));
		window.addEventListener('touchend', this.handleTouchEnd.bind(this));
		window.addEventListener('touchcancel', this.handleTouchEnd.bind(this));
	}
}

export default Controls;