"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button, XchangeoLogo } from "@/components/ui";

import { Navigation } from "./navigation";

export const Header = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full py-2 transition-all duration-300 ${scrollY > 50 ? "border-foreground/10 bg-background/80 border-b backdrop-blur-md" : "bg-transparent"}`}
    >
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <XchangeoLogo isFull textClass="hidden md:block" />
            </Link>
            <Navigation />
          </div>
          <div>
            <Button className="font-semibold">
              <Link href="/swap">Start Trading</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
