// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" border-t mt-12">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-700">
        {/* Brand Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Acme Electronic Hub
          </h2>
          <p className="mt-2">
            Your one-stop shop for fashion, electronics, and more.
          </p>
          <p className="mt-1">Ahmedabad, India</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-blue-600">
                Products
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue-600">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Contact</h3>
          <p>
            Email:{" "}
            <a href="mailto:support@acme.com" className="hover:text-blue-600">
              support@Acme.com
            </a>
          </p>
          <p>Phone: +91 98765 43210</p>
          <p>Support: Mon–Fri, 9AM–6PM</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-xs text-gray-400 py-4 border-t">
        &copy; {new Date().getFullYear()} ShopEasy. All rights reserved.
      </div>
    </footer>
  );
}
