import { CSSProperties } from "react";

export default function CustomInput({
  ...props
}: {
  label?: string;
  placeholder?: string;
  style?: CSSProperties;
  onChange?: (text: string) => void;
  value?: string;
  disabled?: boolean;
}) {
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
            marginBottom: "1rem",
            fontSize: "1.4rem",
          }}
          htmlFor="input"
        >
          {props.label}
        </label>
      )}
      <input
        id="input"
        disabled={props.disabled || false}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => {
          const text = e.target.value;
          props?.onChange && props.onChange(text);
        }}
        style={{
          borderRadius: 5,
          fontSize: "1rem",
          padding: "0.7rem",
          border: "1px solid black",
          ...props.style,
        }}
      />
    </div>
  );
}
