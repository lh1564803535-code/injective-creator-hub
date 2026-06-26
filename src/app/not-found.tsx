import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08080f]">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-white">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-300">Page Not Found</h2>
        <p className="mb-8 text-gray-500">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
