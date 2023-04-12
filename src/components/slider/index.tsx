import React from "react";

export default function Slider({
  min,
  max,
  value,
  onChange,
  onMouseUp,
  step,
}: {
  min?: number;
  max?: number;
  value?: number;
  onChange?: (newValue: number) => void;
  onMouseUp?: () => void;
  step?: number;
}) {
  return (
    <div>
      <input
        max={max}
        min={min}
        value={value}
        onKeyUp={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft")
            onMouseUp && onMouseUp();
        }}
        onMouseUp={(e) => {
          onMouseUp && onMouseUp();
        }}
        onChange={(e) => {
          onChange && onChange(+e.target.value);
        }}
        type="range"
      />
    </div>
  );
}
