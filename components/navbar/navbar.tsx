// components/Header.tsx
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className=" sticky top-0 z-50 bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-black">
          Acme Fashion Hub
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-600">
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-600">
            Contact
          </Link>
        </nav>

        {/* Icons */}
        <div className="flex gap-4 items-center">
          <Link href="/cart" className="relative">
            <ShoppingCart size={22} />
            <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
