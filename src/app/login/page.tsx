"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Form } from "@/components/auth/form";
import { getCurrentUser, getTokenFromStorage } from "@/services/auth";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!getTokenFromStorage(), // Only run if token exists
    retry: false,
  });

  useEffect(() => {
    const token = getTokenFromStorage();
    if (!token) {
      setHasCheckedAuth(true);
    }
  }, []);

  useEffect(() => {
    if (userData && !error) {
      // User is already logged in, redirect to home
      router.push("/");
    }
  }, [userData, error, router]);

  // Show loading while checking authentication
  if (!hasCheckedAuth || isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-blue-400 to-pink-200">
        <div className="text-white text-lg">Checking authentication...</div>
      </div>
    );
  }

  // Show login form if not logged in
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-400 to-pink-200">
      <Form />
      <div className="mt-6 text-center">
        <p className="text-white text-sm mb-3">Don't have an account?</p>
        <Link
          href="/register"
          className="inline-block px-6 py-2 bg-white text-blue-600 rounded-md font-medium hover:bg-gray-100 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
