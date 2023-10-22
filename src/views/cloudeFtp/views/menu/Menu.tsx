import React, { useContext, useEffect, useState } from "react";

import { ContextHome, ContextOptionsFTP, optionsFTP } from "../../contextHomeCloude/contextHome";
import { adresPath, getFtpOptions, saveFtpOptions } from "../../helpFunction/helpFunction";

import { MenuBars } from "./MenuBars/MenuBars";
import { MenuConectionIcon } from "./MenuBars/ConnectionIcon";
import { toast } from "react-toastify";
import { MenuButtons } from "./MenuButtons";
import "./menu.css";

export const Menu = () => {
	const [options, setOptions] = useState<optionsFTP>({ urlFtp: "", passFtp: "", userFtp: "", portFtp: "" });

	useEffect(() => {
		getOptions();
	}, []);

	const contextHome = useContext(ContextHome);
	if (!contextHome) return null;
	const { setLoading, connect, setPath } = contextHome;

	const saveOptions = async () => {
		setLoading(true);
		await saveFtpOptions(options);
		toast.success("Options are saved");
		setLoading(false);
	};
	const getOptions = async () => {
		setLoading(true);
		const options = await getFtpOptions();
		if (!options) return;
		setOptions({
			urlFtp: options.urlFtp,
			portFtp: options.portFtp,
			userFtp: options.userFtp,
			passFtp: options.passFtp,
		});
		//toast.success("Wczytano ustawienia FTP");
		setLoading(false);
		setPath("");
	};

	return (
		<>
			<div className="menu">
				<ContextOptionsFTP.Provider
					value={{
						getOptions,
						setOptions,
						saveOptions,
						options,
					}}
				>
					<MenuBars />
					<div className="MenuCenter">{connect && adresPath.path !== `cloude://` && <MenuButtons />}</div>
					<MenuConectionIcon />
				</ContextOptionsFTP.Provider>
			</div>
		</>
	);
};
