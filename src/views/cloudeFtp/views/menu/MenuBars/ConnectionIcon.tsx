import React, { useContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ContextHome, ContextOptionsFTP } from "../../../contextHomeCloude/contextHome";
import { Adress } from "../../../helpFunction/urlList";
import { toast } from "react-toastify";
import { readCookies } from "../../../helpFunction/helpFunction";

export const MenuConectionIcon = () => {
	const contextFTP = useContext(ContextOptionsFTP);
	const context = useContext(ContextHome);

	if (!contextFTP) return null;
	const { options } = contextFTP;

	if (!context) return null;
	const { connect, setConnect, setLoading, setReload, reload, setPath } = context;

	const connectFtp = async () => {
		!connect && setPath("/");
		const url = Adress.connect + "/" + (connect ? "disconnect" : "connect");
		const dataOptions = JSON.stringify(options);
		try {
			setLoading(true);
			const conn = await fetch(url, {
				headers: {
					options: dataOptions,
					auth: (await readCookies()).auth,
				},
			});
			if (conn.status === 200) {
				toast.success(` ${connect ? "Rozłączono z serwerem" : "Połączono z serwerem"}`);

				setConnect(!connect);
				setReload(!reload);
			} else {
				setConnect(false);
				toast.error("Brak połączenia z serwerem. Wprowadź parametry");
			}
		} catch (error) {
			setPath("/");
			toast.error("Brak połączenia z serwerem.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="MenuConnect" onClick={connectFtp}>
			{connect ? <FontAwesomeIcon icon="plug" beat size="xl" /> : <FontAwesomeIcon icon="plug-circle-xmark" color="white" size="xl" />}
		</div>
	);
};
