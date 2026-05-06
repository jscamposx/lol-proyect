import type { SVGProps } from "react";

type LolPositionIconName = "top" | "jungle" | "middle" | "bottom" | "utility" | "none";

type LolPositionIconProps = SVGProps<SVGSVGElement> & {
  name: LolPositionIconName;
};

export const LolPositionIcon = ({ name, ...props }: LolPositionIconProps) => {
  if (name === "jungle") {
    return (
      <svg viewBox="0 0 34 34" aria-hidden="true" focusable="false" {...props}>
        <path
          fill="#c8aa6e"
          fillRule="evenodd"
          d="M25 3c-2.128 3.3-5.147 6.851-6.966 11.469A42.373 42.373 0 0 1 20 20a27.7 27.7 0 0 1 1-3c0-4.977 1.856-8.723 4-14ZM13 20c-1.488-4.487-4.76-6.966-9-9 3.868 3.136 4.422 7.52 5 12l3.743 3.312C14.215 27.917 16.527 30.451 17 31c4.555-9.445-3.366-20.8-8-28 2.67 6.573 4.717 10.342 4 17Zm8 5a15.271 15.271 0 0 1 0 2l4-4c.578-4.48 1.132-8.864 5-12-5.288 2.537-7.866 7.854-9 14Z"
        />
      </svg>
    );
  }

  if (name === "middle") {
    return (
      <svg viewBox="0 0 34 34" aria-hidden="true" focusable="false" {...props}>
        <path
          opacity="0.5"
          fill="#785a28"
          fillRule="evenodd"
          d="m30 12.968-4.008 4L26 26h-9l-4 4h17ZM16.979 8 21 4H4v16.977L8 17V8h8.981Z"
        />
        <polygon fill="#c8aa6e" points="25 4 4 25 4 30 9 30 30 9 30 4 25 4" />
      </svg>
    );
  }

  if (name === "bottom") {
    return (
      <svg viewBox="0 0 34 34" aria-hidden="true" focusable="false" {...props}>
        <path
          opacity="0.5"
          fill="#785a28"
          fillRule="evenodd"
          d="M13 20h7v-7h-7v7ZM4 4v22.984l3.955-4L8 8h14.986l4-4H4Z"
        />
        <polygon fill="#c8aa6e" points="29.997 5.955 25 11 25 25 11 25 5.955 29.997 30 30 29.997 5.955" />
      </svg>
    );
  }

  if (name === "top") {
    return (
      <svg viewBox="0 0 34 34" aria-hidden="true" focusable="false" {...props}>
        <path
          opacity="0.5"
          fill="#785a28"
          fillRule="evenodd"
          d="M21 14h-7v7h7v-7Zm5-3v15H11.014l-4 4H30V7.016Z"
        />
        <polygon fill="#c8aa6e" points="4 4 4.003 28.045 9 23 9 9 23 9 28.045 4.003 4 4" />
      </svg>
    );
  }

  if (name === "utility") {
    return (
      <svg viewBox="0 0 34 34" aria-hidden="true" focusable="false" {...props}>
        <path
          fill="#c8aa6e"
          fillRule="evenodd"
          d="M26 13c3.535 0 8-4 8-4H23l-3 3 2 7 5-2-3-4h2ZM22 5l-1.173-2h-7.765L12 5l5 6Zm-5 9-1-1-3 15 4 3 4-3-3-15ZM11 9H0s4.465 4 8 4h2l-3 4 5 2 2-7Z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 34 34" aria-hidden="true" focusable="false" {...props}>
      <path
        fill="#c8aa6e"
        d="M17 3.5 29.5 17 17 30.5 4.5 17 17 3.5Zm0 5.3L9.4 17l7.6 8.2 7.6-8.2L17 8.8Z"
      />
    </svg>
  );
};
