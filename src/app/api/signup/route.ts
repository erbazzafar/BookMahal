import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("Connecting to DB...");
    await dbConnect();

    const { firstname, lastname, email, password } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        if (existingUser.isVerified){
            return NextResponse.json( 
                {error: "User is already Verified"},
                {status: 400}
            )
        }
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    //creating OTP

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("otp: ", otp);
    const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes from now
    

    // Create a new user
    const newUser = new User({
      firstname,
      lastname,
      email,
      password,
      otp,
      otpExpiresAt,
      isVerified: false
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User Successfully Signed Up" },
      { status: 201 } 
    );
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
