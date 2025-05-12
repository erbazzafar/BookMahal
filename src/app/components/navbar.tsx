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
