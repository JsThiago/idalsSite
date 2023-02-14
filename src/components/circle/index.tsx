export default function Circle({
  ...props
}: {
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        minWidth: "3rem",
        background:
          props.color ||
          "linear-gradient(0deg, #27BC02, #27BC02), linear-gradient(0deg, #27BC02, #27BC02), #27BC02",
        height: "3rem",
        borderRadius: "100%",
        boxShadow: "0.6px 0.6px  3px 0.4px rgba(0,0,0,0.5)",
        ...props.style,
      }}
    ></div>
  );
}
