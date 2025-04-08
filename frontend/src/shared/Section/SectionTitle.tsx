import { tv } from "tailwind-variants";
import { Typography } from "../Typography/Typography";

type SectionTitleProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
};

export const SectionTitle = ({
  label,
  onClick,
  disabled,
  selected,
}: SectionTitleProps) => {
  return (
    <button
      className={titleStyle({ selected, disabled })}
      onClick={onClick}
      disabled={disabled}
    >
      <Typography.BodyLg>{label}</Typography.BodyLg>
    </button>
  );
};

const titleStyle = tv({
  base: "bg-white text-primary-700 border-[2px] border-primary-700 py-m px-l rounded-m active:bg-primary-500 active:text-white",
  variants: {
    selected: {
      true: "bg-primary-700 text-white",
    },
    disabled: {
      true: "border-grey text-grey",
    },
  },
});
