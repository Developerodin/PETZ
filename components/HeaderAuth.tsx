"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { UserAvatar } from "./UserAvatar";

export function HeaderAuth({ compact = false }: { compact?: boolean }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    if (compact) return null;
    return <span className="header-auth-placeholder" aria-hidden="true" />;
  }

  if (session?.user) {
    const label = session.user.name ? `${session.user.name}'s account` : "My account";
    return (
      <Link className="header-auth-link" href="/account" aria-label={label}>
        <UserAvatar name={session.user.name} email={session.user.email} image={session.user.image} size={36} />
      </Link>
    );
  }

  if (compact) return null;

  return (
    <Link className="header-auth-signin" href="/login">
      Sign in
    </Link>
  );
}
