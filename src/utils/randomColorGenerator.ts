import brightnessDetector from "./brightnessDetector";
function generateRandomColor() {
  let randomColor = Math.floor(Math.random() * 16777215).toString(16);
  while (randomColor.length < 6) {
    randomColor = "0" + randomColor;
  }
  return randomColor;
}
const isBrightnessValid = (color: string) => {
  const brightness = brightnessDetector("#" + color)[1];
  return brightness > 128 && brightness < 200;
};
export default function randomColorGenerator(colors?: Record<string, string>) {
  let randomColor = generateRandomColor();
  while (
    randomColor.length < 6 &&
    brightnessDetector("#" + randomColor)[1] > 128 &&
    brightnessDetector("#" + randomColor)[1] < 200
  ) {
    randomColor = Math.floor(Math.random() * 16777215).toString(16);
  }
  if (!colors) return randomColor;
  while (randomColor in colors && isBrightnessValid(randomColor)) {
    randomColor = generateRandomColor();
  }
  return randomColor;
}
