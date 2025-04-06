import { twMerge } from "tailwind-merge";
import { ArrowRight } from "../Icons/ArrowRight";
import { Typography } from "../Typography/Typography";

type SectionDataProps = {
  label: string;
  onClick: () => void;
};

export const SectionData = ({ label, onClick }: SectionDataProps) => {
  return (
    <button
      className={twMerge(
        "flex flex-row items-center p-m",
        "bg-primary-100 text-primary-700 border-[2px] border-primary-700 rounded-m"
      )}
      onClick={onClick}
    >
      <Typography.BodyLg>{label}</Typography.BodyLg>
      <div className="flex grow min-w-m" />
      <ArrowRight />
    </button>
  );
};
