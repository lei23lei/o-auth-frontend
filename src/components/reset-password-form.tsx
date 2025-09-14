"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/services/auth";
import Link from "next/link";
import { resetPasswordSchema, validatePasswordMatch } from "@/lib/validations";
import * as z from "zod";

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    // Get token from URL query parameters
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setErrorMessage(""); // Clear any previous error when token is found
    } else {
      setErrorMessage(
        "Invalid or missing reset token. Please check your email link."
      );
    }
  }, [searchParams]);

  const { mutate: resetPasswordMutate, isPending } = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      resetPassword(token, password),
    onSuccess: (data) => {
      console.log("Password reset successful:", data);
      setSuccessMessage(
        data.message || "Password has been reset successfully!"
      );
      setPassword("");
      setConfirmPassword("");
      setErrors({});
      setErrorMessage("");
    },
    onError: (error: any) => {
      console.error("Password reset failed:", error);
      setSuccessMessage("");

      // Handle structured error response from backend
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (
        error.response?.data?.errors &&
        error.response.data.errors.length > 0
      ) {
        // Handle field-specific errors
        const firstError = error.response.data.errors[0];
        setErrorMessage(firstError.message || "Password reset failed");
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to reset password. Please try again.");
      }
    },
  });

  const validateForm = () => {
    try {
      const validationData = { password, confirmPassword };
      resetPasswordSchema.parse(validationData);

      // Additional validation for password confirmation
      const passwordMatchError = validatePasswordMatch(
        password,
        confirmPassword
      );
      if (passwordMatchError) {
        setErrors({ confirmPassword: passwordMatchError });
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrorMessage("Reset token is missing. Please check your email link.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    resetPasswordMutate({ token, password });
  };

  return (
    <Card className="w-11/12 md:w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl text-center font-bold">
          Reset Password
        </CardTitle>
        <CardDescription className="text-xs md:text-sm text-center">
          Enter your new password below. Make sure it's secure and memorable.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {errorMessage}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.password;
                    return newErrors;
                  });
                }
                if (successMessage) {
                  setSuccessMessage("");
                }
                if (errorMessage) {
                  setErrorMessage("");
                }
              }}
              className={`bg-white ${errors.password ? "border-red-500" : ""}`}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.confirmPassword;
                    return newErrors;
                  });
                }
                if (successMessage) {
                  setSuccessMessage("");
                }
                if (errorMessage) {
                  setErrorMessage("");
                }
              }}
              className={`bg-white ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full !mt-7 h-10"
            disabled={isPending}
          >
            {isPending ? "Resetting Password..." : "Reset Password"}
          </Button>

          {successMessage && (
            <div className="text-center mt-4">
              <Link
                href="/login"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Back to Sign In
              </Link>
            </div>
          )}

          {errorMessage && errorMessage.includes("expired") && (
            <div className="text-center mt-4">
              <Link
                href="/forget-password"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Request New Reset Link
              </Link>
            </div>
          )}

          {errorMessage && errorMessage.includes("Invalid") && (
            <div className="text-center mt-4">
              <Link
                href="/forget-password"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Request New Reset Link
              </Link>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
