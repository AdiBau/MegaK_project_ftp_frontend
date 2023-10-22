import { useState } from "react";
import { OptionsFTP } from "./OptionsFTP";
import { Adress } from "../../../helpFunction/urlList";
import { clearCookies, readCookies } from "../../../helpFunction/helpFunction";

interface Props {
	setBars: (e: boolean) => void;
	setShowMenuOptions: (e: boolean) => void;
}
export const MenuOptions = (props: Props) => {
	const [ustawieniaFTP, setUstawieniaFTP] = useState(false);

	const handlerUstawieniaFTP = () => {
		setUstawieniaFTP(true);
	};

	const logout = async () => {
		await fetch(Adress.logOut, {
			headers: {
				auth: (await readCookies()).auth,
			},
		});
		await clearCookies();
		document.location.reload();
	};

	return (
		<>
			<div className="MenuOptions">
				<button onClick={handlerUstawieniaFTP}>Ustawienia FTP</button>
				<button onClick={logout}>LogOut</button>
			</div>
			{ustawieniaFTP && <OptionsFTP setUstawieniaFTP={setUstawieniaFTP} setBars={props.setBars} setShowMenuOptions={props.setShowMenuOptions} />}
		</>
	);
};
