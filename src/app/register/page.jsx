"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import { Button, TextInput, PasswordInput, Divider } from "@mantine/core";
import { notifications } from "@mantine/notifications";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: error.message,
      });
      setLoading(false);
      return;
    }
    notifications.show({
      color: "green",
      title: "Success",
      message: "Registration successful. Please check your email.",
    });
    setTimeout(() => {
      postAuthRedirect();
    }, 1200);
  }

  async function handleGoogle() {
    setLoading(true);

    // Force local URL during development
    const isDevelopment = process.env.NODE_ENV === "development";
    const appUrl = isDevelopment
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${appUrl}/login`,
      },
    });
    if (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: error.message,
      });
      setLoading(false);
    }
    // On success, Supabase will redirect automatically
  }

  async function postAuthRedirect() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "No user found after registration",
      });
      setLoading(false);
      return;
    }
    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.id)
      .single();
    setLoading(false);
    if (!company) {
      setTimeout(() => {
        router.replace("/onboarding");
      }, 1200);
    } else {
      setTimeout(() => {
        router.replace("/");
      }, 1200);
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex flex-col justify-center items-center px-2 py-8 bg-gradient-to-br from-white via-blue-50 to-accent/10">
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-blue-100 flex flex-col items-center"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-6 text-center">
            Create Account
          </h1>
          <TextInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-4"
            autoComplete="email"
          />
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mb-4"
            autoComplete="new-password"
          />
          <Button
            type="submit"
            loading={loading}
            fullWidth
            className="mb-4 btn btn-primary"
          >
            Register
          </Button>
          <Divider label="or" className="my-4 w-full" />
          <Button
            type="button"
            onClick={handleGoogle}
            loading={loading}
            fullWidth
            variant="outline"
            color="accent"
            className="mb-4 flex items-center justify-center gap-2 border-1"
            leftSection={
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_993_124)">
                  <path
                    d="M19.8052 10.2309C19.8052 9.5508 19.7491 8.86727 19.629 8.19727H10.2V12.0491H15.6261C15.3982 13.2855 14.6525 14.3727 13.6016 15.0582V17.3155H16.6832C18.4861 15.6418 19.8052 13.2218 19.8052 10.2309Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.2 20C12.7009 20 14.7891 19.1809 16.6832 17.3155L13.6016 15.0582C12.5407 15.7582 11.2425 16.1573 10.2 16.1573C7.78543 16.1573 5.73543 14.4646 4.96452 12.3091H1.77588V14.6418C3.71678 17.9827 6.78543 20 10.2 20Z"
                    fill="#34A853"
                  />
                  <path
                    d="M4.96452 12.3091C4.76452 11.6091 4.65252 10.8727 4.65252 10.1255C4.65252 9.37819 4.76452 8.64182 4.96452 7.94182V5.60913H1.77588C1.14178 6.8727 0.800781 8.2727 0.800781 10.1255C0.800781 11.9782 1.14178 13.3782 1.77588 14.6418L4.96452 12.3091Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.2 4.09273C11.3573 4.09273 12.3982 4.49273 13.2073 5.26455L16.7425 1.72909C14.7891 0.0127273 12.7009 0 10.2 0C6.78543 0 3.71678 2.01727 1.77588 5.35818L4.96452 7.94182C5.73543 5.78636 7.78543 4.09273 10.2 4.09273Z"
                    fill="#EA4335"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_993_124">
                    <rect
                      width="19.2"
                      height="20"
                      fill="white"
                      transform="translate(0.800781)"
                    />
                  </clipPath>
                </defs>
              </svg>
            }
          >
            Continue with Google
          </Button>
          <div className="text-center mt-2">
            <span className="text-sm text-secondary">
              Already have an account?{" "}
            </span>
            <a href="/login" className="text-primary underline">
              Login
            </a>
          </div>
        </form>
      </div>
      <footer className="bg-gradient-to-r from-accent/10 to-primary/10 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-8 md:px-12 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">
                Simplify
              </h3>
              <p className="text-secondary text-sm">
                Making tax compliance simple for Tanzanian business owners.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">
                Contact
              </h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>Email: sales@simplify.co.tz</li>
                <li>Phone: +255 742 200 105</li>
                <li>Address: Mikocheni Kwa Warioba, Dar es Salaam, Tanzania</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/tax-tips"
                    className="text-secondary hover:text-primary"
                  >
                    Tax Tips
                  </a>
                </li>
                <li>
                  <a
                    href="/tax-info"
                    className="text-secondary hover:text-primary"
                  >
                    Tax Information
                  </a>
                </li>
                <li>
                  <a
                    href="/calendar"
                    className="text-secondary hover:text-primary"
                  >
                    Tax Calendar
                  </a>
                </li>
                <li>
                  <a
                    href="/chat-ai"
                    className="text-secondary hover:text-primary"
                  >
                    Tax AI
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-secondary">
              © {new Date().getFullYear()} Simplify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
