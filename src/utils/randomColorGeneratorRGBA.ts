export default function randomColorGeneratorRGBA(colors?: Record<string, any>) {
	let r = Math.floor(Math.random() * 256);
	let g = Math.floor(Math.random() * 256);
	let b = Math.floor(Math.random() * 256);
	let a = +Math.random().toFixed(1); // random value between 0 and 1
	let brightness = (r * 299 + g * 587 + b * 114) / 1000;
	if (colors)
		while (
			(brightness <= 128 || brightness >= 200) &&
			!(`rgba(${r}, ${g}, ${b}, ${a})` in colors)
		) {
			r = Math.floor(Math.random() * 256);
			g = Math.floor(Math.random() * 256);
			b = Math.floor(Math.random() * 256);
			brightness = (r * 299 + g * 587 + b * 114) / 1000;
		}

	return { r, g, b, a };
}
