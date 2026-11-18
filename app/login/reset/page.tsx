import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/auth";
import { Footer } from "@/components/Footer";
import { PageEffects } from "@/components/PageEffects";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset password — PETZ",
  description: "Choose a new password for your PETZ account.",
};

export default async function ResetPasswordPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/account");
  }

  return (
    <div className="page-wrapper">
      <main className="auth-screen">
        <div className="auth-wrap">
          <Suspense>
            <ResetPasswordForm />
          </Suspense>
          <p className="auth-legal">
            By continuing you agree to our <Link href="/privacy">Privacy Policy</Link> and{" "}
            <Link href="/terms">Terms</Link>.
          </p>
        </div>
      </main>
      <Footer />
      <PageEffects />
    </div>
  );
}
