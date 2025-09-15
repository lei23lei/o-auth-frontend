import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { nextAuthCallback, saveTokenToStorage } from "@/services/auth";

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
          console.log("Starting GitHub OAuth callback for:", user.email);

          // Call your backend to create/update the user and get JWT token
          const response = await nextAuthCallback(
            user.email!,
            user.name || undefined,
            user.image || undefined,
            "github",
            account.providerAccountId || undefined,
            (profile as any)?.login || undefined
          );

          console.log("Backend response:", response);

          // Store the JWT token from backend
          if (response.data.token?.access_token) {
            saveTokenToStorage(response.data.token.access_token);
            console.log("JWT token stored for GitHub user:", user.email);
            console.log(
              "Token preview:",
              response.data.token.access_token.substring(0, 20) + "..."
            );
          } else {
            console.error("No JWT token received from backend:", response);
            console.error(
              "Response structure:",
              JSON.stringify(response, null, 2)
            );
          }

          console.log("GitHub user synced with backend:", user.email);
          return true;
        } catch (error) {
          console.error("Failed to sync GitHub user with backend:", error);
          console.error("Error details:", error);
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
