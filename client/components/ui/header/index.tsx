import Link from "next/link";

import { Button, XchangeoLogo } from "@/components/ui";

import { Navigation } from "./navigation";

export const Header = () => {
  return (
    <header className="bg-sidebar flex items-center justify-between px-4 py-2">
      <div className="flex items-center">
        <Link href="/">
          <XchangeoLogo isFull />
        </Link>
        <Navigation />
      </div>
      <div>
        <Button>Launch App</Button>
      </div>
    </header>
  );
};
