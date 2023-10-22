import { createContext } from "react";
import { DataResponse } from "../helpFunction/helpFunction";

export interface optionsFTP {
	urlFtp: string;
	passFtp: string;
	userFtp: string;
	portFtp: string;
}
export interface ContextHomeInterface {
	setLoading: (e: boolean) => void;
	setReload: (e: boolean) => void;
	reload: boolean;
	connect: boolean;
	setConnect: (e: boolean) => void;
	listAll: () => void;
	data: DataResponse[];
	setData: (e: DataResponse[]) => void;
	path: string;
	setPath:(e: string)=>void;
}
export const ContextHome = createContext<ContextHomeInterface | null>(null);
export interface OptionsFTPInterface {
	setOptions: (e: optionsFTP) => void;
	options: optionsFTP;
	getOptions: () => void;
	saveOptions: () => void;
	
}
export const ContextOptionsFTP = createContext<OptionsFTPInterface | null>(null);
