import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React from "react";
import Crumbs from "@/components/crumbs";
import { fetchSettings, fetchUsers } from "@/actions/query";
import { saveStockName, saveThresholdMargin } from "@/actions/entry";

import SubmitButton from "@/components/SubmitButton";
import DeleteButton from "./delete_button";

const page = async () => {
  const crumbsLinks = [
    { label: "Dashboard", href: "/" },
    { label: "Settings" },
  ];
  const settings = await fetchSettings();
  if (!settings) return null;
  const initial_stock_name = settings.find(
    (p) => p.key === "stock_name"
  )?.value;
  const initial_threshold_margin = settings.find(
    (p) => p.key === "threshold_margin"
  )?.value;
  const allUsers = await fetchUsers();
  return (
    <div className="flex min-h-screen gap-6 md:gap-8 p-0 md:p-4 sm:px-6 sm:py-0 w-full flex-col">
      <Crumbs crumbs={crumbsLinks} />
      <Tabs
        defaultValue="general"
        className="grid w-full max-w-6xl items-start gap-8 md:grid-cols-[180px_1fr]"
      >
        <TabsList className="flex md:flex-col justify-start md:gap-3 md:items-start md:border-none">
          <TabsTrigger value="general">General</TabsTrigger>
          {allUsers !== null && <TabsTrigger value="users">Users</TabsTrigger>}
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock name</CardTitle>
                <CardDescription>Used to identify your stock.</CardDescription>
              </CardHeader>
              <form action={saveStockName}>
                <CardContent>
                  <Input
                    name="stock_name"
                    defaultValue={initial_stock_name || "Invia"}
                  />
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <SubmitButton />
                </CardFooter>
              </form>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Threshold margin</CardTitle>
                <CardDescription>
                  Your minimum product stock value.
                </CardDescription>
              </CardHeader>
              <form action={saveThresholdMargin}>
                <CardContent>
                  <Input
                    name="threshold_margin"
                    type="number"
                    defaultValue={initial_threshold_margin || "0"}
                  />
                  <p className="text-[0.8rem] block mt-2 text-muted-foreground">
                    Enter the lowest manageable stock value
                  </p>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <SubmitButton />
                </CardFooter>
              </form>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="users">
          {allUsers !== null && (
            <div className="flex flex-col gap-4">
              {Array.isArray(allUsers) ? (
                allUsers.length > 0 ? (
                  allUsers.map((user) => (
                    <div
                      className="py-2.5 px-4 bg-card border flex max-w-xl justify-between w-full rounded-xl"
                      key={user.id}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold mb-1">{user.name}</span>
                        <div className="text-sm text-muted-foreground">
                          Transaction Log: {user._count.Activity}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Activities Log: {user._count.Log}
                        </div>
                      </div>
                      <DeleteButton userId={user.id} />
                    </div>
                  ))
                ) : (
                  <div>No users</div>
                )
              ) : (
                <div>{allUsers.msg || "No access."}</div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
