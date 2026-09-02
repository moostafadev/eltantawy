import { getColor } from "./lib";
import { IProps } from "./types";

/**
 * Pulsing placeholder block used while data is loading. Renders `count`
 * blocks of `width` × `height` pixels (width defaults to 100%).
 *
 * @example
 * <Skeleton width={120} height={20} color="MAIN" />
 */
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
