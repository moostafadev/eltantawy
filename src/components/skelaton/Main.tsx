import { IProps } from "./types";
import { getColor } from "./lib";

const Skeleton = ({
  color = "BLACK",
  count = 1,
  width,
  height,
  className,
}: IProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${getColor(color)} ${height && `h-[${height}px]`} w-full animate-pulse p-2 ${className}`}
          style={{
            height: height ? `${height}px` : undefined,
            width: width ? `${width}px` : undefined,
          }}
        />
      ))}
    </>
  );
};

export default Skeleton;
