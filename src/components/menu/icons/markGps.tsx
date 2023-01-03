import * as React from "react";
import { SVGProps } from "react";

const MarkGps = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="-0.5 0 18 26"
    width="28"
    height="31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 .7A8.744 8.744 0 0 0 .25 9.45C.25 16.012 9 25.7 9 25.7s8.75-9.688 8.75-16.25A8.744 8.744 0 0 0 9 .7Zm0 11.875a3.126 3.126 0 0 1 0-6.25 3.126 3.126 0 0 1 0 6.25Z"
      fill={props.color}
    />
  </svg>
);

export default MarkGps;
