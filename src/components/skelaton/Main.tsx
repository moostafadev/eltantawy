import { getColor } from "./lib";
import { IProps } from "./types";

const Skeleton = ({
  color = "MAIN",
  count = 1,
  width,
  height = 16,
  className = "",
}: IProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse ${getColor(color)} ${className}`}
          style={{
            width: width ? `${width}px` : "100%",
            height: `${height}px`,
          }}
        />
      ))}
    </>
  );
};

export default Skeleton;
