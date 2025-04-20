"use client";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold tracking-wide">Vastavik</h1>
        <div className="flex space-x-6 items-center">
          <Link href="#about" className="hover:text-blue-600 transition-colors">
            Feature
          </Link>
          <Link href="#features" className="hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link href="#contact" className="hover:text-blue-600 transition-colors">
            Contact
          </Link>
          {/* <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-all">
            Login
          </button> */}
        </div>
      </div>
    </nav>

  );
};

export default Navbar