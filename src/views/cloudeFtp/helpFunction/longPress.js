import { useCallback, useRef, useState } from "react";

const useLongPress = (onLongPress, onClick, { shouldPreventDefault = true, delay = 300 } = {}) => {
	const [longPressTriggered, setLongPressTriggered] = useState(false);
	const [moved, setMoved] = useState(false);
	const timeout = useRef();
	const target = useRef();

	const start = useCallback(
		(event) => {
			if (shouldPreventDefault && event.target) {
				event.target.addEventListener("touchend", preventDefault, {
					passive: false,
				});
				target.current = event.target;
			}
			timeout.current = setTimeout(() => {
				onLongPress(event);
				setLongPressTriggered(true);
			}, delay);
		},
		[onLongPress, delay, shouldPreventDefault]
	);
	const move = useCallback(
		(event) => {
			setMoved(true);
			timeout.current && clearTimeout(timeout.current);
			setLongPressTriggered(false);
			if (shouldPreventDefault && target.current) {
				target.current.removeEventListener("touchend", preventDefault);
			}
		},
		[shouldPreventDefault]
	);
	const clear = useCallback(
		(event, shouldTriggerClick = true) => {
			timeout.current && clearTimeout(timeout.current);
			shouldTriggerClick && !longPressTriggered && !moved && onClick(event);
			setLongPressTriggered(false);
			if (shouldPreventDefault && target.current) {
				target.current.removeEventListener("touchend", preventDefault);
			}
			setMoved(false);
		},
		[shouldPreventDefault, onClick, longPressTriggered, moved]
	);

	return {
		onMouseDown: (e) => start(e),
		onTouchStart: (e) => start(e),
		onMouseUp: (e) => clear(e, false),
		onTouchEnd: (e) => clear(e, false),

		onMouseLeave: (e) => move(e),

		onTouchMove: (e) => move(e),
		onClick: (e) => clear(e),
	};
};

const isTouchEvent = (event) => {
	return "touches" in event;
};

const preventDefault = (event) => {
	if (!isTouchEvent(event)) return;

	if (event.touches.length < 2 && event.preventDefault) {
		event.preventDefault();
	}
};

export default useLongPress;
