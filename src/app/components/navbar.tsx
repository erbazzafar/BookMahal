"use client";

import React from "react";
import { IconHome, IconUser, IconUserPlus} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { FloatingNav } from "@/components/ui/floating-navbar";


export function Navbar() {
  const { data: session } = useSession(); // Get authentication status

  const navItems = session
    ? [
        {
          name: "Home",
          link: "/",
          icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
        {
          name: "Profile",
          link: "/profile",
          icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
      ]
    : [
        {
          name: "Home",
          link: "/",
          icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
        {
          name: "Sign Up",
          link: "/signup",
          icon: <IconUserPlus className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
      ];

  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} />
    </div>
  );
}

const DummyContent = () => {
    return (
      <div className="grid grid-cols-1 h-[40rem] w-full bg-white dark:bg-black relative border border-neutral-200 dark:border-white/[0.2] rounded-md">
        <p className="dark:text-white text-neutral-600 text-center text-4xl mt-40 font-bold">
          Scroll back up to reveal Navbar
        </p>
        <div className="inset-0 absolute bg-grid-black/[0.1] dark:bg-grid-white/[0.2]" />
      </div>
    );
  };