import type { Metadata } from "next";
import Navbar from "@/components/navigation/Navbar";

export const metadata: Metadata = {
  title: {
    template: "%s | Profile",
    default: "Dashboard | Profile",
  },
  description:
    "Manage your account settings, view your dashboard, and handle your wishlist, orders, reviews, and messages. Sell items and enjoy a seamless user experience on our e-commerce platform.",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar mode="user" />
      <main className="bg-white text-zinc-800 mob-lg:px-4 p-8 min-h-[65vh]">
        {children}
      </main>
    </>
  );
}
