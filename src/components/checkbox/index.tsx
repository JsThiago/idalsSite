import React, { ComponentPropsWithoutRef } from "react";

const Checkbox: React.FC<ComponentPropsWithoutRef<"input">> = ({
  style,
  checked,
  onClick,
  disabled,
}) => {
  return (
    <input
      type="checkbox"
      disabled={disabled}
      style={style}
      checked={checked}
      onClick={onClick}
    />
  );
};

export default Checkbox;
