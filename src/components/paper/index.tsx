export default function Paper({
  ...props
}: {
  style?: React.CSSProperties;
  children?: any;
}) {
  return (
    <div
      style={{
        backgroundColor: "white",
        ...props.style,
      }}
    >
      {props.children}
    </div>
  );
}
