import { CSSProperties } from "react";

export default function SquareColor({
  ...props
}: {
  color?: string;
  style?: CSSProperties;
  disabled?: boolean;
  value?: string;
  onChange?: (color: string) => void;
}) {
  return (
    <input
      type="color"
      value={props.color || "#ffffff"}
      onChange={(color) => props.onChange && props.onChange(color.target.value)}
      disabled={props?.disabled || false}
      style={{
        cursor: props.disabled ? "initial" : "pointer",
        width: "2rem",
        height: "2rem",
        border: "1px solid #CCCCCC",
        padding: 0,
        ...props.style,
      }}
    />
  );
}
