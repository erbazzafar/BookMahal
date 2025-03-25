import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"

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
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. "Sign in with...")
          name: "Credentials",
          id: "credentials",
          credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials: any) : Promise<any>{
            await dbConnect()

            try {
             const user = await User.findOne({
                email: credentials.email
              })
              if (!user){
                throw new Error ("No user found with this Email")
              }
              if(!user.isVerified){
                throw new Error("Please Verify your account before login")
              }
              if(credentials.password != user.password){
                throw new Error("Incorrect Password")
              }

              return user;

            } catch (error: any) {
              throw new Error("Error Signing In")
            }
          }
        }),

        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
      ],

      callbacks:{
        async signIn({user, account}) {
          if (account?.provider === "google"){
            await dbConnect()
            const existingUser = await User.findOne({email: user.email})
            if (!existingUser){
              const newUser = new User ({
                email: user.email,
                firstname: user.name,
                lastname: "",
                password: undefined,
                isVerified: true,
                isGoogleUser: true
              })

              await newUser.save()
            }
          } 
          return true  
        },

        async jwt({token, user}){
          if (user){
            token._id = user._id?.toString();
            token.isVerified = user.isVerified;
            token.firstname = user.firstname;
          }

          return token
        },
        async session({session, token}){
          if (token){
            session.user._id = token._id
            session.user.isVerified = token.isVerified
            session.user.firstname = token.firstname
          }
          return session
        }
      },

      pages:{
        signIn: "/login",
        signOut: "/logout"
      },

      session:{
        strategy: "jwt",
      },

      secret: process.env.NEXTAUTH_SECRET_KEY,
      
}
