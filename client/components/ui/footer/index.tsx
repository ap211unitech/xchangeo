import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

import { Button, Theme, XchangeoLogo } from "@/components/ui";

const links = [
  {
    href: "https://github.com/ap211unitech/xchangeo/",
    title: "Github",
  },
  {
    href: "https://arjunporwal.vercel.app/contact",
    title: "Contact",
  },
];

export const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-gray-800 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 flex items-center space-x-2 md:mb-0">
            <Link href="/">
              <XchangeoLogo isFull />
            </Link>
          </div>
          <div className="[&_a]:text-foreground flex items-center [&_a]:text-base">
            {links.map(({ title, href }) => (
              <Button key={uuidv4()} variant="link" className="hover:text-primary" asChild>
                <Link target="_blank" href={href}>
                  {title}
                </Link>
              </Button>
            ))}
            <Theme />
          </div>
        </div>
        <div className="text-muted-foreground mt-8 border-t border-gray-800 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Xchangeo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
