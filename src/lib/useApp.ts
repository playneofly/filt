import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SERVERS, type Server } from "./data";

export type Status = "off" | "connecting" | "on" | "error";

export interface ScanResult {
  id: string;
  ping: number | null;
  done: boolean;
}

const HISTORY = 48;

export function useApp() {
  const [status, setStatus] = useState<Status>("off");
  const [selected, setSelected] = useState<string>("s1");
  const [uptime, setUptime] = useState(0);
  const [down, setDown] = useState<number[]>(() => Array(HISTORY).fill(0));
  const [up, setUp] = useState<number[]>(() => Array(HISTORY).fill(0));
  const [total, setTotal] = useState({ down: 4.2 * 1024 ** 3, up: 0.9 * 1024 ** 3 });
  const [pings, setPings] = useState<Record<string, number | null>>({
    s1: 42,
    s3: 31,
    s9: 62,
  });
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [winner, setWinner] = useState<Server | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  const server = useMemo(() => SERVERS.find((s) => s.id === selected) ?? SERVERS[0], [selected]);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 2600);
  }, []);

  /* ---- connection lifecycle ---- */
  const connect = useCallback(
    (id?: string) => {
      if (id) setSelected(id);
      setStatus("connecting");
      const t = window.setTimeout(() => {
        setStatus("on");
        setUptime(0);
      }, 1900);
      timers.current.push(t);
    },
    []
  );

  const disconnect = useCallback(() => {
    setStatus("off");
    setUptime(0);
    setDown(Array(HISTORY).fill(0));
    setUp(Array(HISTORY).fill(0));
  }, []);

  const toggle = useCallback(() => {
    if (status === "on" || status === "connecting") disconnect();
    else connect();
  }, [status, connect, disconnect]);

  /* ---- uptime + live speed simulation ---- */
  useEffect(() => {
    if (status !== "on") return;
    const iv = window.setInterval(() => setUptime((u) => u + 1), 1000);
    return () => window.clearInterval(iv);
  }, [status]);

  useEffect(() => {
    if (status !== "on") return;
    let phase = 0;
    const iv = window.setInterval(() => {
      phase += 0.35;
      const base = 900_000 + Math.sin(phase) * 420_000 + Math.sin(phase * 2.7) * 180_000;
      const d = Math.max(40_000, base + (Math.random() - 0.5) * 380_000);
      const u = Math.max(10_000, d * (0.14 + Math.random() * 0.1));
      setDown((p) => [...p.slice(1), d]);
      setUp((p) => [...p.slice(1), u]);
      setTotal((t) => ({ down: t.down + d * 0.4, up: t.up + u * 0.4 }));
    }, 400);
    return () => window.clearInterval(iv);
  }, [status]);

  /* ---- smart scan ---- */
  const startScan = useCallback(() => {
    if (scanning) return;
    setScanning(true);
    setWinner(null);
    setScanProgress(0);
    setScanResults(SERVERS.map((s) => ({ id: s.id, ping: null, done: false })));

    const order = [...SERVERS].sort(() => Math.random() - 0.5);
    order.forEach((s, i) => {
      const t = window.setTimeout(() => {
        const jitter = (Math.random() - 0.35) * 40;
        const fail = Math.random() < 0.12;
        const ping = fail ? null : Math.max(12, Math.round(s.basePing + jitter));
        setScanResults((prev) =>
          prev.map((r) => (r.id === s.id ? { ...r, ping, done: true } : r))
        );
        setPings((prev) => ({ ...prev, [s.id]: ping }));
        setScanProgress(i + 1);

        if (i === order.length - 1) {
          const t2 = window.setTimeout(() => {
            setScanResults((prev) => {
              const best = prev
                .filter((r) => r.ping !== null)
                .sort((a, b) => (a.ping! - b.ping!))[0];
              const bs = SERVERS.find((x) => x.id === best?.id) ?? null;
              setWinner(bs);
              if (bs) {
                const t3 = window.setTimeout(() => {
                  setScanning(false);
                  connect(bs.id);
                  setWinner(null);
                }, 2000);
                timers.current.push(t3);
              } else {
                setScanning(false);
              }
              return prev;
            });
          }, 420);
          timers.current.push(t2);
        }
      }, 160 + i * 190);
      timers.current.push(t);
    });
  }, [scanning, connect]);

  const cancelScan = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setScanning(false);
    setWinner(null);
  }, []);

  /* ---- single ping test ---- */
  const testOne = useCallback((id: string) => {
    setPings((p) => ({ ...p, [id]: null }));
    const s = SERVERS.find((x) => x.id === id);
    if (!s) return;
    window.setTimeout(() => {
      setPings((p) => ({ ...p, [id]: Math.max(12, Math.round(s.basePing + (Math.random() - 0.4) * 40)) }));
    }, 500 + Math.random() * 700);
  }, []);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  return {
    status,
    server,
    selected,
    setSelected,
    uptime,
    down,
    up,
    total,
    pings,
    scanning,
    scanProgress,
    scanResults,
    winner,
    toast,
    notify,
    toggle,
    connect,
    disconnect,
    startScan,
    cancelScan,
    testOne,
  };
}

export function fmtUptime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
