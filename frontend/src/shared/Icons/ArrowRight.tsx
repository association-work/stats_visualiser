import { BASE_ICON_SIZE } from "./Icons.constants";
import { IconProps } from "./Icons.type";

export const ArrowRight = ({
  size = BASE_ICON_SIZE,
  color = "#0B26BA",
}: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 18L15 12L9 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
