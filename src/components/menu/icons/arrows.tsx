import * as React from "react";
import { SVGProps } from "react";

const Arrows = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 28 21"
    width="28"
    height="31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m22.75 5.949-5 5h3.75c0 4.137-3.363 7.5-7.5 7.5a7.338 7.338 0 0 1-3.5-.875l-1.825 1.825A9.914 9.914 0 0 0 14 20.949c5.525 0 10-4.475 10-10h3.75l-5-5Zm-16.25 5c0-4.138 3.363-7.5 7.5-7.5 1.262 0 2.462.312 3.5.875l1.825-1.825A9.914 9.914 0 0 0 14 .949c-5.525 0-10 4.475-10 10H.25l5 5 5-5H6.5Z"
      fill={props.color}
    />
  </svg>
);

export default Arrows;
