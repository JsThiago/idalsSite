import * as React from "react";
import { SVGProps } from "react";

const Plus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="3 2 18 19"
    width="28"
    height="31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z"
      fill={props.color}
      fillOpacity={0.87}
    />
  </svg>
);

export default Plus;
