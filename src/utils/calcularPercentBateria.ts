export default function calcularPercentBateria(bateria: number) {
  return ((bateria - 2700) * 100) / 1496;
}
