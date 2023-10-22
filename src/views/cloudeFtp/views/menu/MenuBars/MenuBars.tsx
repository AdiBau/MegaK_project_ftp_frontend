import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuOptions } from "./MenuOptions";

export const MenuBars = () => {
	const [bars, setBars] = useState<boolean>(false);
	const [showMenuOptions, setShowMenuOptions] = useState<boolean>(false);
	const openMenu = () => {
		setBars((prev) => !prev);
		setShowMenuOptions((prev) => !prev);
	};
	return (
		<div className={"MenuBars"}>
			{!bars && <FontAwesomeIcon icon="bars" size="xl" onClick={openMenu} />}
			{bars && <FontAwesomeIcon icon="x" size="lg" onClick={openMenu} />}
			{showMenuOptions && <MenuOptions setBars={setBars} setShowMenuOptions={setShowMenuOptions} />}
		</div>
	);
};
