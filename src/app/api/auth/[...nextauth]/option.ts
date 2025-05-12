import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Declare the types for User, Session, and JWT in NextAuth
declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    firstname?: string;
  }

  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      firstname?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    _id?: string;
    isVerified?: boolean;
    firstname?: string;
  }
}

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET_KEY;

if (!clientId || !clientSecret || !nextAuthSecret) {
  throw new Error("Missing required environment variables for authentication.");
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and Password are required");
        }

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this Email");
        }

        if (!user.isVerified) {
          throw new Error("Please Verify your account before login");
        }

        if (credentials.password !== user.password) {
          throw new Error("Incorrect Password");
        }

        return user;
      }
    }),

    GoogleProvider({
      clientId,
      clientSecret
    })
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const newUser = new User({
            email: user.email,
            firstname: user.name,
            lastname: "",
            password: undefined,
            isVerified: true,
            isGoogleUser: true
          });

          await newUser.save();
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.firstname = user.firstname;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        // Type assertion: We know token should be extended JWT
        session.user._id = token._id as string | undefined;
        session.user.isVerified = token.isVerified as boolean | undefined;
        session.user.firstname = token.firstname as string | undefined;
      }
      return session;
    }
  },

  pages: {
    signIn: "/login",
    signOut: "/logout"
  },

  session: {
    strategy: "jwt"
  },

  secret: nextAuthSecret
};