import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const exploreLinks = [
  {
    title: "Tokens",
    description: "Explore available tokens.",
    href: "/explore/tokens",
  },
  {
    title: "Faucets",
    description: "Request test tokens for trading.",
    href: "/explore/faucets",
  },
  {
    title: "Faucet Transactions",
    description: "View faucet transaction history.",
    href: "/explore/faucet-history",
  },
  {
    title: "All Pools",
    description: "Explore available liquidity pools.",
    href: "/explore/pools",
  },
];

const tradeLinks = [
  {
    title: "Swap",
    description: "Exchange tokens instantly.",
    href: "/swap",
  },
  {
    title: "Send",
    description: "Transfer tokens.",
    href: "/send",
  },
  {
    title: "Transactions",
    description: "View recent transactions.",
    href: "/trade/history",
  },
];

const poolLinks = [
  {
    title: "All Pools",
    description: "Explore available liquidity pools.",
    href: "/explore/pools",
  },
  {
    title: "Add Liquidity",
    description: "Deposit tokens to pool",
    href: "/pools/add",
  },
  {
    title: "Remove Liquidity",
    description: "Withdraw tokens from pool",
    href: "/pools/remove",
  },
  {
    title: "My Positions",
    description: "Manage your liquidity positions.",
    href: "/pools/positions",
  },
];

export const Navigation = () => {
  return (
    <>
      <NavigationDesktopView />
      <NavigationMobileView />
    </>
  );
};

const NavigationDesktopView = () => {
  return (
    <NavigationMenu className="hidden md:flex" delayDuration={0} viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-base">Explore</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[250px] gap-4">
              <li>
                {exploreLinks.map(({ title, description, href }) => (
                  <NavigationMenuLink key={uuidv4()} asChild>
                    <Link href={href}>
                      <div className="font-medium">{title}</div>
                      <div className="text-muted-foreground">{description}</div>
                    </Link>
                  </NavigationMenuLink>
                ))}
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-base">Trade</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[250px] gap-4">
              <li>
                {tradeLinks.map(({ title, description, href }) => (
                  <NavigationMenuLink key={uuidv4()} asChild>
                    <Link href={href}>
                      <div className="flex items-center gap-2 font-medium">{title}</div>
                      <div className="text-muted-foreground">{description}</div>
                    </Link>
                  </NavigationMenuLink>
                ))}
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-base">Pools</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[250px] gap-4">
              <li>
                {poolLinks.map(({ title, description, href }) => (
                  <NavigationMenuLink key={uuidv4()} asChild>
                    <Link href={href}>
                      <div className="font-medium">{title}</div>
                      <div className="text-muted-foreground">{description}</div>
                    </Link>
                  </NavigationMenuLink>
                ))}
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const NavigationMobileView = () => {
  return (
    <NavigationMenu className="md:hidden" delayDuration={0}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-base">Menu</NavigationMenuTrigger>
          <NavigationMenuContent className="space-y-2 px-4">
            <div className="w-40">
              <h2 className="text-primary text-lg font-semibold">Explore</h2>
              {exploreLinks.map(({ title, href }) => (
                <NavigationMenuLink className="pl-4" key={uuidv4()} asChild>
                  <Link href={href} className="font-medium">
                    {title}
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>

            <div className="w-40">
              <h2 className="text-primary text-lg font-semibold">Trade</h2>
              {tradeLinks.map(({ title, href }) => (
                <NavigationMenuLink className="pl-4" key={uuidv4()} asChild>
                  <Link href={href} className="font-medium">
                    {title}
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>

            <div className="w-40">
              <h2 className="text-primary text-lg font-semibold">Pools</h2>
              {poolLinks.map(({ title, href }) => (
                <NavigationMenuLink className="pl-4" key={uuidv4()} asChild>
                  <Link href={href} className="font-medium">
                    {title}
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
