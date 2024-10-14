"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const ContinueWithGithub = () => {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn("github");
    setLoading(false);
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleSignIn}
      disabled={loading}
    >
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          <GitHubLogoIcon className="mr-2 h-4 w-4" />
          Continue with Github
        </>
      )}
    </Button>
  );
};

export default ContinueWithGithub;
