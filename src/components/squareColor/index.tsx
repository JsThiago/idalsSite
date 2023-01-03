import { CSSProperties } from "react";

export default function SquareColor({
  ...props
}: {
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        backgroundColor: props.color || "white",
        width: "2rem",
        height: "2rem",
        border: "1px solid #CCCCCC",
        ...props.style,
      }}
    />
  );
}
