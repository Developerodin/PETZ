"use client";

export default function AccountError() {
  return (
    <section className="section account-screen">
      <div className="container">
        <div className="account-wrap">
          <div className="account-card account-profile">
            <div>
              <h1>This page couldn&apos;t load</h1>
              <p className="account-email">A connection error occurred. Reload to try again.</p>
              <a className="button is-primary account-reload" href="/account">
                <span className="button-hover"></span>
                <span className="button-label">Reload</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
