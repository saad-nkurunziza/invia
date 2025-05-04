import { links } from "@/utils/constants";
import Link from "next/link";
import React from "react";

const BottomNav = () => {
  return (
    <div className="fixed backdrop-blur-xs bottom-0 flex md:hidden h-12 items-center gap-4 border-t bg-muted/40 px-4 w-dvw">
      <div className="flex justify-around w-full">
        {links.map((link) => (
          <Link
            key={link.name}
            className="nav-item flex flex-col items-center p-2"
            href={link.path}
          >
            <link.icon className="w-5 h-5" />
            <span className="sr-only">{link.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
