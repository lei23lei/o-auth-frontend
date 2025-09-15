"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, getTokenFromStorage } from "@/services/auth";

export default function Test() {
  const { data: session, status } = useSession();

  const {
    data: userData,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!getTokenFromStorage(),
    retry: false,
  });

  // Show loading while NextAuth is checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Check if user is authenticated via either NextAuth session OR JWT token
  const isAuthenticated = session || getTokenFromStorage();

  // Show not logged in if no authentication method
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">This is a protected test page</p>
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Protected Test Page
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Authentication Status
          </h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-gray-600">
                NextAuth Session:
              </span>
              <span className="ml-2 text-gray-800">
                {session ? "✅ Active" : "❌ None"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">JWT Token:</span>
              <span className="ml-2 text-gray-800">
                {getTokenFromStorage() ? "✅ Present" : "❌ None"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Auth Method:</span>
              <span className="ml-2 text-gray-800">
                {session ? "GitHub OAuth" : "Email/Password"}
              </span>
            </div>
          </div>
        </div>

        {session && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              NextAuth Session Data
            </h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-600">Email:</span>
                <span className="ml-2 text-gray-800">
                  {session.user?.email}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Name:</span>
                <span className="ml-2 text-gray-800">{session.user?.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Image:</span>
                <span className="ml-2 text-gray-800">
                  {session.user?.image}
                </span>
              </div>
            </div>
          </div>
        )}

        {userData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Backend User Data
            </h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-600">Email:</span>
                <span className="ml-2 text-gray-800">
                  {userData.data.email}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Name:</span>
                <span className="ml-2 text-gray-800">{userData.data.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Provider:</span>
                <span className="ml-2 text-gray-800">
                  {userData.data.provider}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">User ID:</span>
                <span className="ml-2 text-gray-800 font-mono text-sm">
                  {userData.data.id}
                </span>
              </div>
            </div>
          </div>
        )}

        {isLoadingUser && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">Loading backend user data...</p>
          </div>
        )}

        {userError && (
          <div className="bg-red-50 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              Backend Error
            </h2>
            <p className="text-red-600">
              Failed to load user data from backend
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
