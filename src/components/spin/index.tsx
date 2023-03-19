import React from "react";
import "./styles.css";
export default function Spin({
  style,
  className,
}: {
  style?: React.CSSProperties;
  className?: string;
}) {
  return <div style={style} className={"component-spin " + className}></div>;
}
