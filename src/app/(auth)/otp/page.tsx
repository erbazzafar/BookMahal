"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";

export default function OTPPage() {
    const router = useRouter();
    const [otp, setOtp] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    // Handle OTP input change
    const handleOTPChange = (value: string) => {
        setOtp(value);
    };

    // Handle OTP submission
    const verifyOTP = async () => {
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP.");
            return;
        }

        setLoading(true);

        try {
              const response = await fetch("/api/otp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, otp })
          });

            const data = await response.json();

            if (response.ok) {
                toast.success("OTP verified successfully!", {
                    description: "Redirecting to login...",
                });
                setTimeout(() => router.push("/login"), 2000);
            } else {
                toast.error(data.error || "Invalid OTP. Please try again.");
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen ">
            <div className="bg-black max-w-4xl mx-auto flex flex-col items-center justify-center h-[350px] space-y-6 border-4 border-gray-300 shadow-2xl p-8 rounded-lg">
                <h1 className=" text-xl font-semibold text-gray-200 dark:text-white">
                    Enter OTP sent to your Email
                </h1>

                {/* Input for email */}
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg shadow-lg bg-white dark:bg-black w-full"
                />

                {/* OTP Input */}
                <InputOTP className="bg-white border border-gray-300 dark:border-gray-600 p-4 rounded-lg shadow-lg dark:bg-black" maxLength={6} value={otp} onChange={handleOTPChange}>
                    <InputOTPGroup className="flex space-x-2">
                        {[0, 1, 2].map((i) => (
                            <InputOTPSlot key={i} className="text-white w-12 h-12 border border-gray-400 rounded-md text-center text-xl" index={i} />
                        ))}
                    </InputOTPGroup>

                    <InputOTPSeparator className="mx-2 text-lg" />

                    <InputOTPGroup className="flex space-x-2">
                        {[3, 4, 5].map((i) => (
                            <InputOTPSlot key={i} className="text-white w-12 h-12 border border-gray-400 rounded-md text-center text-xl" index={i} />
                        ))}
                    </InputOTPGroup>
                </InputOTP>

                {/* Verify OTP Button */}
                <button onClick={verifyOTP} disabled={loading} className="cursor-pointer w-full bg-gray-600 text-white p-3 rounded-md shadow-lg hover:bg-gray-700">
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>
            </div>
        </div>
    );
}
