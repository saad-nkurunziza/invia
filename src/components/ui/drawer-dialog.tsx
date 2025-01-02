"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface BaseProps {
  children: React.ReactNode;
}

interface RootDrawerDialogProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DrawerDialogProps extends BaseProps {
  className?: string;
  asChild?: boolean;
}

const DrawerDialog = ({ children, ...props }: RootDrawerDialogProps) => {
  const isMobile = useIsMobile();
  const Component = isMobile ? Drawer : Dialog;

  return <Component {...props}>{children}</Component>;
};

const DrawerDialogTrigger = ({
  className,
  children,
  ...props
}: DrawerDialogProps) => {
  const isMobile = useIsMobile();
  const TriggerComponent = isMobile ? DrawerTrigger : DialogTrigger;

  return (
    <TriggerComponent className={className} {...props}>
      {children}
    </TriggerComponent>
  );
};

const DrawerDialogClose = ({
  className,
  children,
  ...props
}: DrawerDialogProps) => {
  const isMobile = useIsMobile();
  const CloseComponent = isMobile ? DrawerClose : DialogClose;

  return (
    <CloseComponent className={className} {...props}>
      {children}
    </CloseComponent>
  );
};

const DrawerDialogContent = ({
  className,
  children,
  ...props
}: DrawerDialogProps) => {
  const isMobile = useIsMobile();
  const ContentComponent = isMobile ? DrawerContent : DialogContent;

  return (
    <ContentComponent className={className} {...props}>
      {children}
    </ContentComponent>
  );
};

const DrawerDialogDescription = ({
  className,
  children,
  ...props
}: DrawerDialogProps) => {
  const isMobile = useIsMobile();
  const DescriptionComponent = isMobile ? DrawerDescription : DialogDescription;

  return (
    <DescriptionComponent className={className} {...props}>
      {children}
    </DescriptionComponent>
  );
};

const DrawerDialogHeader = ({
  className,
  children,
  ...props
}: DrawerDialogProps) => {
  const isMobile = useIsMobile();
  const HeaderComponent = isMobile ? DrawerHeader : DialogHeader;

  return (
    <HeaderComponent className={className} {...props}>
      {children}
    </HeaderComponent>
  );
};

const DrawerDialogTitle = ({
  className,
  children,
  ...props
}: DrawerDialogProps) => {
  const isMobile = useIsMobile();
  const TitleComponent = isMobile ? DrawerTitle : DialogTitle;

  return (
    <TitleComponent className={className} {...props}>
      {children}
    </TitleComponent>
  );
};

const DrawerDialogBody = ({
  className,
  children,
  ...props
}: DrawerDialogProps) => {
  return (
    <div className={cn("px-4 md:px-0", className)} {...props}>
      {children}
    </div>
  );
};

const DrawerDialogFooter = ({
  className,
  children,
  ...props
}: DrawerDialogProps) => {
  const isMobile = useIsMobile();
  const FooterComponent = isMobile ? DrawerFooter : DialogFooter;

  return (
    <FooterComponent className={className} {...props}>
      {children}
    </FooterComponent>
  );
};

export {
  DrawerDialog,
  DrawerDialogTrigger,
  DrawerDialogClose,
  DrawerDialogContent,
  DrawerDialogDescription,
  DrawerDialogHeader,
  DrawerDialogTitle,
  DrawerDialogBody,
  DrawerDialogFooter,
};
