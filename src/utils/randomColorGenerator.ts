import brightnessDetector from "./brightnessDetector";

export default function randomColorGenerator(colors?: Record<string, string>) {
	let randomColor = Math.floor(Math.random() * 16777215).toString(16);

	while (
		randomColor.length < 6 &&
		brightnessDetector("#" + randomColor)[1] > 128 &&
		brightnessDetector("#" + randomColor)[1] < 200
	) {
		randomColor = Math.floor(Math.random() * 16777215).toString(16);
	}
	if (!colors) return randomColor;
	while (
		randomColor in colors &&
		randomColor.length < 6 &&
		brightnessDetector("#" + randomColor)[1] > 128 &&
		brightnessDetector("#" + randomColor)[1] < 200
	) {
		randomColor = Math.floor(Math.random() * 16777215).toString(16);
	}
	return randomColor;
}
