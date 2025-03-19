// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ALLOWED_EMAIL = process.env.ALLOWED_EMAIL;

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("signIn callback triggered. user:", user); // Добавили логи
      // Only allow a specific email to sign in
      return user.email === ALLOWED_EMAIL;
    },
    async session({ session, token }) {
       console.log("session callback triggered. session", session); //Добавили логи
      // Add the user's email to the session for checking in components
      session.isAllowed = session.user.email === ALLOWED_EMAIL;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
