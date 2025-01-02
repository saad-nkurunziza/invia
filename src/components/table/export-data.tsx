"use client";

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { File, Loader, Check } from "lucide-react";
import { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface DataTableExportOptionsProps<TData> {
  table: Table<TData>;
  title: string;
}

export function DataTableExportOptions<TData>({
  table,
  title,
}: DataTableExportOptionsProps<TData>) {
  const [rowCount, setRowCount] = useState<number>(10);
  const [iconState, setIconState] = useState<"file" | "loader" | "check">(
    "file"
  );

  useEffect(() => {
    if (iconState === "loader") {
      const loaderTimer = setTimeout(() => setIconState("check"), 3000);
      return () => clearTimeout(loaderTimer);
    } else if (iconState === "check") {
      const checkTimer = setTimeout(() => setIconState("file"), 2000);
      return () => clearTimeout(checkTimer);
    }
  }, [iconState]);

  const getIcon = () => {
    switch (iconState) {
      case "loader":
        return <Loader className="h-3.5 w-3.5 animate-spin mr-2" />;
      case "check":
        return <Check className="h-3.5 w-3.5 mr-2" />;
      default:
        return <File className="h-3.5 w-3.5 mr-2" />;
    }
  };

  const exportToPDF = () => {
    setIconState("loader");
    const doc = new jsPDF();
    const columnsForPDF = table
      .getAllColumns()
      .filter((column) => column.getIsVisible())
      .map((column) =>
        column.id
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      );

    const rowsForPDF = table
      .getRowModel()
      .rows.slice(0, rowCount)
      .map((row) => columnsForPDF.map((colId) => row.getValue(colId)));

    //@ts-expect-error: Ignoring type error due to third-party library incompatibility
    doc.autoTable({
      head: [columnsForPDF],
      body: rowsForPDF,
      margin: { top: 20 },
    });

    const today = new Date().toISOString().split("T")[0];
    doc.save(`${title}_${today}.pdf`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="h-7 gap-1">
          <File className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Export
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-1.5">
          <Label htmlFor="rowCount" className="block mb-1 text-sm">
            Rows:
          </Label>
          <Select
            value={String(rowCount)}
            onValueChange={(value) => setRowCount(Number(value))}
          >
            <SelectTrigger id="status" onClick={(e) => e.stopPropagation()}>
              <SelectValue placeholder="Select a product status" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((count) => (
                <SelectItem key={count} value={String(count)}>
                  {count}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DropdownMenuSeparator />
        <Button
          className="w-full"
          variant="secondary"
          size="sm"
          onClick={exportToPDF}
        >
          {getIcon()}
          {iconState === "loader"
            ? "Exporting..."
            : iconState === "check"
            ? "Done"
            : "Export to PDF"}
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
