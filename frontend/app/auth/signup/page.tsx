"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User as UserIcon, Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
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

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill out all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters with letters and numbers.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed. Please try again.");
      }

      setSuccess("Account successfully created! Signing you in...");
      login(data.token, data.user, true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
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
      {/* Background radial glow */}
      <div style={{
        position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
        width: 650, height: 420,
        background: "radial-gradient(circle, rgba(139, 29, 65, 0.22) 0%, rgba(142, 163, 150, 0.1) 45%, transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none"
      }} />

      <div style={{
        width: "100%", maxWidth: 460,
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

        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 16 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #8B1D41 0%, #D9A066 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 16px rgba(139,29,65,0.4)"
            }}>
              <span style={{ fontWeight: 900, color: "#F5F0E6", fontSize: 16 }}>▲</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "var(--cream-primary)", letterSpacing: "-0.02em" }}>
              AetherOps
            </span>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--cream-primary)", letterSpacing: "-0.03em" }}>
            Create an account
          </h1>
          <p style={{ fontSize: 13, color: "var(--sage-light)", marginTop: 6 }}>
            Set up your organization and deploy autonomous Kubernetes clusters.
          </p>
        </div>

        {/* Alerts */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--cream-soft)", marginBottom: 6 }}>
              Full Name
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Sarah Connor"
                style={{
                  width: "100%", padding: "11px 14px 11px 38px",
                  background: "rgba(18, 13, 18, 0.8)", border: "1px solid var(--border)",
                  borderRadius: 8, color: "var(--cream-primary)", fontSize: 13, outline: "none"
                }}
              />
              <UserIcon size={15} color="var(--sage-light)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--cream-soft)", marginBottom: 6 }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@enterprise.io"
                style={{
                  width: "100%", padding: "11px 14px 11px 38px",
                  background: "rgba(18, 13, 18, 0.8)", border: "1px solid var(--border)",
                  borderRadius: 8, color: "var(--cream-primary)", fontSize: 13, outline: "none"
                }}
              />
              <Mail size={15} color="var(--sage-light)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--cream-soft)", marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters (letters + numbers)"
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
              Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
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
              boxShadow: "0 4px 18px rgba(139,29,65,0.45)", marginTop: 6,
              opacity: loading ? 0.7 : 1, transition: "all 0.2s"
            }}
          >
            {loading ? "Registering user..." : <>Create free account <ArrowRight size={14} /></>}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "var(--sage-light)", borderTop: "1px solid var(--border)", paddingTop: 20 }}>
          Already have an account?{" "}
          <Link href="/auth/signin" style={{ color: "var(--cream-primary)", fontWeight: 700, textDecoration: "none" }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
