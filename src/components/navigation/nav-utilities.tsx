"use client";

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
// import { SettingsDialog } from "../settings/settings-dialog";
// import { Button } from "../ui/button";

export function NavUtilities({
  utilities,
}: {
  utilities: {
    title: string;
    url?: string;
    icon: LucideIcon;
    isComponent?: boolean;
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Utilities</SidebarGroupLabel>
      <SidebarMenu>
        {utilities.map((item) => {
          // if (item.isComponent) {
          //   return (
          //     <SidebarMenuItem key={item.title}>
          //       <SettingsDialog>
          //         {/* <Button
          //           className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
          //           variant="outline"
          //           size="icon"
          //           aria-label={item.title}
          //         > */}
          //         <>
          //           <item.icon size={16} strokeWidth={2} aria-hidden="true" />
          //           <span>{item.title}</span>
          //         </>
          //         {/* </Button> */}
          //       </SettingsDialog>
          //     </SidebarMenuItem>
          //   );
          // } else {
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <Folder className="text-muted-foreground" />
                    <span>View Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward className="text-muted-foreground" />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
          // }
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
