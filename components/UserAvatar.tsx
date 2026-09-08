"use client";

import { getInitials } from "@/lib/user-display";
import { useState } from "react";

export function UserAvatar({
  name,
  email,
  image,
  size = 32,
  className = "",
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials = getInitials(name, email);
  const showImage = Boolean(image) && !failed;

  return (
    <span className={`user-avatar ${className}`.trim()} style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {showImage ? (
        <img src={image!} alt="" width={size} height={size} onError={() => setFailed(true)} />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </span>
  );
}
