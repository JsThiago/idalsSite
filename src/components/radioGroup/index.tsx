import { CSSProperties } from "react";

export default function RadioGroup({
  options,
  name,
  style,
  radioSize,
}: {
  options: Array<string>;
  name: string;
  style?: CSSProperties;
  radioSize?: number;
}) {
  return (
    <div style={style}>
      {options.map((op) => (
        <div
          style={{ display: "flex", alignItems: "center", columnGap: "0.5rem" }}
        >
          <input
            id={"radio-" + name + op}
            type="radio"
            name={name}
            checked
            value={op}
            style={{
              WebkitTransform: `scale(${radioSize || 1.5})`,
              transform: `scale(${radioSize || 1.5})`,
            }}
          />

          <label htmlFor={"radio-" + name + op}>{op}</label>
        </div>
      ))}
    </div>
  );
}
