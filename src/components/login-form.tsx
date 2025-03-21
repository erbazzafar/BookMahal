"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function LoginupFormDemo() {

  const[email, setEmail] = useState("")
  const[password, setPassword] = useState("")

  const router = useRouter()

  const handleEmail= (e) => {
    setEmail(e.target.value)
  }

  const handlePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        toast.error("Enter all fields")
        return
      }

      //manual fetch
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "content-type": "application/json" 
        },
        body: JSON.stringify({email, password})
      })
      console.log("response: ", response.status);
      
      if(response.ok){
        toast.success("Login Succesful")
        router.push("/")
      }
      else {
        console.log("Login Error | Status : 500");
      }
    } catch (error) {
      console.log("Login Error from Client Side: ", error);
      toast.error("Error 404! Please try Again")
    }
  
  };

  
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black text-white">
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email"
            className="text-white">Email Address</Label>
          <Input id="email" placeholder="projectmayhem@fc.com" type="email"
            value={email}
            onChange={handleEmail} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label 
            className="text-white"
            htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" 
            value={password}
            onChange={handlePassword}/>
        </LabelInputContainer>
        <br />
        <button
          className="cursor-pointer text-xl bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Log In  &rarr;
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
