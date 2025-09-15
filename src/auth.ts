import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { nextAuthCallback } from "@/services/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only handle GitHub OAuth
      if (account?.provider === "github") {
        try {
          // Call your backend to create/update the user
          await nextAuthCallback(
            user.email!,
            user.name || undefined,
            user.image || undefined,
            "github",
            account.providerAccountId || undefined,
            (profile as any)?.login || undefined
          );

          console.log("GitHub user synced with backend:", user.email);
          return true;
        } catch (error) {
          console.error("Failed to sync GitHub user with backend:", error);
          // You can choose to return false to prevent sign-in
          // or return true to allow sign-in even if backend sync fails
          return true;
        }
      }

      return true;
    },
    async session({ session, token }) {
      // You can add additional session data here if needed
      return session;
    },
  },
});
