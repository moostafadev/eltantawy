import Image, { type ImageProps } from "next/image";

const shimmerPlaceholder = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160"><defs><linearGradient id="s"><stop offset="0" stop-color="#f4e5e5"/><stop offset=".45" stop-color="#fffafa"/><stop offset=".7" stop-color="#f4e5e5"/><animate attributeName="x1" values="-1;1" dur="1.5s" repeatCount="indefinite"/><animate attributeName="x2" values="0;2" dur="1.5s" repeatCount="indefinite"/></linearGradient></defs><rect width="240" height="160" fill="url(#s)"/></svg>',
)}`;

const LoadingImage = ({ alt, ...props }: ImageProps) => {
  const placeholder = props.placeholder ?? "blur";

  return (
    <Image
      {...props}
      alt={alt}
      placeholder={placeholder}
      blurDataURL={
        placeholder === "blur"
          ? (props.blurDataURL ?? shimmerPlaceholder)
          : props.blurDataURL
      }
    />
  );
};

export default LoadingImage;
