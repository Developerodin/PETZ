import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/auth";
import { Footer } from "@/components/Footer";
import { LoginForm } from "@/components/LoginForm";
import { PageEffects } from "@/components/PageEffects";

export const metadata: Metadata = {
  title: "Sign in — PETZ",
  description: "Sign in or create a PETZ account with Google or email to save pet profiles and assessment history.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; mode?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/account";

  if (session?.user) {
    redirect(callbackUrl.startsWith("/") ? callbackUrl : "/account");
  }

  return (
    <div className="page-wrapper">
      <main className="auth-screen">
        <div className="auth-wrap">
          <p className="auth-emergency">
            If your pet may be having an emergency, don&apos;t wait for us — contact the nearest open veterinary clinic now.
          </p>
          <p className="auth-promo">
            Sign in to assess your pet, save profiles, and track health insights over time.
          </p>
          <Suspense>
            <LoginForm callbackUrl={callbackUrl} />
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
