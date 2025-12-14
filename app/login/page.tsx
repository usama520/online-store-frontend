"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { loginUser } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(formData.email, formData.password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-surface flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-theme-surface-card rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-theme-text mb-6 text-center">
          Customer Login
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-theme-error/10 border border-theme-error/30 text-theme-error rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-theme-text-secondary mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="input-theme"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text-secondary mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="input-theme"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-theme-primary disabled:bg-theme-surface-secondary disabled:text-theme-text-muted disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-theme-text-secondary">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-theme-primary hover:text-theme-primary-hover font-semibold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
