import * as React from "react";
import { SVGProps } from "react";

const Person = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 26 26"
    width="28"
    height="31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.25 6.827a6.25 6.25 0 1 0-6.25 6.25h-1.25C5.537 13.077.5 18.114.5 24.327c0 .69.56 1.25 1.25 1.25h22.5c.69 0 1.25-.56 1.25-1.25 0-6.213-5.037-11.25-11.25-11.25H13a6.25 6.25 0 0 0 6.25-6.25Zm-7.5 8.75a8.75 8.75 0 0 0-8.662 7.5h19.825a8.75 8.75 0 0 0-8.663-7.5h-2.5Zm-2.5-8.75a3.75 3.75 0 1 0 7.5 0 3.75 3.75 0 0 0-7.5 0Z"
      fill={props.color}
    />
  </svg>
);

export default Person;
