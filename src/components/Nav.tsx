"use client";
import React from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MakeSaleTransaction from "./MakeSaleTransaction";
import { usePathname } from "next/navigation";
import { SwatchIcon } from "@heroicons/react/24/outline";
import MakePurchaseTransaction from "./MakePurchaseTransaction";
import { Badge } from "./ui/badge";
import { links, quickLinks } from "@/utils/constants";
import { Product } from "@prisma/client";

const Navbar = ({
  products,
  low_stock_count,
}: {
  products: Product[];
  low_stock_count: number | null;
}) => {
  const currentPath = usePathname();
  return (
    <nav className="p-3 w-full flex flex-col flex-wrap">
      <ul className="flex flex-col space-y-1">
        {links.map((link) => {
          const isActive =
            (currentPath.includes(link.path) && link.path.length > 1) ||
            currentPath === link.path;
          return (
            link.visible && (
              <Link
                href={link.path}
                key={link.name}
                className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-none ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary/80"
                }`}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.name}
                {link.isExtended ? (
                  <div className="relative ml-auto flex h-5 w-5">
                    <div className="absolute animate-ping w-full h-full inline-flex rounded-full bg-destructive/30"></div>
                    <Badge
                      variant={"destructive"}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center`}
                    >
                      {low_stock_count === null ? (
                        <span className="">!</span>
                      ) : (
                        <span className="">{low_stock_count}</span>
                      )}
                    </Badge>
                  </div>
                ) : null}
              </Link>
            )
          );
        })}

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border-0">
            <AccordionTrigger className="hover:no-underline py-0">
              <div className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-muted-foreground transition-all hover:text-primary">
                <SwatchIcon className="h-4 w-4" />
                Quick Links
              </div>
            </AccordionTrigger>
            <AccordionContent className="border-muted-foreground/50 border-l grid items-start my-2 mx-2 text-sm gap-1.5 lg:mx-4 pb-0">
              {quickLinks.map((link) => {
                const isActive =
                  (currentPath.includes(link.path) && link.path.length > 1) ||
                  currentPath === link.path;
                if (!link.visible) return null;

                if (link.name === "Make Sale Transaction") {
                  return (
                    <MakeSaleTransaction
                      key={link.name}
                      products={products}
                      isLink
                      className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-none ${
                        isActive
                          ? "text-primary "
                          : "text-muted-foreground hover:text-primary/80"
                      }`}
                    />
                  );
                }
                if (link.name === "Make Purchase Transaction") {
                  return (
                    <MakePurchaseTransaction
                      key={link.name}
                      products={products}
                      isLink
                      className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-none ${
                        isActive
                          ? "text-primary "
                          : "text-muted-foreground hover:text-primary/80"
                      }`}
                    />
                  );
                }

                return (
                  <Link
                    href={link.path}
                    key={link.name}
                    className={`flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-none ${
                      isActive
                        ? "text-primary "
                        : "text-muted-foreground hover:text-primary/80"
                    }`}
                  >
                    {link.icon && <link.icon className="h-4 w-4" />}
                    {link.name}
                  </Link>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ul>
    </nav>
  );
};

export default Navbar;
