import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/option";

export async function POST (req: Request) {
    try {
        await dbConnect()

        const {email, password} = await req.json()

        const user = await User.findOne({email}) ;
        if (!user) {
            return NextResponse.json({error: "Invalid Credentials"}, {status: 400})
        }

        if (password != user.password){
            return NextResponse.json({error: "Incorrect Password"}, {status: 400})
        }

        //un-comment after building next-auth/options.ts
        const result = await NextAuth(authOptions)

        console.log("The result for SignIn with next-auth is :", result?.status);
        if (result?.error){
            return NextResponse.json ({error: "Login Failed"}, {status: 401})
        }
        else
        {
            return NextResponse.json({message: "Login Successful for ", user: {email: user.email}}, {status: 200})
        }
        

    } catch (error) {
        console.log("Login Error: ", error);
        return NextResponse.json({error: "Server Error"}, {status: 500})
    }

}