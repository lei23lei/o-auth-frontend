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
import { register } from "@/services/user";
import { login, saveTokenToStorage } from "@/services/auth";
import Link from "next/link";
import { formSchema, validatePasswordMatch } from "@/lib/validations";
import * as z from "zod";
import { AuthSigninButton } from "./auth-signin-button";
import { signOutAction } from "@/actions/auth";

interface FormProps {
  isRegistered?: boolean;
}

export const Form = ({ isRegistered = false }: FormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate: registerMutate, isPending: isRegisterPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      register(email, password),
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      setSuccessMessage(data.message);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});
      setErrorMessage("");
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      setSuccessMessage("");
      setErrorMessage(error.message || "Registration failed");
    },
  });

  const { mutate: loginMutate, isPending: isLoginPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      console.log("Login successful:", data);
      // Save token to localStorage
      saveTokenToStorage(data.data.access_token);
      setSuccessMessage(data.message);
      setEmail("");
      setPassword("");
      setErrors({});
      setErrorMessage("");
      // You can add redirect logic here
    },
    onError: (error) => {
      console.error("Login failed:", error);
      setSuccessMessage("");
      setErrorMessage(error.message || "Login failed");
    },
  });
  const validateForm = () => {
    try {
      // Create validation data based on registration mode
      const validationData = {
        email,
        password,
        confirmPassword: isRegistered ? confirmPassword : password, // Use password for login mode
      };

      // Validate with Zod
      formSchema.parse(validationData);

      // Additional validation for password confirmation in registration mode
      if (isRegistered) {
        const passwordMatchError = validatePasswordMatch(
          password,
          confirmPassword
        );
        if (passwordMatchError) {
          setErrors({ confirmPassword: passwordMatchError });
          return false;
        }
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

    if (!validateForm()) {
      return;
    }

    if (isRegistered) {
      // Use the register mutation
      registerMutate({ email, password });
    } else {
      // Use the login mutation
      loginMutate({ email, password });
    }
  };

  return (
    <Card className="w-11/12 md:w-full max-w-md mx-auto ">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl text-center font-bold">
          {isRegistered ? "Sign Up" : "Sign In"}
        </CardTitle>
        <CardDescription className=" text-xs md:text-sm text-center">
          {isRegistered
            ? "Create a new account with your email and password."
            : "Enter your email and password to sign in to your account."}
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
              placeholder="Enter your email"
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
              }}
              className={`bg-white ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
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
              }}
              className={`bg-white ${errors.password ? "border-red-500" : ""}`}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          {isRegistered && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
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
                }}
                className={`bg-white ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          )}
          {!isRegistered && (
            <div className="text-right mt-4">
              <Link
                href="/forget-password"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Forgot Password?
              </Link>
            </div>
          )}
          <Button
            type="submit"
            className={`w-full  h-10 ${isRegistered ? "!mt-7" : ""}`}
            disabled={isRegistered ? isRegisterPending : isLoginPending}
          >
            {isRegistered
              ? isRegisterPending
                ? "Creating Account..."
                : "Sign Up"
              : isLoginPending
              ? "Signing In..."
              : "Sign In"}
          </Button>
          <div className="flex flex-col gap-2 mt-4">
            <AuthSigninButton />
            <Button
              variant="outline"
              onClick={() => signOutAction()}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
