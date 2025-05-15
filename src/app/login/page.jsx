import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex flex-col justify-center items-center px-2 py-8 bg-gradient-to-b from-white via-blue-50 to-white">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-blue-100 flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-6 text-center">
            Sign In
          </h1>
          <p className="text-secondary text-center mb-6 text-base sm:text-lg">
            Sign in to unlock advanced features like personalized tax reminders
            and detailed compliance tracking.
          </p>
          <div className="text-center mb-8">
            <p className="text-sm text-muted">
              Coming soon! This feature is currently under development.
            </p>
          </div>
          <Link
            href="/"
            className="inline-block w-full text-center text-white font-semibold bg-gradient-to-r from-primary to-accent px-6 py-3 rounded-lg shadow hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
