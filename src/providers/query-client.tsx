"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const MyQueryClient = new QueryClient();

export const MyQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <QueryClientProvider client={MyQueryClient}>{children}</QueryClientProvider>
  );
};
