"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getCurrentUser,
  getTokenFromStorage,
  removeTokenFromStorage,
} from "@/services/auth";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [hasCheckedToken, setHasCheckedToken] = useState(false);

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: isLoggedIn, // Only run if we know user is logged in
    retry: false,
  });

  useEffect(() => {
    const token = getTokenFromStorage();
    if (token) {
      setIsLoggedIn(true);
    }
    setHasCheckedToken(true);
  }, []);

  useEffect(() => {
    if (userData) {
      setUser(userData.data);
    }
  }, [userData]);

  // Show loading while checking for token
  if (!hasCheckedToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show not logged in if no token
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Not Logged In
          </h1>
          <p className="text-gray-600">Please log in to access this page</p>
          <a
            href="/login"
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Show loading while fetching user data
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading user data...</div>
      </div>
    );
  }

  // Show error if API call failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h1>
          <p className="text-gray-600">Failed to verify your login status</p>
          <button
            onClick={() => {
              removeTokenFromStorage();
              setIsLoggedIn(false);
              setUser(null);
            }}
            className="mt-4 inline-block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout and Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-blue-400 to-pink-200">
      <div className="max-w-md w-full bg-white/30 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Home!</h1>

        {user && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                User Information
              </h2>
            </div>

            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-600">Email:</span>
                <span className="ml-2 text-gray-800">{user.email}</span>
              </div>

              {user.name && (
                <div>
                  <span className="font-medium text-gray-600">Name:</span>
                  <span className="ml-2 text-gray-800">{user.name}</span>
                </div>
              )}

              <div>
                <span className="font-medium text-gray-600">User ID:</span>
                <span className="ml-2 text-gray-800 font-mono text-sm">
                  {user.id}
                </span>
              </div>

              <div>
                <span className="font-medium text-gray-600">Member since:</span>
                <span className="ml-2 text-gray-800">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={() => {
                  removeTokenFromStorage();
                  setIsLoggedIn(false);
                  setUser(null);
                  window.location.href = "/login";
                }}
                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
