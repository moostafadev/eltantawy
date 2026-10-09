"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const shimmerPlaceholder = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160"><defs><linearGradient id="s" x1="-100%" x2="0%"><stop offset="0" stop-color="#f4e5e5"/><stop offset=".45" stop-color="#fffafa"/><stop offset=".7" stop-color="#f4e5e5"/><animate attributeName="x1" values="-100%;100%" dur="1.6s" repeatCount="indefinite"/><animate attributeName="x2" values="0%;200%" dur="1.6s" repeatCount="indefinite"/></linearGradient></defs><rect width="240" height="160" fill="url(#s)"/></svg>',
)}`;

const LoadingImage = ({ alt, className, onLoad, ...props }: ImageProps) => {
  const [loadedSrc, setLoadedSrc] = useState<ImageProps["src"]>();
  const placeholder = props.placeholder ?? "blur";

  return (
    <Image
      {...props}
      alt={alt}
      className={`${className ?? ""} loading-image`.trim()}
      data-loaded={loadedSrc === props.src}
      onLoad={(event) => {
        setLoadedSrc(props.src);
        onLoad?.(event);
      }}
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
