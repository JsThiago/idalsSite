import { CSSProperties } from "react";

export default function Title({
  ...props
}: {
  value: string;
  style?: CSSProperties;
}) {
  return (
    <h1
      style={{
        margin: "2rem 0 2rem 2rem",
        textAlign: "left",
        fontFamily: "Inter",
        color: "#410D5B",

        fontWeight: 400,
        display: "flex",
        ...props.style,
      }}
    >
      {props.value}
    </h1>
  );
}
