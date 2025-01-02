"use client";

import React, { useState } from "react";
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
import { UserOptions } from "jspdf-autotable";
import { format } from "date-fns";

interface DataTableExportOptionsProps<TData> {
  table: Table<TData>;
  title: string;
}

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}

export function DataTableExportOptions<TData>({
  table,
  title,
}: DataTableExportOptionsProps<TData>) {
  const [rowCount, setRowCount] = useState<number>(10);
  const [iconState, setIconState] = useState<"file" | "loader" | "check">(
    "file"
  );

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

  const exportToPDF = async () => {
    setIconState("loader");

    const doc = new jsPDF() as jsPDFCustom;

    const rowCols = table
      .getAllColumns()
      .filter((column) => column.getIsVisible())
      .map((column) => column.id);

    const columnsForPDF = rowCols.map((col) =>
      col
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );

    const rowsForPDF = table
      .getRowModel()
      .rows.slice(0, rowCount)
      .map((row) =>
        rowCols.map((colId) => {
          const value = row.getValue(colId);
          if (colId === "created_at" && value) {
            return format(new Date(value as Date), "dd-MM-yyyy");
          }
          if (colId === "type" && value) {
            if (typeof value === "string") {
              return value
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
            }
            return String(value);
          }
          if (typeof value === "string") {
            return value.charAt(0).toUpperCase() + value.slice(1);
          }
          return value;
        })
      );

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Business Name", 14, 16);
    doc.setTextColor(0, 0, 0);
    doc.text(title, 14, 30);

    doc.autoTable({
      head: [columnsForPDF],
      //@ts-expect-error Lkdd
      body: rowsForPDF,
      startY: 40,
      theme: "striped",
      styles: {
        fillColor: [245, 245, 245],
        fontSize: 11,
      },
      headStyles: {
        fillColor: [50, 50, 50],
        textColor: [255, 255, 255],
        fontSize: 11,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      tableWidth: "auto",
      margin: { left: 14, right: 14 },
    });
    doc.setTextColor(150);
    doc.text("© Invia", 6, doc.internal.pageSize.height - 10);

    doc.save(`${title}.pdf`);
    setTimeout(() => setIconState("check"), 3000);
    setTimeout(() => setIconState("file"), 1000);
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
