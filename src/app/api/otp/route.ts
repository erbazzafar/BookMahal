import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email, otp } = await req.json();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ message: "User already verified" }, { status: 200 });
        }

        if (user.otp !== otp || new Date() > user.otpExpiresAt) {
            return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
        }

        // ✅ Update isVerified and clear OTP fields
        user.isVerified = true;
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        return NextResponse.json({ message: "OTP verified successfully, user is now verified" }, { status: 200 });

    } catch (error) {
        console.log("Error verifying OTP:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
