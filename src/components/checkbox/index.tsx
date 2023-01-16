import React, { ComponentPropsWithoutRef } from "react";

const Checkbox: React.FC<ComponentPropsWithoutRef<"input">> = ({
  style,
  checked,
  onClick,
}) => {
  return (
    <input type="checkbox" style={style} checked={checked} onClick={onClick} />
  );
};

export default Checkbox;
