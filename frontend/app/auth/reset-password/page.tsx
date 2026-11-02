"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Reset token is missing. Please check your reset link.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters (letters + numbers).");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setSuccess("Your password has been successfully reset! Redirecting to sign in...");
      setTimeout(() => {
        router.push("/auth/signin");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg-primary)", color: "var(--cream-primary)", padding: "24px",
      fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden"
    }}>
      <div style={{
        position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
        width: 650, height: 420,
        background: "radial-gradient(circle, rgba(139, 29, 65, 0.22) 0%, rgba(142, 163, 150, 0.1) 45%, transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none"
      }} />

      <div style={{
        width: "100%", maxWidth: 440,
        background: "rgba(34, 26, 34, 0.85)",
        border: "1px solid var(--border)",
        borderRadius: 16, padding: "36px 32px",
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 29, 65, 0.2)",
        position: "relative", zIndex: 1
      }}>
        {/* Back to Home Button */}
        <div style={{ marginBottom: 18 }}>
          <Link
            href="/"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 600, color: "var(--sage-light)",
              textDecoration: "none", padding: "4px 8px", borderRadius: 6,
              background: "rgba(245, 240, 230, 0.04)", border: "1px solid var(--border)",
              transition: "all 0.15s ease"
            }}
          >
            ← Back to Home
          </Link>
        </div>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 16 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #8B1D41 0%, #D9A066 100%)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <span style={{ fontWeight: 900, color: "#F5F0E6", fontSize: 16 }}>▲</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "var(--cream-primary)" }}>
              AetherOps
            </span>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--cream-primary)", letterSpacing: "-0.03em" }}>
            Set new password
          </h1>
          <p style={{ fontSize: 13, color: "var(--sage-light)", marginTop: 6 }}>
            Choose a strong, unique password to secure your account.
          </p>
        </div>

        {error && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(199, 62, 93, 0.15)", border: "1px solid rgba(199, 62, 93, 0.35)",
            borderRadius: 8, padding: "10px 14px", marginBottom: 18, fontSize: 12, color: "#FCA5A5"
          }}>
            <AlertCircle size={15} color="#EF4444" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(152, 184, 159, 0.15)", border: "1px solid rgba(152, 184, 159, 0.35)",
            borderRadius: 8, padding: "10px 14px", marginBottom: 18, fontSize: 12, color: "var(--cream-primary)"
          }}>
            <CheckCircle2 size={15} color="var(--green-bright)" style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {!tokenFromUrl && (
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--cream-soft)", marginBottom: 6 }}>
                Reset Token
              </label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token from email"
                style={{
                  width: "100%", padding: "11px 14px",
                  background: "rgba(18, 13, 18, 0.8)", border: "1px solid var(--border)",
                  borderRadius: 8, color: "var(--cream-primary)", fontSize: 13, outline: "none"
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--cream-soft)", marginBottom: 6 }}>
              New Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters (letters + numbers)"
                style={{
                  width: "100%", padding: "11px 40px 11px 38px",
                  background: "rgba(18, 13, 18, 0.8)", border: "1px solid var(--border)",
                  borderRadius: 8, color: "var(--cream-primary)", fontSize: 13, outline: "none"
                }}
              />
              <Lock size={15} color="var(--sage-light)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--sage-light)" }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--cream-soft)", marginBottom: 6 }}>
              Confirm New Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                style={{
                  width: "100%", padding: "11px 14px 11px 38px",
                  background: "rgba(18, 13, 18, 0.8)", border: "1px solid var(--border)",
                  borderRadius: 8, color: "var(--cream-primary)", fontSize: 13, outline: "none"
                }}
              />
              <Lock size={15} color="var(--sage-light)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "var(--burgundy-primary)", color: "var(--cream-primary)",
              border: "1px solid rgba(245,240,230,0.2)", borderRadius: 8, padding: "12px",
              fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 18px rgba(139,29,65,0.45)", marginTop: 6
            }}
          >
            {loading ? "Updating password..." : <>Save new password <ArrowRight size={14} /></>}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "var(--sage-light)", borderTop: "1px solid var(--border)", paddingTop: 20 }}>
          <Link href="/auth/signin" style={{ color: "var(--cream-primary)", fontWeight: 700, textDecoration: "none" }}>
            Return to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
