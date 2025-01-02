"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useTheme } from "next-themes";
import { FC } from "react";
import { UserRole } from "@prisma/client";

interface PageProps {
  name: string;
  email: string;
  role: UserRole;
}

const UserProfileDropdown: FC<PageProps> = ({ name, email, role }) => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size={"sm"}
          className="rounded-xl flex bg-muted items-center gap-2"
        >
          <h3 className="text-sm leading-3">{name}</h3>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="md:w-64" align="end">
        <DropdownMenuLabel>
          <div className="space-y-2">
            <h5 className="text-xs text-muted-foreground">Logged in as:</h5>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-sm leading-3">{name}</h3>

              <h3 className="text-[10px] text-muted-foreground">{email}</h3>
              <h5 className="text-[10px] text-muted-foreground">{role}</h5>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/features">Features</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="https://wa.me/+250790963467" target="_blank">
            Contact us
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem onClick={() => logout()}>Log out</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
