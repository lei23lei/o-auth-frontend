"use client";

import { useState } from "react";
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
import { forgotPassword } from "@/services/auth";
import { forgotPasswordSchema } from "@/lib/validations";
import * as z from "zod";

export const ForgetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate: forgotPasswordMutate, isPending } = useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: (data) => {
      console.log("Forgot password request successful:", data);
      setSuccessMessage(
        data.message ||
          "Password reset instructions have been sent to your email."
      );
      setEmail("");
      setErrors({});
      setErrorMessage("");
    },
    onError: (error: any) => {
      console.error("Forgot password request failed:", error);
      setSuccessMessage("");

      // Handle structured error response from backend
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "Failed to send password reset instructions. Please try again."
        );
      }
    },
  });

  const validateForm = () => {
    try {
      forgotPasswordSchema.parse({ email });
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

    if (!validateForm()) {
      return;
    }

    forgotPasswordMutate(email);
  };

  return (
    <Card className="w-11/12 md:w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl text-center font-bold">
          Forgot Password
        </CardTitle>
        <CardDescription className="text-xs md:text-sm text-center">
          Enter your email address and we'll send you instructions to reset your
          password.
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.email;
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
              className={`bg-white ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full !mt-7 h-10"
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send Reset Instructions"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
