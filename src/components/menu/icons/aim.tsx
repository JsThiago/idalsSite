import * as React from "react";
import { SVGProps } from "react";

const Aim = (props: SVGProps<SVGSVGElement>) => (
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
      d="M24.25 11.878h-1.337a10 10 0 0 0-8.663-8.662V1.878a1.25 1.25 0 1 0-2.5 0v1.338a10 10 0 0 0-8.662 8.662H1.75a1.25 1.25 0 1 0 0 2.5h1.337a10 10 0 0 0 8.663 8.663v1.337a1.25 1.25 0 1 0 2.5 0v-1.337a10 10 0 0 0 8.663-8.663h1.337a1.25 1.25 0 1 0 0-2.5Zm-15 1.25a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0Zm2.5 0a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0ZM13 19.266c.69 0 1.25.56 1.25 1.25a7.5 7.5 0 0 0 6.137-6.138 1.25 1.25 0 1 1 0-2.5 7.5 7.5 0 0 0-6.137-6.137 1.25 1.25 0 1 1-2.5 0 7.5 7.5 0 0 0-6.138 6.137 1.25 1.25 0 1 1 0 2.5 7.5 7.5 0 0 0 6.138 6.138c0-.69.56-1.25 1.25-1.25Z"
      fill={props.color}
    />
  </svg>
);

export default Aim;
