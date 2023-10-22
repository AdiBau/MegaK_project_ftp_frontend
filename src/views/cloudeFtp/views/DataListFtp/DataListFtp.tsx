import React, { useContext, useState } from "react";
import useLongPress from "../../helpFunction/longPress";

import { Adress } from "../../helpFunction/urlList";
import { adresPath, readCookies, downloadFile } from "../../helpFunction/helpFunction";
import { ContextHome } from "../../contextHomeCloude/contextHome";

import { RemoveButton } from "./RemoveButton/RemoveButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { toast } from "react-toastify";

import "./DataListFtp.css";
interface Position {
	x: number | string;
	y: number;
}

export const DataListFtp = () => {
	const [longPressed, setLongPressed] = useState<boolean>(false);
	const [position, setPosition] = useState<Position>({ x: "15%", y: 0 });
	const [removeItem, setRemoveItem] = useState<string>("");

	const context = useContext(ContextHome);

	if (!context) return null;
	const { setConnect, connect, data, setLoading, setReload, reload, path, setPath } = context;

	const onLongPress = (e: any) => {
		document.querySelector(".selected")?.classList.remove("selected");
		if (e.target.innerText.indexOf(".") === -1) return;
		if (adresPath.path !== "cloude://") {
			if (removeItem === e.target.innerText) {
				setLongPressed(false);
				setRemoveItem("");
				return;
			}
			if (e.target.className === "list-item") {
				e.target?.classList.toggle("selected");

				setRemoveItem(e.target.innerText);
			} else {
				setRemoveItem(e.target.innerText);
				e.target.parentElement?.classList.toggle("selected");
			}
			setLongPressed(true);
			setPosition((prev) => ({ ...prev, y: e.target.offsetTop > 120 ? e.target.offsetTop - 60 : 120 }));
			setLongPressed(true);
		}
	};

	const onClick = async (e: any) => {
		if (!longPressed) {
			if (e.target?.innerText !== undefined) {
				await goInFile(e.target.innerText);
			}
		}
	};

	const defaultOptions = {
		shouldPreventDefault: false,
		delay: 500,
	};
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

	const goInFile = async (name: string) => {
		if (longPressed) return;
		if (name.indexOf(".") === -1) {
			setPath(path + "/" + name);
			setReload(!reload);
		} else {
			await getFile(name);
		}
	};

	const getFile = async (name: string) => {
		setLoading(true);
		if (name.indexOf(".") !== -1) {
			await fetch(`${Adress.getOne}`, {
				method: "GET",
				headers: {
					auth: (await readCookies()).auth,
					path: path,
					filename: name,
				},
			}).then((res) => {
				downloadFile(res, name);
			});
		}
		setLoading(false);
	};
	const removeFile = async (): Promise<void> => {
		try {
			const data = await fetch(Adress.removeFile, {
				method: "DELETE",
				headers: {
					auth: (await readCookies()).auth,
					path: path,
					filename: removeItem,
				},
			});
			if (data.status === 200) {
				toast.success(`Pomyślnie usunięto plik ${removeItem}`);
				setReload(!reload);
			} else {
				toast.error(`Błąd przy usuwaniu pliku ${removeItem}`);
			}
		} catch (error) {
			toast.error(`Błąd przy usuwaniu pliku ${removeItem}`);
		}
		setRemoveItem("");
		setLongPressed(false);
		setReload(!reload);
	};
	const NotRemoveFile = async (): Promise<void> => {
		setRemoveItem("");
		setLongPressed(false);
		setReload(!reload);
		document.querySelector(".selected")?.classList.remove("selected");
	};

	return (
		<>
			<div className="list">
				{data.length === 0 && connect && (
					<div className="list-item">
						<p></p>
						<p style={{ textAlign: "center", fontWeight: "bolder" }}>. . . Brak plików do wyświetlenia . . .</p>
					</div>
				)}
				<div className="MenuPath">{adresPath.path}</div>

				{data.map((e, i) => {
					if (i === data.length - 1) {
						return null;
					}

					let icon;
					const index = e.name.indexOf(".");
					let fileType = "";
					if (index !== -1 && index !== 0) {
						fileType = e.name.slice(index + 1, e.name.length).toLowerCase();
					} else {
						fileType = "folder";
					}
					try {
						icon = require(`../../assets/${fileType}.png`);
					} catch (error) {
						icon = require(`../../assets/unknow.png`);
					}

					return (
						<div className="list-item" key={e.name}>
							<div className="img">
								<img src={icon} alt={`icon Logo ${icon}`} />
							</div>
							<p className="list-item-data" {...longPressEvent}>
								{e.name}
							</p>
							{e.size > 0 ? <FontAwesomeIcon icon="cloud-arrow-down" size="lg" onClick={() => goInFile(e.name)} /> : null}

							<p className="size">
								{e.size > 0 &&
									(e.size / 1024 < 1
										? (e.size / 1024).toFixed(2) + "KB"
										: e.size / 1024 / 1024 > 1024
										? (e.size / 1024 / 1024 / 1024).toFixed(2) + "GB"
										: (e.size / 1024 / 1024).toFixed(2) + " MB")}
							</p>
						</div>
					);
				})}
			</div>
			{longPressed && <RemoveButton notremoved={NotRemoveFile} removeFile={removeFile} position={position} item={removeItem} />}
		</>
	);
};
