import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ContextHome } from "./contextHomeCloude/contextHome";
import { Spiner } from "./spinerListki/spiner";
import { sortData, readList, DataResponse } from "./helpFunction/helpFunction";
import { Menu } from "./views/menu/Menu";
import { DataListFtp } from "./views/DataListFtp/DataListFtp";
import { Stopka } from "./views/Stopka/Stopka";
import { ClickForConnect } from "./views/ClickForConnect/ClickForConnect";
import "./cloude.css";

export const Cloude = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [reload, setReload] = useState<boolean>(false);
	const [connect, setConnect] = useState(false);
	const [data, setData] = useState<DataResponse[] | []>([]);
	const [path, setPath] = useState<string>("");

	const listAll = async () => {
		setLoading(true);
		setData(await sortData(await readList({ setConnect, path, setPath })));
		setLoading(false);
	};

	useEffect(() => {
		(async () => {
			if (connect) {
				await listAll();
			}
		})();
	}, [reload]);

	return (
		<>
			<ContextHome.Provider
				value={{
					setLoading,
					setReload,
					connect,
					setConnect,
					listAll,
					setData,
					data,
					reload,
					path,
					setPath,
				}}
			>
				{loading && <Spiner />}

				<div className="container">
					<Menu />
					{!connect && <ClickForConnect />}
					{connect && <DataListFtp />}
				</div>
				<Stopka />
			</ContextHome.Provider>
		</>
	);
};
