import React, { useContext } from "react";
import { ContextOptionsFTP } from "../../../contextHomeCloude/contextHome";

interface Props {
	setUstawieniaFTP: (e: boolean) => void;
	setBars: (e: boolean) => void;
	setShowMenuOptions: (e: boolean) => void;
}

export const OptionsFTP = (props: Props) => {
	const contextOptionsFTP = useContext(ContextOptionsFTP);
	if (!contextOptionsFTP) return null;
	const { getOptions, options, setOptions, saveOptions } = contextOptionsFTP;

	const handlerAnuluj = (): void => {
		props.setUstawieniaFTP(false);
		props.setBars(false);
		props.setShowMenuOptions(false);
	};

	return (
		<>
			<div className="setOptions">
				<div className="options">
					<label htmlFor="url">URL</label>
					<input type="text" id={"url"} placeholder="IP adress" value={options.urlFtp} onChange={(e) => setOptions({ ...options, urlFtp: e.target.value })} />
					<label htmlFor="port">port</label>
					<input type="number" id={"port"} placeholder="21" value={options.portFtp} onChange={(e) => setOptions({ ...options, portFtp: e.target.value })} />
					<label htmlFor="user">user</label>
					<input type="text" id={"user"} placeholder="user Name" value={options.userFtp} onChange={(e) => setOptions({ ...options, userFtp: e.target.value })} />
					<label htmlFor="pass">password</label>
					<input type="password" id={"pass"} placeholder="password" value={options.passFtp} onChange={(e) => setOptions({ ...options, passFtp: e.target.value })} />
				</div>
				<div className="buttonsOptions">
					<button className={"zapisz button"} onClick={saveOptions}>
						Save
					</button>
					<button className={"wczytaj button"} onClick={getOptions}>
						Get from server
					</button>
					<button className={"anuluj button"} onClick={handlerAnuluj}>
						Close
					</button>
				</div>
			</div>
		</>
	);
};
