import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "****",
        },
      },
      async authorize(credentials, req) {
        await connectDB();
        const userFound = await User.findOne({
          email: credentials?.email,
        }).select("+password");
        if (!userFound) throw new Error("Invalid credentials");
        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          userFound.password
        );
        if (!passwordMatch) throw new Error("Invalid credentials");
        /*if (!userFound.confirmed)
          throw new Error("User not confirmed. Access denied.");*/
        return userFound;
      },
    }),
  ],
  callbacks: {
    jwt({ account, token, user, profile, session }) {
      if (user) token.user = user;
      return token;
    },
    session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
  pages: { signIn: "/auth" },
});

export { handler as GET, handler as POST };
