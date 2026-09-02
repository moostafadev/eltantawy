import { CardProps } from "./types";

/**
 * Plain bordered surface (`border` + `bg-background` + `shadow-sm`) used
 * as the base container for content blocks across the app.
 *
 * @example
 * <Card className="p-4">Content</Card>
 */
const Card = ({ children, className = "", ...props }: CardProps) => {
  return (
    <div
      {...props}
      className={`border border-border bg-background shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
