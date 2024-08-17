import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/context/AuthProvider";
import { ReactQueryProvider } from "@/context/ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import CustomLayout from "@/layouts/CustomLayout";

export const metadata: Metadata = {
  title: "RepoHub",
  description:
    "RepoHub is a powerful GitHub companion app built with Next.js, designed to enhance your repository management experience. Easily log in with your GitHub account, explore repositories with some filters, view your profile and repositories, search for other users, and view their profiles and repositories. The standout feature of RepoHub is the ability to create custom repository collections, allowing you to save and organize your favorite repositories just like creating a playlist on YouTube.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full h-dvh bg-slate-900 text-white">
        <AuthProvider>
          <ReactQueryProvider>
            <div className="w-full h-full flex flex-col items-center space-y-1">
              <Toaster />
              <div className="w-full">
                <Navbar />
              </div>
              <CustomLayout>
                <div className="w-full h-full overflow-hidden md:w-5/6 lg:w-3/5 flex-1 bg-slate-800 md:rounded-t-lg p-3">
                  {children}
                </div>
              </CustomLayout>
            </div>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
