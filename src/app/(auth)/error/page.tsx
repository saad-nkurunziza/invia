import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold text-destructive-foreground">Error</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Something went wrong. Please try again.
      </p>
      <Link href="/login" className="mt-6 text-primary hover:underline">
        Go back to Login
      </Link>
    </div>
  );
};

export default page;
