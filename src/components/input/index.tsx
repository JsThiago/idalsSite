import { CSSProperties, useState } from "react";
const DEFAULT_COLOR = "rgba(0,0,0,0.4)";
const FOCUS_COLOR = "purple";

export default function CustomInput({
  ...props
}: {
  label?: string;
  placeholder?: string;
  style?: CSSProperties;
  onChange?: (text: string) => void;
  value?: string;
  disabled?: boolean;
  max?:number
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
            color:"rgba(0,0,0,0.8)",
            textAlign: "left",
            marginBottom: "1rem",
            fontSize: "1.4rem",
          }}
          htmlFor="input"
        >
          {props.label}
        </label>
      )}
      <input
        maxLength={props.max}

        id="input"
        type={"text"}
        onFocus={()=>{
          setActualColor(FOCUS_COLOR)
        }}
        onBlur={()=>{
          setActualColor(DEFAULT_COLOR)
        }}
        disabled={props.disabled || false}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => {
          const text = e.target.value;
          props?.onChange && props.onChange(text);
        }}
        style={{

          fontSize: "1rem",
          padding: "0.3rem",
          borderTop:"none",
          borderLeft:"none",
          borderRight:"none",
          outline:"none",
          borderBottom: `1px solid ${actualColor}`,
          ...props.style,
        }}
      />
    </div>
  );
}
