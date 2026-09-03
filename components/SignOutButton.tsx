"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button className="account-signout" type="button" onClick={() => signOut({ callbackUrl: "/" })}>
      Sign out
    </button>
  );
}
