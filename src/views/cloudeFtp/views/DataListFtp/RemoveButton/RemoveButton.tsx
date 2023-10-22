import react from "react";

import "./removeButton.css";
interface Props {
	notremoved: () => void;
	removeFile: () => Promise<void>;
	position: {
		x: number | string;
		y: number;
	};
	item: string;
}
export const RemoveButton = (props: Props) => {
	return (
		<>
			<div className="RemoveView" style={{ top: props.position.y, left: props.position.x }}>
				<p>Remove file {props.item}</p>
				<div className="RemoveButtonView">
					<button className="RemoveButton" onClick={props.removeFile}>
						DELETE FILE
					</button>
					<button className="NotRemoveButton" onClick={props.notremoved}>
						ANULUJ
					</button>
				</div>
			</div>
		</>
	);
};
