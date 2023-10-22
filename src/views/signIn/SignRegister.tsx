import { FormEvent, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

import "./css/signRegister.css";
import { Adress } from "../cloudeFtp/helpFunction/urlList";

interface props {
	setLoginStatus: (a: boolean) => void;
}

export const SignRegister = (props: props) => {
	const slideRef = useRef<null | HTMLDivElement>(null);
	const email_error = useRef<null | HTMLDivElement>(null);
	const password_error = useRef<null | HTMLDivElement>(null);
	const [titelText, setTitleText] = useState<"Sign In" | "Register">("Sign In");

	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [passwordType, setPasswordType] = useState<"text" | "password">("password");

	const changeType = () => {
		setPasswordType((prev) => (prev === "password" ? "text" : "password"));
	};

	const slide = (to: string): void => {
		if (to === "login") {
			slideRef.current?.classList.add("slide-left");
			slideRef.current?.classList.remove("slide-right");
			setTitleText("Sign In");
		} else {
			slideRef.current?.classList.add("slide-right");
			slideRef.current?.classList.remove("slide-left");
			setTitleText("Register");
		}
	};

	const formSend = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		if (!email.includes("@") || !email.includes(".")) {
			email_error.current?.classList.add("show-err");
		} else {
			email_error.current?.classList.remove("show-err");
		}

		if (password.length < 4) {
			password_error.current?.classList.add("show-err");
		} else {
			password_error.current?.classList.remove("show-err");
		}
		const url = titelText === "Sign In" ? "login" : "register";

		const data = await fetch(`${Adress.logRegister}/${url}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},

			body: JSON.stringify({ email, password }),
		});
		if (data.status === 200) {
			if (url === "login") {
				const token = await data.json();
				const d = new Date();
				d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000);
				const expires = `expires=${d.toUTCString()}`;
				document.cookie = `auth = ${token.auth}; ${expires}; path=/;`;
				props.setLoginStatus(true);
			} else {
				toast.success("Registration successful plase login yet.");
				setTitleText("Sign In");
				slide("login");
				props.setLoginStatus(false);
			}
		} else {
			props.setLoginStatus(false);
			if (url === "register") toast.error("Registration failed email is busy !!!");
			if (url === "login") toast.error("Login failed email or password ar wrong !!!");
		}
	};

	return (
		<>
			<div className="containerRegister">
				<form onSubmit={formSend} className="login-form" noValidate>
					<h1>{titelText}</h1>
					<div className="field-email">
						<label>
							Email
							<input type="email" placeholder="Enter your email" value={email} required onChange={(e) => setEmail(e.target.value)}></input>
						</label>
					</div>
					<div className="emailErr" ref={email_error}>
						Please enter a valid email
					</div>
					<div className="field-password">
						<label>
							Password
							<input className="inpt-pass" type={passwordType} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required></input>
						</label>
						<div className="show-pass" onMouseDown={changeType} onMouseUp={changeType} onTouchEnd={changeType} onTouchStart={changeType}>
							<FontAwesomeIcon icon="eye" size="lg" />
						</div>
					</div>
					<span className="underline" id="under-pass"></span>
					<div className="passErr" ref={password_error}>
						Password length min 4 latters
					</div>
					<div className="buttons">
						<div className="login-btn" onClick={() => slide("login")}>
							Login
						</div>
						<div className="register-btn" onClick={() => slide("register")}>
							Register
						</div>
						<div className="slide-btn" ref={slideRef}></div>
					</div>
					<button type="submit" className="send-button">
						Send
					</button>
				</form>
			</div>
		</>
	);
};
