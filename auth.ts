import "@/lib/auth-env";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authConfig from "@/auth.config";
import { findUserByEmail, verifyPassword } from "@/lib/auth-users";
import clientPromise, { getMongoDbName } from "@/lib/mongodb-client";

class InvalidLoginError extends CredentialsSignin {
  code = "invalid_credentials";
}

class GoogleOnlyError extends CredentialsSignin {
  code = "google_account";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise, { databaseName: getMongoDbName() }),
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "").trim().toLowerCase();
        const password = String(credentials?.password || "");
        if (!email || !password) throw new InvalidLoginError();

        const user = await findUserByEmail(email);
        if (!user) throw new InvalidLoginError();
        if (!user.passwordHash) throw new GoogleOnlyError();

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) throw new InvalidLoginError();

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
});
