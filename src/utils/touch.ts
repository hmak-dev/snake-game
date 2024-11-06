import { TDirection } from "../classes/snake";

export function getTouchPosition(e): { x: number, y: number } {
	const touch = e.touches[0] || e.changedTouches[0];
	return { x: touch.pageX || touch.clientX, y: touch.pageY || touch.clientX };
}

export function getTouchDirection(movement: { x: number; y: number }): TDirection {
	const pi = Math.PI;

	let angle = Math.atan2(movement.y, movement.x);

	angle += pi / 4;
	angle = angle < 0 ? pi * 2 + angle : angle;

	const area = Math.floor(angle / (pi / 2));

	return ['right', 'down', 'left', 'up'][area] as TDirection;
}