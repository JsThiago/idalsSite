export default function SubTitle({
  ...props
}: {
  value: string;
  style?: React.CSSProperties;
}) {
  return <h2 style={{ ...props.style }}>{props.value}</h2>;
}
