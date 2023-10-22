import "./spiner.css";

export function Spiner() {
	const listki = 10;
	const divy = [];

	const createDiv = () => {
		for (let i = 1; i <= listki; i++) {
			divy.push(<div className={`listki listek${i}`} key={i}></div>);
		}
		return divy;
	};

	return <div className="divContainerSpiner">{createDiv()}</div>;
}
