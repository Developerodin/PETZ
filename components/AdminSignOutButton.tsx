"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminSignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin");
      router.refresh();
      setPending(false);
    }
  }

  return (
    <button className="admin-signout" type="button" onClick={onClick} disabled={pending}>
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
