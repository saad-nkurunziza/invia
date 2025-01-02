import React from "react";

import { BreadcrumbItem } from "@/components/ui/breadcrumb";
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CrumbsProps {
  crumbs: BreadcrumbItem[];
}

const Crumbs: React.FC<CrumbsProps> = ({ crumbs }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const i = crumbs;
  return null;
};

export default Crumbs;
