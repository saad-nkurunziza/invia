"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/actions/entry";
import { useState } from "react";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { TrashIcon } from "lucide-react";

const DeleteButton = ({ userId }: { userId: string }) => {
  const [returnMsg, setReturnMsg] = useState("");
  const [title, setTitle] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDelete = async () => {
    const { status, msg } = await deleteUser(userId);

    if (status === "success") {
      setTitle("Success");
      setReturnMsg(msg);
      setIsSuccess(true);
    } else {
      setTitle("Error");
      setReturnMsg(msg);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          size="sm"
          className="bg-destructive hover:bg-destructive/80 text-destructive-foreground flex items-center"
        >
          <TrashIcon className="mr-2 h-4 w-4" />
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || "Are you sure?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {returnMsg ||
              "This action cannot be undone. Do you really want to delete this user?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setReturnMsg("");
              setIsSuccess(false);
            }}
          >
            {isSuccess ? "Ok" : "Cancel"}
          </AlertDialogCancel>
          {!(isSuccess || title === "Error") && (
            <Button onClick={handleDelete}>Delete</Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
