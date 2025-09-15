"use client";

import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession, signOut } from "next-auth/react";
import {
  getCurrentUser,
  getTokenFromStorage,
  removeTokenFromStorage,
} from "@/services/auth";

export default function Home() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [isLoadingBackend, setIsLoadingBackend] = useState(false);
  const hasAttemptedCallback = useRef(false);

  const {
    data: userData,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!getTokenFromStorage(), // Only run if we have a JWT token
    retry: false,
  });

  useEffect(() => {
    if (userData) {
      setUser(userData.data);
    }
  }, [userData]);

  // Check if we need to sync with backend (only once on mount)
  useEffect(() => {
    const syncWithBackend = async () => {
      if (
        session?.user &&
        !getTokenFromStorage() &&
        !hasAttemptedCallback.current
      ) {
        console.log("🟡 Syncing with backend...");
        hasAttemptedCallback.current = true;
        setIsLoadingBackend(true);

        try {
          const { nextAuthCallback } = await import("@/services/auth");
          const response = await nextAuthCallback(
            session.user.email!,
            session.user.name || undefined,
            session.user.image || undefined,
            "github",
            undefined,
            undefined
          );

          if (response.data?.token?.access_token) {
            console.log("✅ JWT token obtained from backend");
            // Trigger a re-render to fetch user data
            window.location.reload();
          }
        } catch (error) {
          console.error("❌ Failed to sync with backend:", error);
        } finally {
          setIsLoadingBackend(false);
        }
      }
    };

    // Only run once when component mounts
    syncWithBackend();
  }, []); // Empty dependency array - only run once

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

  // Show loading while fetching backend user data or handling GitHub callback
  if (isLoadingBackend || (isLoadingUser && getTokenFromStorage())) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">
          {isLoadingBackend
            ? "Syncing with backend..."
            : "Loading user data..."}
        </div>
      </div>
    );
  }

  // Show error if API call failed
  if (userError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Backend Error
          </h1>
          <p className="text-gray-600">Failed to sync with backend</p>
          <button
            onClick={() => {
              removeTokenFromStorage();
              signOut();
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

        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              User Information
            </h2>
          </div>

          {/* Show user data from either NextAuth session or backend */}
          <div className="space-y-2">
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <span className="ml-2 text-gray-800">
                {session?.user?.email || user?.email}
              </span>
            </div>

            {(session?.user?.name || user?.name) && (
              <div>
                <span className="font-medium text-gray-600">Name:</span>
                <span className="ml-2 text-gray-800">
                  {session?.user?.name || user?.name}
                </span>
              </div>
            )}

            {session?.user?.image && (
              <div className="flex items-center">
                <span className="font-medium text-gray-600">Avatar:</span>
                <img
                  src={session.user.image}
                  alt="Avatar"
                  className="ml-2 w-8 h-8 rounded-full"
                />
              </div>
            )}

            <div>
              <span className="font-medium text-gray-600">Provider:</span>
              <span className="ml-2 text-gray-800">
                {session ? "GitHub" : user?.provider || "Email"}
              </span>
            </div>
          </div>

          {/* Show backend user data if available */}
          {user && (
            <div className="pt-4 border-t">
              <h3 className="text-md font-semibold text-gray-700 mb-2">
                Backend Data
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-600">Backend ID:</span>
                  <span className="ml-2 text-gray-800 font-mono text-sm">
                    {user.id}
                  </span>
                </div>

                <div>
                  <span className="font-medium text-gray-600">
                    Member since:
                  </span>
                  <span className="ml-2 text-gray-800">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <span className="font-medium text-gray-600">Provider:</span>
                  <span className="ml-2 text-gray-800 capitalize">
                    {user.provider}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <button
              onClick={() => {
                removeTokenFromStorage();
                if (session) {
                  signOut();
                } else {
                  // For email login, just redirect to login page
                  window.location.href = "/login";
                }
              }}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
