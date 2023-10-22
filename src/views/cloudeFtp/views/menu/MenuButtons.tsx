import React, { useContext, useRef, useState } from "react";

import { Adress } from "../../helpFunction/urlList";
import { ContextHome } from "../../contextHomeCloude/contextHome";
import { getFtpOptions, readCookies } from "../../helpFunction/helpFunction";
import { toast } from "react-toastify";
import { FormsNewFolder } from "./FormsNewFolder/FormsNewFolder";

export const MenuButtons = () => {
	const [newFolder, setNewFolder] = useState<boolean>(false);
	const [fileNameForProgress, setFileNameForProgress] = useState<string>("");
	const progressBar = useRef<HTMLDivElement>(null);
	const progressBarHolder = useRef<HTMLDivElement>(null);

	const openInput = useRef<HTMLInputElement>(null);

	const context = useContext(ContextHome);

	if (!context) return null;
	const { connect, setReload, reload, path, setPath } = context;

	const openInputSelectedFileHandler = async () => {
		if (!connect || path === "cloude://") {
			return;
		}

		if (!openInput.current) {
			return;
		}
		if (!openInput.current.files) {
			return;
		}
		const file = openInput.current.files[0];

		const fileName = file.name;

		const formData = new FormData();
		formData.append("file", file, fileName);

		const xhr = new XMLHttpRequest();
		try {
			setFileNameForProgress(`Uploading File - ${fileName}`);
			xhr.open("POST", Adress.send, true);
			xhr.setRequestHeader("path", path);
			xhr.setRequestHeader("filename", fileName);
			xhr.setRequestHeader("auth", (await readCookies()).auth);
			xhr.setRequestHeader("options", JSON.stringify(await getFtpOptions()));
			xhr.upload.onprogress = (e) => {
				if (e.lengthComputable) {
					const percentComplete = (e.loaded / e.total) * 100;
					if (progressBar.current) {
						progressBar.current.style.width = `${(percentComplete - 1).toFixed()}%`;
					}
					if (progressBarHolder.current) {
						progressBarHolder.current.innerText = `Trwa Zapis na serwer ${(percentComplete - 1).toFixed()}%`;
					}
				}
				if (e.loaded === e.total) {
				}
			};

			xhr.onload = () => {
				if (xhr.status === 201) {
					setReload(!reload);
					setFileNameForProgress("");
				}
			};
			xhr.send(formData);
		} catch (error) {
			toast.error(`Plik :  ${fileName} NIE ZOSTAŁ ZAPISANY`);
		}
	};
	const goBack = () => {
		const adres = path.split("/");
		const adresSplice = adres.splice(0, adres.length - 1).join("/");
		setPath(adresSplice);
		setReload(!reload);
	};

	return (
		<>
			<div className={"buttonsNavigation"}>
				<input type="file" className="openInput" ref={openInput} onChange={openInputSelectedFileHandler}></input>
				<button className="button menuButton" onClick={() => openInput.current?.click()}>
					Save file
				</button>
				<button className="button menuButton" onClick={goBack}>
					Back
				</button>
				<button className="button menuButton" onClick={() => setNewFolder(true)}>
					New folder
				</button>
				{newFolder && <FormsNewFolder setNewFolder={setNewFolder} />}
			</div>
			{fileNameForProgress && (
				<div className="progressBarHolder">
					<p ref={progressBarHolder}></p>
					<div className="progress-Bar">
						<div className="progress" ref={progressBar}></div>
					</div>
				</div>
			)}
		</>
	);
};
