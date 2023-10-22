import { Adress } from "./urlList";

export enum CookieOptions {
	auth = "auth",
}
export interface Cookies {
	auth: string;
}
export interface FtpOptions {
	urlFtp: string;
	userFtp: string;
	passFtp: string;
	portFtp: string;
}

export interface DataResponse {
	type: number;
	path: string;
	name: string;
	size: number;
}

export interface ErrorFtp {
	error: {
		massage: string;
	};
}

interface Props {
	setConnect: (v: boolean) => void;
	path: string;
	setPath: (v: string) => void;
}
export const adresPath = { path: "", home: "cloude:/" };

export const sortData = async (data: DataResponse[]): Promise<DataResponse[] | []> => {
	if (data.length !== 0) {
		let folderList = data.filter((e) => e.type === 2);
		const fileList = data.filter((e) => e.type === 1);
		fileList.map((e) => folderList.push(e));
		folderList.push(data[data.length - 1]);
		return folderList;
	} else {
		return [];
	}
};
export const readList = async (props: Props): Promise<DataResponse[] | []> => {
	try {
		const data = await fetch(`${Adress.readList}`, {
			headers: {
				auth: (await readCookies()).auth,
				path: props.path,
			},
		});
		if (data.status === 200) {
			const result = await data.json();
			adresPath.path = adresPath.home + result[1];
			props.setConnect(true);
			return result[0] as DataResponse[];
		} else {
			props.setPath("");
			return [];
		}
	} catch (error) {
		props.setPath("");
		return [];
	}
};
export const clearCookies = async (): Promise<void> => {
	document.cookie = "auth=;";
};

export const readCookies = async (): Promise<Cookies> => {
	const cookie = decodeURIComponent(document.cookie);
	const myCookie = {
		[CookieOptions.auth]: "",
	};
	if (cookie.length === 0) {
		return myCookie;
	}
	const cookieTab = cookie.split(";");

	for (let i = 0; i < cookieTab.length; i++) {
		while (cookieTab[i].charAt(0) === " ") {
			cookieTab[i] = cookieTab[i].substring(1);
		}
		const newCookieTab: string[] = cookieTab[i].split("=");

		if (newCookieTab[1] !== "undefined") {
			if (newCookieTab[0] === CookieOptions.auth) {
				myCookie[newCookieTab[0]] = newCookieTab[1];
			}
		}
	}
	return myCookie;
};

export const saveCookie = (name: string, value: string): void => {
	document.cookie = `${name}=${value}`;
};

export const saveFtpOptions = async (data: FtpOptions): Promise<void> => {
	await fetch(Adress.ftpOptions, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			"auth": (await readCookies()).auth,
		},
		body: JSON.stringify(data),
	});
};

export const getFtpOptions = async () => {
	const data = await fetch(Adress.ftpOptions, {
		headers: {
			auth: (await readCookies()).auth,
		},
	});
	if (data.status === 200) {
		return await data.json();
	} else {
		return { urlFtp: "", portFtp: "", userFtp: "", passFtp: "" };
	}
};
export const downloadFile = async (fetchResult: any, name: string) => {
	console.log(fetchResult);
	console.log(name);

	const data = await fetchResult.blob();
	const blob = new Blob([data], { type: data.type || "application/octet-stream" });
	const blobURL = window.URL.createObjectURL(blob);
	const tempLink = document.createElement("a");
	tempLink.style.display = "none";
	tempLink.href = blobURL;
	tempLink.setAttribute("download", name);
	if (typeof tempLink.download === "undefined") {
		tempLink.setAttribute("target", "_blank");
	}
	document.body.appendChild(tempLink);
	tempLink.click();
	document.body.removeChild(tempLink);
	setTimeout(() => {
		window.URL.revokeObjectURL(blobURL);
	}, 100);
};
