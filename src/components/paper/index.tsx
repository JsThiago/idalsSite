import React from "react";

export default function Paper({
  ...props
}: {
  style?: React.CSSProperties;
  children?: any;
  onClick?: (e: React.MouseEvent<any>) => void;
  ref?: React.RefObject<any>;
  onContextMenu?: (e: React.MouseEvent<any>) => void;
  id?: string;
}) {
  return (
    <div
      id={props.id}
      ref={props.ref}
      onClick={(e) => {
        props.onClick && props.onClick(e);
      }}
      onContextMenu={(e) => {
        props.onContextMenu && props.onContextMenu(e);
      }}
      style={{
        backgroundColor: "white",
        ...props.style,
      }}
    >
      {props.children}
    </div>
  );
}
