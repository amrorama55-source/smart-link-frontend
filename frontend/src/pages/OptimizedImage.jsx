// src/components/OptimizedImage.jsx
import { useState } from 'react';

export default function OptimizedImage({ src, alt, ...props }) {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className="relative">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        decoding="async"
        {...props}
        className={`transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'} ${props.className}`}
      />
    </div>
  );
}