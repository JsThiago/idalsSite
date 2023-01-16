import * as React from "react";
import { SVGProps } from "react";

const Elipse = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 50 50"
    width={50}
    height={50}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx={25} cy={25} r={25} fill="#ECD03B" />
  </svg>
);
const Person = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 37 37"
    width={37}
    height={37}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx={18.5} cy={10.792} r={7.708} fill="#000" />
    <path
      d="M20.042 18.5h-3.084c-7.663 0-13.875 6.212-13.875 13.875 0 .851.69 1.542 1.542 1.542h27.75c.851 0 1.542-.69 1.542-1.542 0-7.663-6.213-13.875-13.875-13.875Z"
      fill="#000"
    />
  </svg>
);

export default function ElipsePerson() {
  return (
    <div style={{ position: "relative" }}>
      <Elipse />

      <div
        style={{
          position: "absolute",
          zIndex: 1,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        <Person />
      </div>
    </div>
  );
}
