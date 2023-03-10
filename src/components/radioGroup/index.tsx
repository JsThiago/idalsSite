import { CSSProperties } from "react";

export default function RadioGroup({
  options,
  name,
  style,
  radioSize,
  value,
  onChange,
}: {
  options: Array<string>;
  name: string;
  style?: CSSProperties;
  radioSize?: number;
  value?: string | number;
  onChange: (value: string, index?: number) => void;
}) {
  const isChecked = (localValue?: string, index?: number) => {
    console.log(index === value);
    if (typeof index === "number") {
      if (+index === +(value as number)) {
        return true;
      }
      return false;
    }
    if (value === localValue) {
      return true;
    }
    return false;
  };
  return (
    <div style={style}>
      {options.map((op, index) => (
        <div
          style={{ display: "flex", alignItems: "center", columnGap: "0.5rem" }}
        >
          <input
            id={"radio-" + name + op}
            type="radio"
            name={name}
            onClick={() => {
              onChange(op, index);
            }}
            checked={isChecked(op, index)}
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
