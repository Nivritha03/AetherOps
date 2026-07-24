"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Terminal, Zap, ShieldAlert, Cpu } from "lucide-react";

const commands = [
  { id: "idle-gpus", title: "Idle GPUs", icon: <Cpu size={16} />, path: "/workloads" },
  { id: "recommendations", title: "Recommendations", icon: <Zap size={16} />, path: "/optimize" },
  { id: "cost-timeline", title: "Cost Timeline", icon: <Search size={16} />, path: "/cost-explorer" },
  { id: "cluster-health", title: "Cluster Health", icon: <ShieldAlert size={16} />, path: "/cluster-health" },
  { id: "simulation", title: "Simulation (What-If)", icon: <Terminal size={16} />, path: "/optimize" },
];

export default function CommandPalette() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/") return;
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [pathname]);

  if (pathname === "/") return null;

  if (!open) return null;

  const filtered = search
    ? commands.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
    : commands;

  return (
    <div className="cmd-overlay" onClick={() => setOpen(false)}>
      <div className="cmd-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", padding: "0 16px", borderBottom: "1px solid var(--border)" }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            autoFocus
            className="cmd-input"
            placeholder="Search commands (e.g., 'Idle GPUs')"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: "none" }}
          />
        </div>
        <div className="cmd-list">
          {filtered.length === 0 && (
            <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
              No results found.
            </div>
          )}
          {filtered.map((cmd, idx) => (
            <div
              key={cmd.id}
              className={`cmd-item ${idx === 0 ? "selected" : ""}`}
              onClick={() => {
                router.push(cmd.path);
                setOpen(false);
                setSearch("");
              }}
            >
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {cmd.icon}
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{cmd.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
