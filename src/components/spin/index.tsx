import React from "react";
import "./styles.css";
export default function Spin({
  style,
  className,
}: {
  style?: React.CSSProperties;
  className?: string;
}) {
  console.log("no spin");
  return <div style={style} className={"component-spin " + className} />;
}
