"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
export default function SignupFormDemo() {
  
  const router = useRouter();
  
  const[firstname, setFirstname] = useState("")
  const[lastname, setLastname] = useState("")
  const[email, setEmail] = useState("")
  const[password, setPassword] = useState("")

  const handlePassword = (e) => { 
    setPassword(e.target.value)
  }

  const handleFirstname = (e) => { 
    setFirstname(e.target.value)
  }
  const handleLastname = (e) => { 
    setLastname(e.target.value)
  }
  const handleEmail = (e) => { 
    setEmail(e.target.value)
  }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
  
    if (!firstname || !lastname || !email || !password) {
      alert("Please fill all the fields");
      return;
    }
  
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstname, lastname, email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Signup Successful: ", data);
        router.push("/otp");
      } else {
        console.log("Signup Failed: ", data.error);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  

  return (
    <div className="mt-20 max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black text-white">
      <h2 className="font-bold text-xl text-white dark:text-neutral-200">
        Welcome to Book Mahal
      </h2>
      <p className="text-sm text-neutral-400 dark:text-neutral-600">
        Where you will find the great books to match your taste and can even upload books links for others to read.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label 
              className="text-white"
              htmlFor="firstname">First name</Label>
            <Input id="firstname" placeholder="Tyler" type="text"
              value={firstname}
              onChange={handleFirstname} />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label 
            className="text-white"
            htmlFor="lastname">Last name</Label>
            <Input id="lastname" placeholder="Durden" type="text" 
              value={lastname}
              onChange={handleLastname}/>
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label 
            className="text-white"
            htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="projectmayhem@fc.com" type="email" 
            value={email}
            onChange={handleEmail}/>
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label 
            className="text-white"
            htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" 
            value={password}
            onChange={handlePassword}/>
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign up &rarr;
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
