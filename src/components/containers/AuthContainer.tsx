"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import { getSession } from "@/lib/auth";

const AuthContainer = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [data, setData] = useState(null);
  const router = useRouter();
  ({ data });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await getSession();
        setData(session);
      } catch (error) {
        console.error(error);
        setData(null);
      }
    };
    fetchData();
    if (data && !pathname.startsWith("/")) {
      router.push("/");
    }
    if (!data && !pathname.startsWith("/auth")) {
      router.push("/auth");
    }
  }, [router, pathname, data]);

  return <Fragment>{children}</Fragment>;
};

export default AuthContainer;
