import { CSSProperties, useState } from "react";
import "./styles.css";
const DEFAULT_COLOR = "rgba(0,0,0,0.4)";
const FOCUS_COLOR = "purple";

export default function CustomSelect({
  ...props
}: {
  label?: string;
  placeholder?: string;
  options?: Array<{ value: string | number; label: string | number }>;
  style?: CSSProperties;
  onChange?: (user: string) => void;
  value?: string | number;
}) {
  const [actualColor,setActualColor] = useState(DEFAULT_COLOR);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      {props.label && (
        <label
          style={{
            textAlign: "left",
            color:"rgba(0,0,0,0.8)",
            marginBottom: "1rem",
            fontSize: "1.4rem",
          }}
          htmlFor="input"
        >
          {props.label}
        </label>
      )}
      <select
        value={props.value}
        id="input"
        onChange={(e) => {
          props.onChange && props?.onChange(e.target.value);
        }}
        onFocus={()=>{
          setActualColor(FOCUS_COLOR)
        }}
        onBlur={()=>{
          setActualColor(DEFAULT_COLOR)
        }}
        placeholder={props.placeholder}
        style={{
          borderRadius: 5,
          appearance: "none",
          backgroundColor: "white",
          backgroundRepeat: "no-repeat",
          backgroundPositionY: "50%",
          backgroundPositionX: "98%",
          backgroundImage: `url('data:image/svg+xml;utf8,<svg width="20" height="23" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 10.127L12 18.127L20 10.127H4Z" fill="%238E8E93"/></svg>')`,
          fontSize: "1rem",
          padding: "0.7rem",
          border: `1px solid ${actualColor}`,
          ...props.style,
        }}
      >
        {props.options?.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
    </div>
  );
}
