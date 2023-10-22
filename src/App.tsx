import React, { useEffect, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import { SignRegister } from "./views/signIn/SignRegister";
import { Cloude } from "./views/cloudeFtp/Cloude";
import { readCookies } from "./views/cloudeFtp/helpFunction/helpFunction";
import { Adress } from "./views/cloudeFtp/helpFunction/urlList";

library.add(fas);
function App() {
	const [loginStatus, setLoginStatus] = useState<boolean>(false);

	useEffect(() => {
		try {
			(async () => {
				const data = await fetch(Adress.connect + "/login", {
					headers: {
						auth: (await readCookies()).auth,
					},
				});
				if (data.status === 200) {
					setLoginStatus(true);
				} else {
					setLoginStatus(false);
				}
			})();
		} catch (error) {
			setLoginStatus(false);

			console.log("useEfect Home Login ", error);
		}
	}, []);
	return (
		<>
			{!loginStatus && <SignRegister setLoginStatus={setLoginStatus} />}
			{loginStatus && <Cloude />}
			<ToastContainer
				position="top-center"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
				closeButton
			/>
		</>
	);
}

export default App;

