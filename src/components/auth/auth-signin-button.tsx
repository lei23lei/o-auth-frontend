"use client";

import { signInWithGitHub } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export const AuthSigninButton = () => {
  return <Button onClick={signInWithGitHub}>Sign in with GitHub</Button>;
};
