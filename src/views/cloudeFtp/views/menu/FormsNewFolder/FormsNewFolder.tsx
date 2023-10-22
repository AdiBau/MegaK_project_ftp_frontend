import React, { useState, useContext, SyntheticEvent } from "react";

import { toast } from "react-toastify";
import { Adress } from "../../../helpFunction/urlList";
import { ContextHome } from "../../../contextHomeCloude/contextHome";
import "./FormNewFolder.css";
import { getFtpOptions, readCookies } from "../../../helpFunction/helpFunction";

interface Props {
	setNewFolder: (e: boolean) => void;
}

export const FormsNewFolder = (props: Props) => {
	const { setNewFolder } = props;
	const [inputNewFolderValue, setInputNewFolderValue] = useState<string>("");

	const context = useContext(ContextHome);
	if (!context) return null;

	const { setReload, reload, path } = context;

	const CreateNewFolder = async (e: SyntheticEvent) => {
		e.preventDefault();
		if (!inputNewFolderValue) {
			return setNewFolder(false);
		}

		if (inputNewFolderValue.includes(".")) {
			return toast.error("Wprowadź nazwe bez kropki");
		}
		try {
			const url = encodeURIComponent(path);
			const data = await fetch(Adress.newFolder, {
				method: "put",
				headers: {
					auth: (await readCookies()).auth,
					options: JSON.stringify(await getFtpOptions()),
					path: path,
					foldername: inputNewFolderValue,
				},
			});
			data.status === 201 && toast.success(`Folder o nazwie ${inputNewFolderValue} stworzony`);
			setReload(!reload);
		} catch (error) {}
		setNewFolder(false);
		setInputNewFolderValue("");
	};

	return (
		<>
			<form className="formNewFolder" onSubmit={CreateNewFolder}>
				<label>Podaj nazwe folderu</label>
				<input type="text" value={inputNewFolderValue} onChange={(e) => setInputNewFolderValue(e.currentTarget.value)} autoFocus />
				<div className="buttonsNewFolder">
					<button type="submit" onClick={() => setNewFolder(false)}>
						- Anuluj -
					</button>
					<button type="submit" onClick={CreateNewFolder}>
						- OK -
					</button>
				</div>
			</form>
		</>
	);
};
