import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./ClickForConnect.css";

export const ClickForConnect = () => {
	return (
		<>
			<div className="ClickForConnect">
				<p>Click icon for connect</p>
				<FontAwesomeIcon icon="right-long" color="black" size="lg" />
			</div>
		</>
	);
};
