import * as React from "react";
import { SVGProps } from "react";

const Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={20}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="m12 .012 3 3L12.713 5.3l-3-3L12 .012ZM0 12v3h3l8.299-8.287-3-3L0 12Zm0 6h16v2H0v-2Z"
      fill="#000"
    />
  </svg>
);

const EditButton: React.FC<React.ComponentProps<"button">> = ({
  style,
  onClick,
}) => {
  return (
    <button
      style={{
        cursor: "pointer",
        backgroundColor: "white",
        border: "none",
        ...style,
      }}
      onClick={onClick}
    >
      <Icon />
    </button>
  );
};
export default EditButton;
