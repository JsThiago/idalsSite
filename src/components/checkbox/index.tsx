import React, { ComponentPropsWithoutRef } from "react";

const Checkbox: React.FC<ComponentPropsWithoutRef<"input">> = ({
  style,
  checked,
}) => {
  return <input type="checkbox" style={style} checked={checked} />;
};

export default Checkbox;
