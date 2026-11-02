"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedRoute(props: P) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push("/auth/signin");
      }
    }, [isAuthenticated, loading, router]);

    if (loading) {
      return (
        <div style={{
          minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
          background: "var(--bg-primary)", color: "var(--cream-primary)"
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg, #8B1D41 0%, #D9A066 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 20px rgba(139,29,65,0.4)"
            }}>
              <span style={{ fontWeight: 900, color: "#F5F0E6", fontSize: 18 }}>▲</span>
            </div>
            <span style={{ fontSize: 13, color: "var(--sage-light)", fontWeight: 500 }}>
              Verifying security session...
            </span>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
