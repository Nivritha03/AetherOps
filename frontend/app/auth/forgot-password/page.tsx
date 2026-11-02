"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setDevResetUrl(null);

    if (!email) {
      setError("Please provide your account email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to process password reset request.");
      }

      setSuccess("A password reset link has been dispatched to your email address.");
      if (data.resetURL) {
        setDevResetUrl(data.resetURL);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
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
            Reset your password
          </h1>
          <p style={{ fontSize: 13, color: "var(--sage-light)", marginTop: 6 }}>
            Enter your verified email to receive a secure time-limited reset link.
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
            display: "flex", flexDirection: "column", gap: 8,
            background: "rgba(152, 184, 159, 0.15)", border: "1px solid rgba(152, 184, 159, 0.35)",
            borderRadius: 8, padding: "12px 14px", marginBottom: 18, fontSize: 12, color: "var(--cream-primary)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={15} color="var(--green-bright)" />
              <span>{success}</span>
            </div>
            {devResetUrl && (
              <div style={{ marginTop: 6, paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ color: "var(--sage-light)", fontSize: 11 }}>Quick Reset Link:</span>{" "}
                <Link href={devResetUrl} style={{ color: "var(--cream-primary)", textDecoration: "underline", wordBreak: "break-all" }}>
                  Click here to set new password
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--cream-soft)", marginBottom: 6 }}>
              Account Email Address
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                style={{
                  width: "100%", padding: "11px 14px 11px 38px",
                  background: "rgba(18, 13, 18, 0.8)", border: "1px solid var(--border)",
                  borderRadius: 8, color: "var(--cream-primary)", fontSize: 13, outline: "none"
                }}
              />
              <Mail size={15} color="var(--sage-light)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
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
            {loading ? "Generating reset link..." : <>Send password reset link <ArrowRight size={14} /></>}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "var(--sage-light)", borderTop: "1px solid var(--border)", paddingTop: 20 }}>
          Remembered your password?{" "}
          <Link href="/auth/signin" style={{ color: "var(--cream-primary)", fontWeight: 700, textDecoration: "none" }}>
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
