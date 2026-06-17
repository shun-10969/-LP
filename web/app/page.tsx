"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Hoverable } from "@/components/Hoverable";
import {
  COURSE_PLANS,
  JOIN_FEE_YEN,
  RENEWAL_FEE_YEN,
  DAILY_TRIAL_LIMIT,
} from "@/lib/types";

const yen = (n: number) => "¥" + n.toLocaleString();
const planByKey = Object.fromEntries(COURSE_PLANS.map((p) => [p.key, p]));

const COURSES = [
  {
    key: "low",
    img: "course-low.png",
    title: "低学年コース",
    grade: "小1〜3年",
    color: "#0a7d4f",
    border: "#cfeede",
    tagBg: "#eefaf3",
    days: "月・木",
    time: "17:00〜18:00",
    body: "走る・跳ぶ・投げるの基礎や運動遊びを通して、楽しく体を動かします。毎週木曜日は「体操教室」を開催します。",
    delay: 0,
  },
  {
    key: "high",
    img: "course-high.png",
    title: "高学年コース",
    grade: "小4〜6年",
    color: "#c2491f",
    border: "#ffd9c9",
    tagBg: "#fff3ee",
    days: "水・金",
    time: "17:00〜18:00",
    body: "正しいフォームを身につけ、短距離・リレーを中心に走力アップを目指します。",
    delay: 120,
  },
  {
    key: "adv",
    img: "course-adv.png",
    title: "アスリート育成コース",
    grade: "中学生〜一般",
    color: "#0a5f8a",
    border: "#cfe6f0",
    tagBg: "#eef6fb",
    days: "月・水・金",
    time: "18:15〜19:15",
    body: "専門的なトレーニングで記録向上を目指します。一般・社会人の方も歓迎です。",
    delay: 240,
  },
];

const SKILLS = [
  { name: "走る力", tag: "スピードUP", icon: "s-run.png", delay: 0 },
  { name: "跳ぶ力", tag: "瞬発力UP", icon: "s-jump.png", delay: 80 },
  { name: "投げる力", tag: "パワーUP", icon: "s-throw.png", delay: 160 },
  { name: "体の使い方", tag: "バランスUP", icon: "s-balance.png", delay: 240 },
  { name: "ケガに強い体", tag: "体づくり", icon: "s-shield.png", delay: 320 },
];

const SPORTS = ["サッカー", "野球", "バスケ", "バレー", "テニス", "水泳", "格闘技", "ダンス"];

const COACHES = [
  {
    id: "coach-1",
    name: "宮田 健太",
    role: "ヘッドコーチ",
    specialty: "短距離・スプリント",
    achievements: [
      "陸上競技歴 15年 / 指導歴 8年",
      "延べ300名以上の子どもを指導",
      "県大会・記録会で入賞者を多数輩出",
    ],
    message: "「できた！」の笑顔が一番のごほうび。走る楽しさから丁寧に伝えます。",
  },
  {
    id: "coach-2",
    name: "金城 美咲",
    role: "キッズ担当コーチ",
    specialty: "低学年・運動あそび",
    achievements: [
      "幼児体育・運動指導の資格を保有",
      "運動が苦手な子のサポートが得意",
      "体の使い方・基礎づくりを担当",
    ],
    message: "まずは体を動かす楽しさから。一人ひとりのペースを大切にします。",
  },
  {
    id: "coach-3",
    name: "大城 翔",
    role: "競技コーチ",
    specialty: "中学生〜一般・記録向上",
    achievements: [
      "実業団・競技での競技経験あり",
      "中高生の競技力強化を担当",
      "大会に向けた専門トレーニング",
    ],
    message: "目標に向かって本気で伸ばす。一人ひとりの記録更新を全力で支えます。",
  },
];

const ACCESS_ROWS = [
  { tag: "住所", label: "コザ運動公園 陸上競技場", value: "沖縄県沖縄市（詳細はお問い合わせください）" },
  {
    tag: "時間",
    label: "練習時間",
    value: "17:00〜18:00（小学生） ／ 18:15〜19:15（アスリート育成）",
  },
  { tag: "対象", label: "対象", value: "小学生〜一般（小1〜・社会人も歓迎）" },
];

const GENKIDS_URL = "https://www.instagram.com/genkids_2025?igsh=c3JtMjA1eDQ3MzZt";

const WK = ["月", "火", "水", "木", "金", "土", "日"];
const WK_FULL = ["日", "月", "火", "水", "木", "金", "土"];

type Checkout =
  | { type: "trial" }
  | {
      type: "plan";
      key: string;
      name: string;
      monthlyYen: number;
      firstMonthYen: number;
      sessions: string;
    }
  | null;

function isoPad(d: Date) {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

export default function Home() {
  const [checkout, setCheckout] = useState<Checkout>(null);
  const [paid, setPaid] = useState(false);
  const [coachesOpen, setCoachesOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [gakunen, setGakunen] = useState("");
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  const [trialError, setTrialError] = useState("");
  const [navSolid, setNavSolid] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // video autoplay (muted/loop/play forced like the prototype)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.muted = true;
      v.loop = true;
      v.controls = true;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } catch {}
  }, []);

  // nav background on scroll
  useEffect(() => {
    const onScroll = () =>
      setNavSolid((window.scrollY || document.documentElement.scrollTop) > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // body scroll lock while a modal/overlay is open
  const anyOpen = !!checkout || coachesOpen || withdrawOpen;
  useEffect(() => {
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [anyOpen]);

  function openTrial() {
    setCheckout({ type: "trial" });
    setPaid(false);
    setWeekOffset(0);
    setSelectedDate(null);
    setGakunen("");
    setTrialError("");
  }
  function openPlan(courseKey: string) {
    const p = planByKey[courseKey];
    setCheckout({
      type: "plan",
      key: p.key,
      name: p.title,
      monthlyYen: p.monthlyYen,
      firstMonthYen: p.firstMonthYen,
      sessions: p.sessions,
    });
    setPaid(false);
  }
  function closeCheckout() {
    setCheckout(null);
    setPaid(false);
  }
  function openCoaches() {
    setCoachesOpen(true);
  }
  function closeCoaches() {
    setCoachesOpen(false);
  }
  function openWithdraw() {
    setWithdrawOpen(true);
    setWithdrawn(false);
  }
  function closeWithdraw() {
    setWithdrawOpen(false);
    setWithdrawn(false);
  }
  function openGenkids(e: React.MouseEvent) {
    e.preventDefault();
    try {
      const w = window.open(GENKIDS_URL, "_blank", "noopener,noreferrer");
      if (!w && window.top) window.top.location.href = GENKIDS_URL;
    } catch {
      window.location.href = GENKIDS_URL;
    }
  }

  // ---- calendar ----
  const today0 = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  function dayStatus(date: Date): "past" | "closed" | "full" | "few" | "ok" {
    if (date < today0) return "past";
    const dow = date.getDay();
    if (dow === 2 || dow === 6 || dow === 0) return "closed";
    const seed =
      date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    const booked = ((seed * 1103515245 + 12345) >>> 0) % 6;
    if (booked >= 5) return "full";
    if (booked >= 3) return "few";
    return "ok";
  }

  const cal = useMemo(() => {
    const mon = new Date(today0);
    const off = (mon.getDay() + 6) % 7;
    mon.setDate(mon.getDate() - off + weekOffset * 7);
    const map = {
      ok: { s: "○", c: "#1fb06b" },
      few: { s: "△", c: "#ef8a2b" },
      full: { s: "✕", c: "#c2491f" },
      closed: { s: "✕", c: "#9aa7ae" },
      past: { s: "—", c: "#c7d0d5" },
    } as const;
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      const st = dayStatus(d);
      const iso = isoPad(d);
      const sel = selectedDate === iso;
      const can = st === "ok" || st === "few";
      const m = map[st];
      days.push({
        iso,
        dow: WK[i],
        dm: d.getMonth() + 1 + "/" + d.getDate(),
        sym: m.s,
        symColor: m.c,
        canBook: can,
        selected: sel,
        isFri: i === 5,
        isSat: i === 6,
        past: st === "past",
      });
    }
    const last = new Date(mon);
    last.setDate(mon.getDate() + 6);
    const fmt = (x: Date) => x.getMonth() + 1 + "/" + x.getDate();
    return {
      days,
      weekLabel: fmt(mon) + "（月）〜 " + fmt(last) + "（日）",
      canPrev: weekOffset > 0,
      canNext: weekOffset < 51,
    };
  }, [today0, weekOffset, selectedDate]);

  const navBtnStyle = (on: boolean): React.CSSProperties => ({
    width: "34px",
    height: "34px",
    flex: "none",
    borderRadius: "50%",
    border: "1.5px solid #e2f1f8",
    background: "#fff",
    cursor: on ? "pointer" : "default",
    opacity: on ? 1 : 0.35,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  });

  function selLabel() {
    if (!selectedDate) return "";
    const p = selectedDate.split("-").map(Number);
    const dt = new Date(p[0], p[1] - 1, p[2]);
    return p[1] + "月" + p[2] + "日（" + WK_FULL[dt.getDay()] + "）";
  }

  async function submitTrial(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTrialError("");
    const f = e.currentTarget;
    const g = (n: string) =>
      (f.querySelector(`[name="${n}"]`) as HTMLInputElement | null)?.value.trim() ?? "";
    const payload = {
      event_date: selectedDate,
      gakunen,
      sei: g("sei"),
      mei: g("mei"),
      furi_sei: g("furiSei"),
      furi_mei: g("furiMei"),
      tel: g("tel"),
      email: g("email"),
    };
    try {
      const res = await fetch("/api/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 409) {
        setTrialError("申し訳ありません。この日は満員です。別の日をお選びください。");
        return;
      }
      if (!res.ok) {
        setTrialError("送信に失敗しました。時間をおいて再度お試しください。");
        return;
      }
      setPaid(true);
    } catch {
      setTrialError("通信エラーが発生しました。時間をおいて再度お試しください。");
    }
  }

  async function submitPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!checkout || checkout.type !== "plan") return;
    const inputs = e.currentTarget.querySelectorAll("input");
    const cardName = (inputs[3] as HTMLInputElement | undefined)?.value.trim() ?? "";
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_name: checkout.name, card_name: cardName }),
      });
      if (res.ok) setPaid(true);
    } catch {
      /* keep modal open on failure */
    }
  }

  async function submitWithdraw(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const els = e.currentTarget.querySelectorAll("input,select,textarea");
    const v = (i: number) => (els[i] as HTMLInputElement | undefined)?.value.trim() ?? "";
    try {
      await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_name: v(0),
          course: v(1),
          desired_month: v(2),
          contact: v(3),
          reason: v(4),
        }),
      });
    } catch {}
    setWithdrawn(true);
  }

  const isTrial = !!checkout && checkout.type === "trial";
  const isPlan = !!checkout && checkout.type === "plan";
  const nameLabel = gakunen === "一般" ? "お名前（ご本人）" : "保護者さまのお名前";
  const accent = "var(--accent,#ff6a3d)";
  const ocean = "var(--ocean,#0a93c4)";

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    border: "1.5px solid #dce9ef",
    borderRadius: "12px",
    padding: "12px 13px",
    fontSize: "15px",
    fontFamily: "'Zen Kaku Gothic New',sans-serif",
    color: "#0c3a4d",
    outline: "none",
    background: "#fafdfe",
  };

  return (
    <div
      id="koza-lp"
      style={{
        position: "relative",
        fontFamily: "'Zen Kaku Gothic New',sans-serif",
        ["--accent" as string]: "#ff6a3d",
        ["--ocean" as string]: "#0a93c4",
      }}
    >
      {/* ===== NAV ===== */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 90,
          transition: "background .35s ease, box-shadow .35s ease, backdrop-filter .35s ease",
          background: navSolid ? "rgba(255,255,255,.9)" : "transparent",
          backdropFilter: navSolid ? "blur(12px)" : "none",
          WebkitBackdropFilter: navSolid ? "blur(12px)" : "none",
          boxShadow: navSolid ? "0 6px 24px rgba(10,58,77,.1)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "14px clamp(18px,4vw,40px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <a href="#top" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/miyata-logo-trans.png"
              alt="ミヤタアスリートクラブ"
              style={{ height: "92px", width: "auto", display: "block" }}
            />
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px,2.4vw,30px)" }}>
            <a href="#about" style={{ textDecoration: "none", color: "#0c3a4d", fontWeight: 700, fontSize: "14px" }}>
              教室について
            </a>
            <button
              onClick={openCoaches}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 0,
                color: "#0c3a4d",
                fontWeight: 700,
                fontSize: "14px",
                fontFamily: "'Zen Kaku Gothic New',sans-serif",
              }}
            >
              コーチ
            </button>
            <a href="#pricing" style={{ textDecoration: "none", color: "#0c3a4d", fontWeight: 700, fontSize: "14px" }}>
              料金
            </a>
            <a href="#access" style={{ textDecoration: "none", color: "#0c3a4d", fontWeight: 700, fontSize: "14px" }}>
              アクセス
            </a>
            <Hoverable
              as="button"
              onClick={openTrial}
              baseStyle={{
                fontFamily: "'Zen Maru Gothic',sans-serif",
                border: "none",
                cursor: "pointer",
                background: accent,
                color: "#fff",
                fontWeight: 900,
                fontSize: "14px",
                padding: "11px 20px",
                borderRadius: "999px",
                boxShadow: "0 8px 20px rgba(255,106,61,.38)",
                transition: "transform .2s ease, box-shadow .2s ease",
              }}
              hoverStyle={{ transform: "translateY(-2px)", boxShadow: "0 12px 26px rgba(255,106,61,.5)" }}
            >
              無料体験予約
            </Hoverable>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <header
        id="top"
        style={{
          position: "relative",
          padding: "118px clamp(18px,4vw,40px) 0",
          background:
            "linear-gradient(180deg,#7fcdef 0%, #a6e0f2 42%, #d8f3fb 78%, #ffffff 100%)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-90px",
            right: "-40px",
            width: "330px",
            height: "330px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #fff4d6 0%, #ffe39c 45%, rgba(255,227,156,0) 70%)",
            animation: "sunGlow 6s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "absolute", top: "120px", left: "6%", width: "150px", height: "46px", background: "#ffffff", borderRadius: "40px", filter: "blur(.4px)", opacity: 0.9, animation: "floatA 9s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "200px", left: "30%", width: "90px", height: "30px", background: "#ffffff", borderRadius: "30px", opacity: 0.75, animation: "floatB 11s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "96px", right: "30%", width: "110px", height: "34px", background: "#ffffff", borderRadius: "30px", opacity: 0.8, animation: "floatA 12s ease-in-out infinite", pointerEvents: "none" }} />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(330px,1fr))",
            gap: "clamp(28px,4vw,56px)",
            alignItems: "center",
            paddingBottom: "90px",
          }}
        >
          <Reveal delay={0}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,.7)",
                border: "1.5px solid rgba(10,147,196,.25)",
                padding: "8px 16px",
                borderRadius: "999px",
                fontWeight: 800,
                fontSize: "13px",
                color: ocean,
                marginBottom: "22px",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M12 21s-7-5.2-7-10a7 7 0 1114 0c0 4.8-7 10-7 10z" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="11" r="2.4" stroke="currentColor" strokeWidth="2" />
              </svg>
              コザ運動公園 陸上競技場
            </div>
            <h1
              style={{
                fontFamily: "'Zen Maru Gothic',sans-serif",
                fontWeight: 900,
                fontSize: "clamp(34px,5.4vw,60px)",
                lineHeight: 1.18,
                margin: "0 0 18px",
                color: "#0a3346",
                letterSpacing: ".01em",
              }}
            >
              走るって、
              <br />
              <span style={{ color: ocean }}>こんなに楽しい。</span>
            </h1>
            <p
              style={{
                fontSize: "clamp(15px,1.7vw,18px)",
                lineHeight: 1.9,
                color: "#326073",
                margin: "0 0 30px",
                maxWidth: "30em",
              }}
            >
              沖縄の青空の下で、かけっこが得意になる。小学生から一般まで通える陸上教室。専門コーチが「走る・跳ぶ」の基礎から、楽しく丁寧に教えます。
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center" }}>
              <Hoverable
                as="button"
                onClick={openTrial}
                baseStyle={{
                  fontFamily: "'Zen Maru Gothic',sans-serif",
                  border: "none",
                  cursor: "pointer",
                  background: accent,
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: "17px",
                  padding: "17px 32px",
                  borderRadius: "999px",
                  boxShadow: "0 14px 30px rgba(255,106,61,.4)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "transform .2s ease, box-shadow .2s ease",
                }}
                hoverStyle={{ transform: "translateY(-3px)", boxShadow: "0 18px 38px rgba(255,106,61,.52)" }}
              >
                無料で体験・見学を予約する
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Hoverable>
              <Hoverable
                as="a"
                href="#pricing"
                baseStyle={{
                  textDecoration: "none",
                  fontFamily: "'Zen Maru Gothic',sans-serif",
                  background: "#fff",
                  color: ocean,
                  fontWeight: 800,
                  fontSize: "16px",
                  padding: "16px 28px",
                  borderRadius: "999px",
                  border: "2px solid rgba(10,147,196,.25)",
                  boxShadow: "0 8px 20px rgba(10,147,196,.12)",
                  transition: "transform .2s ease",
                }}
                hoverStyle={{ transform: "translateY(-2px)" }}
              >
                料金プランを見る
              </Hoverable>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", marginTop: "26px" }}>
              {["定員20名で安心", "手ぶらでOK・まずは体験から"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", fontWeight: 700, color: "#2e5d70" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="rgba(31,176,107,.16)" />
                    <path d="M8 12.5l2.5 2.5L16 9" stroke="#1fb06b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={180} style={{ position: "relative" }}>
            {/* free badge */}
            <div style={{ position: "absolute", top: "-26px", right: "-12px", zIndex: 6, width: "118px", height: "118px", pointerEvents: "none" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: accent, animation: "pulseRing 2.4s ease-out infinite" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: accent, animation: "pulseRing 2.4s ease-out infinite 1.2s" }} />
              <Hoverable
                as="div"
                onClick={openTrial}
                role="button"
                aria-label="体験・見学を無料で予約する"
                baseStyle={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: "linear-gradient(150deg,#ff7d4a,#ff5a2b)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  boxShadow: "0 12px 26px rgba(255,90,43,.45)",
                  animation: "bob 3s ease-in-out infinite",
                  pointerEvents: "auto",
                  cursor: "pointer",
                  transition: "transform .2s ease",
                }}
                hoverStyle={{ transform: "scale(1.06)" }}
              >
                <span style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "11px", letterSpacing: ".02em" }}>体験・見学</span>
                <span style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "25px", lineHeight: 1, marginTop: "1px" }}>無料</span>
              </Hoverable>
            </div>

            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4 / 3",
                borderRadius: "28px",
                overflow: "hidden",
                boxShadow: "0 30px 60px rgba(11,58,77,.28)",
                border: "6px solid #fff",
                background: "#cdeefa",
              }}
            >
              <video
                ref={videoRef}
                src="/assets/intro-video.mp4"
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="metadata"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
            <div style={{ textAlign: "center", marginTop: "14px", fontSize: "12px", color: "#5a7d8c", fontWeight: 600, fontFamily: "'Zen Kaku Gothic New',sans-serif" }}>
              ＊コザ運動公園 陸上競技場での練習風景
            </div>
          </Reveal>
        </div>

        {/* wave divider */}
        <div style={{ position: "absolute", left: 0, bottom: "-1px", width: "100%", lineHeight: 0, pointerEvents: "none" }}>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: "100%", height: "90px", display: "block" }}>
            <path d="M0,40 C240,110 480,110 720,70 C960,30 1200,30 1440,80 L1440,120 L0,120 Z" fill="#ffffff" />
          </svg>
        </div>
      </header>

      {/* ===== OUR COMMITMENT ===== */}
      <section style={{ background: "#ffffff", padding: "clamp(44px,7vw,88px) clamp(18px,4vw,40px) clamp(8px,2vw,20px)" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <Reveal delay={0} style={{ textAlign: "center", marginBottom: "clamp(30px,4vw,48px)" }}>
            <div style={{ fontWeight: 900, letterSpacing: ".2em", color: accent, fontSize: "13px", marginBottom: "14px" }}>OUR COMMITMENT</div>
            <h2 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "clamp(26px,4vw,44px)", margin: "0 0 18px", color: "#0a3346", lineHeight: 1.32 }}>
              “ひとくくり”に、
              <br />
              しない。
            </h2>
            <p style={{ maxWidth: "33em", margin: "0 auto", fontSize: "clamp(14.5px,1.7vw,16.5px)", lineHeight: 2, color: "#48707f" }}>
              多くの教室では、はば広い年齢の子どもたちをまとめて指導します。けれど、5歳と中学生では、伸ばすべき力も、体の使い方もまるで違う。だから私たちは、あえて
              <b style={{ color: "#0a3346" }}>学年・成長段階で3つのコースに分け</b>
              、人数をしぼって指導します。それが、ミヤタアスリートクラブのこだわりです。
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "clamp(16px,2.4vw,22px)" }}>
            <Reveal delay={0} style={{ position: "relative", background: "#f5fbfe", border: "1.5px solid #e2f1f8", borderRadius: "22px", padding: "30px 26px", overflow: "hidden", transition: "transform .3s ease, box-shadow .3s ease" }} hoverStyle={{ transform: "translateY(-6px)", boxShadow: "0 20px 40px rgba(10,147,196,.14)" }}>
              <div style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "13px", color: ocean, letterSpacing: ".08em", marginBottom: "14px" }}>こだわり 01</div>
              <h3 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "19px", margin: "0 0 11px", color: "#0a3346", lineHeight: 1.45 }}>成長に合わせて、<br />教え方を変える。</h3>
              <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.9, color: "#48707f" }}>年齢や体の発達段階によって、適した「体の動かし方」は変わります。一人ひとりの“いま”に合った指導で、ムリなく、いちばん伸びる時期を逃しません。</p>
            </Reveal>
            <Reveal delay={120} style={{ position: "relative", background: "linear-gradient(165deg,#0c3a4d,#0a93c4)", borderRadius: "22px", padding: "30px 26px", overflow: "hidden", boxShadow: "0 18px 40px rgba(10,58,77,.22)", transition: "transform .3s ease" }} hoverStyle={{ transform: "translateY(-7px)" }}>
              <div style={{ position: "absolute", top: "-26px", right: "-18px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,.07)" }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "13px", color: "#ffe39c", letterSpacing: ".08em", marginBottom: "14px" }}>こだわり 02</div>
                <h3 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "19px", margin: "0 0 11px", color: "#fff", lineHeight: 1.45 }}>だから、3つの<br />コースに分ける。</h3>
                <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.9, color: "rgba(255,255,255,.92)" }}>学年で分けない教室が多いなか、私たちは低学年・高学年・アスリート育成の3コース制。その年代に本当に必要な動きを、ていねいに積み上げていきます。</p>
              </div>
            </Reveal>
            <Reveal delay={240} style={{ position: "relative", background: "#fff6f1", border: "1.5px solid #ffe0d3", borderRadius: "22px", padding: "30px 26px", overflow: "hidden", transition: "transform .3s ease, box-shadow .3s ease" }} hoverStyle={{ transform: "translateY(-6px)", boxShadow: "0 20px 40px rgba(255,106,61,.16)" }}>
              <div style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "13px", color: accent, letterSpacing: ".08em", marginBottom: "14px" }}>こだわり 03</div>
              <h3 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "19px", margin: "0 0 11px", color: "#0a3346", lineHeight: 1.45 }}>少人数で、ひとりに<br />向き合う。</h3>
              <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.9, color: "#7a5546" }}>各コース<b style={{ color: "#c2491f" }}>定員20名</b>。人数をしぼるからこそ、コーチの目がきちんと届きます。「ちゃんと見てもらえている」——その安心感が、子どもの“できた！”を増やします。</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== WHY / ABOUT ===== */}
      <section id="about" style={{ background: "#ffffff", padding: "clamp(40px,7vw,86px) clamp(18px,4vw,40px) clamp(30px,5vw,60px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal delay={0} style={{ textAlign: "center", marginBottom: "clamp(30px,4vw,46px)" }}>
            <div style={{ fontWeight: 900, letterSpacing: ".2em", color: accent, fontSize: "13px", marginBottom: "12px" }}>WHY TRACK &amp; FIELD</div>
            <h2 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "clamp(26px,3.8vw,42px)", margin: "0 0 16px", color: "#0a3346", lineHeight: 1.3 }}>
              陸上は、すべての<br />スポーツの<span style={{ color: ocean }}>土台</span>になる。
            </h2>
            <p style={{ maxWidth: "32em", margin: "0 auto", fontSize: "clamp(14.5px,1.7vw,16px)", lineHeight: 1.95, color: "#48707f" }}>
              走る・跳ぶ・投げる——陸上で育つ「基礎運動能力」は、どんな競技でも“活躍できる力”に。いま夢中なスポーツにも、これから出会う競技にも、ずっと生きてきます。これがミヤタアスリートクラブで身につく、一生モノの財産です。
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(168px,1fr))", gap: "14px", marginBottom: "clamp(24px,3vw,36px)" }}>
            {SKILLS.map((sk) => (
              <Reveal
                key={sk.name}
                delay={sk.delay}
                style={{ background: "#ffffff", border: "1px solid #e9eef2", borderRadius: "18px", padding: "30px 18px 26px", textAlign: "center", transition: "transform .3s ease, box-shadow .3s ease, border-color .3s ease" }}
                hoverStyle={{ transform: "translateY(-6px)", boxShadow: "0 22px 44px rgba(10,58,77,.12)", borderColor: "#cfe0e8" }}
              >
                <div style={{ width: "72px", height: "72px", margin: "0 auto 16px", borderRadius: "50%", border: "1.5px solid #e7eef2", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg,#ffffff,#f4f9fb)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/assets/${sk.icon}`} alt={sk.name} style={{ width: "50px", height: "50px", objectFit: "contain", display: "block" }} />
                </div>
                <div style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "16px", color: "#0a3346" }}>{sk.name}</div>
                <div style={{ width: "26px", height: "2px", background: accent, borderRadius: "2px", margin: "11px auto 10px" }} />
                <div style={{ fontSize: "11px", letterSpacing: ".13em", fontWeight: 800, color: ocean }}>{sk.tag}</div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120} style={{ position: "relative", overflow: "hidden", borderRadius: "22px", background: "linear-gradient(120deg,#0c3a4d,#0a93c4)", padding: "clamp(24px,3.5vw,34px) clamp(22px,4vw,40px)", textAlign: "center", boxShadow: "0 18px 40px rgba(10,58,77,.24)" }}>
            <div style={{ position: "absolute", top: "-30px", right: "-20px", width: "140px", height: "140px", borderRadius: "50%", background: "rgba(255,255,255,.08)" }} />
            <div style={{ position: "relative", zIndex: 2, fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, color: "#fff", fontSize: "clamp(18px,2.6vw,24px)", marginBottom: "15px" }}>だから、あらゆるスポーツに活きる。</div>
            <div style={{ position: "relative", zIndex: 2, display: "flex", flexWrap: "wrap", gap: "9px", justifyContent: "center" }}>
              {SPORTS.map((sp) => (
                <span key={sp} style={{ background: "rgba(255,255,255,.16)", border: "1px solid rgba(255,255,255,.28)", color: "#fff", fontWeight: 800, fontSize: "13.5px", padding: "7px 15px", borderRadius: "999px" }}>{sp}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== FREE TRIAL BANNER ===== */}
      <section id="trial" style={{ padding: "clamp(20px,4vw,40px) clamp(18px,4vw,40px)" }}>
        <Reveal delay={0} style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", overflow: "hidden", background: "linear-gradient(135deg,var(--ocean,#0a93c4) 0%, #1cb3d8 55%, #36c7e3 100%)", borderRadius: "28px", padding: "clamp(32px,5vw,56px) clamp(26px,5vw,56px)", boxShadow: "0 24px 50px rgba(10,147,196,.3)" }}>
          <div style={{ position: "absolute", top: "-40px", right: "-20px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,.12)" }} />
          <div style={{ position: "absolute", bottom: "-60px", left: "30%", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255,255,255,.08)" }} />
          <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "28px", alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-block", background: accent, color: "#fff", fontWeight: 900, fontFamily: "'Zen Maru Gothic',sans-serif", fontSize: "13px", padding: "7px 16px", borderRadius: "999px", marginBottom: "16px", boxShadow: "0 8px 18px rgba(255,90,43,.35)" }}>入会前にまずは体験</div>
              <h2 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, color: "#fff", fontSize: "clamp(28px,4.4vw,46px)", margin: "0 0 12px", lineHeight: 1.25 }}>見学・体験は<br /><span style={{ color: "#ffe39c" }}>無料</span>です。</h2>
              <p style={{ color: "rgba(255,255,255,.92)", fontSize: "15px", lineHeight: 1.85, margin: 0, maxWidth: "28em" }}>「うちの子に合うかな？」まずは練習の様子を見にきてください。雰囲気を感じてから、ゆっくり決められます。しつこい勧誘はありません。</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <Hoverable
                as="button"
                onClick={openTrial}
                baseStyle={{ fontFamily: "'Zen Maru Gothic',sans-serif", border: "none", cursor: "pointer", background: "#fff", color: accent, fontWeight: 900, fontSize: "18px", padding: "20px 40px", borderRadius: "999px", boxShadow: "0 16px 34px rgba(0,0,0,.18)", display: "inline-flex", alignItems: "center", gap: "10px", transition: "transform .2s ease" }}
                hoverStyle={{ transform: "translateY(-3px) scale(1.02)" }}
              >
                無料で体験・見学を予約する
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Hoverable>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "12.5px", marginTop: "12px", fontWeight: 600 }}>30秒で予約完了 / 持ち物いりません</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" style={{ background: "#ffffff", padding: "clamp(44px,6vw,80px) clamp(18px,4vw,40px)" }}>
        <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
          <Reveal delay={0} style={{ textAlign: "center", marginBottom: "clamp(30px,4vw,48px)" }}>
            <div style={{ fontWeight: 900, letterSpacing: ".2em", color: accent, fontSize: "13px", marginBottom: "12px" }}>PRICING</div>
            <h2 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "clamp(26px,3.6vw,40px)", margin: "0 0 10px", color: "#0a3346" }}>料金プラン</h2>
            <p style={{ margin: 0, color: "#48707f", fontSize: "15px" }}>小学生から一般まで、年齢・レベルで選べる3コース。毎月クレジットカード決済（自動更新）で、いつでも切り替えできます。</p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "20px", alignItems: "stretch" }}>
            {COURSES.map((c) => (
              <Reveal
                key={c.key}
                delay={c.delay}
                style={{ position: "relative", background: "#fff", border: `2px solid ${c.border}`, borderRadius: "22px", overflow: "hidden", display: "flex", flexDirection: "column", transition: "transform .3s ease, box-shadow .3s ease" }}
                hoverStyle={{ transform: "translateY(-6px)", boxShadow: "0 22px 44px rgba(10,58,77,.16)" }}
              >
                <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 2, background: "rgba(255,255,255,.92)", color: c.color, fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "11px", padding: "5px 11px", borderRadius: "999px", boxShadow: "0 4px 10px rgba(0,0,0,.12)" }}>定員20名</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/assets/${c.img}`} alt={c.title} style={{ width: "100%", height: "140px", display: "block", objectFit: "cover" }} />
                <div style={{ padding: "22px 22px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <span style={{ display: "inline-block", background: c.tagBg, color: c.color, fontWeight: 800, fontSize: "11.5px", padding: "4px 12px", borderRadius: "999px", marginBottom: "9px", alignSelf: "flex-start" }}>{c.grade}</span>
                  <h3 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "21px", margin: 0, color: c.color, lineHeight: 1.25 }}>{c.title}</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "14px 0" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "#f3fbfe", border: "1px solid #e2f1f8", color: "#33606f", fontWeight: 700, fontSize: "12.5px", padding: "5px 11px", borderRadius: "999px" }}>{c.days}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "#f3fbfe", border: "1px solid #e2f1f8", color: "#33606f", fontWeight: 700, fontSize: "12.5px", padding: "5px 11px", borderRadius: "999px" }}>{c.time}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px", margin: "2px 0 12px" }}>
                    <span style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "40px", color: "#0a3346" }}>{yen(planByKey[c.key].monthlyYen)}</span>
                    <span style={{ fontSize: "14px", color: "#5a7d8c", fontWeight: 700 }}>/月（税込）</span>
                  </div>
                  <p style={{ margin: "0 0 20px", fontSize: "13.5px", lineHeight: 1.8, color: "#5a7d8c" }}>{c.body}</p>
                  <Hoverable
                    as="button"
                    onClick={() => openPlan(c.key)}
                    baseStyle={{ marginTop: "auto", fontFamily: "'Zen Maru Gothic',sans-serif", border: "none", cursor: "pointer", background: c.color, color: "#fff", fontWeight: 900, fontSize: "15px", padding: "15px", borderRadius: "999px", boxShadow: "0 12px 24px rgba(10,58,77,.2)", transition: "transform .2s ease" }}
                    hoverStyle={{ transform: "scale(1.03)" }}
                  >
                    このコースで申し込む
                  </Hoverable>
                </div>
              </Reveal>
            ))}
          </div>

          <p style={{ textAlign: "center", color: "#5a7d8c", fontSize: "13.5px", fontWeight: 700, margin: "20px 0 0" }}>各コース定員20名 <span style={{ color: "#88a3ae", fontWeight: 600 }}>※エリア拡大に伴い増員予定</span></p>

          <Reveal delay={80} style={{ marginTop: "26px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "14px" }}>
            <div style={{ background: "#fff6f1", border: "1.5px solid #ffe0d3", borderRadius: "18px", padding: "18px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "12.5px", color: "#9a6a55", fontWeight: 700 }}>入会金</div>
              <div style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "22px", color: accent, marginTop: "4px" }}>{yen(JOIN_FEE_YEN)}</div>
            </div>
            <div style={{ background: "#f3fbfe", border: "1.5px solid #d9eef7", borderRadius: "18px", padding: "18px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "12.5px", color: "#3f7287", fontWeight: 700 }}>更新料（年1回）</div>
              <div style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "22px", color: ocean, marginTop: "4px" }}>{yen(RENEWAL_FEE_YEN)}</div>
            </div>
            <div style={{ background: "#f6f4ff", border: "1.5px solid #e4def7", borderRadius: "18px", padding: "18px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "12.5px", color: "#6a5f9a", fontWeight: 700 }}>お支払い</div>
              <div style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "15px", color: "#5b4fa3", marginTop: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="3" stroke="#5b4fa3" strokeWidth="2" /><path d="M3 9h18" stroke="#5b4fa3" strokeWidth="2" /></svg>
                毎月カード決済
              </div>
            </div>
          </Reveal>
          <p style={{ textAlign: "center", color: "#88a3ae", fontSize: "12.5px", margin: "18px 0 0" }}>＊クレジットカードによる月額自動決済（Stripe）。ご解約はいつでも可能です。</p>

          {/* weekly schedule */}
          <Reveal delay={0} style={{ marginTop: "clamp(40px,5vw,60px)" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "8px", marginBottom: "16px" }}>
              <h3 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "clamp(20px,2.6vw,26px)", margin: 0, color: "#0a3346" }}>週間スケジュール</h3>
              <div style={{ color: accent, fontWeight: 800, fontSize: "13px" }}>※火・土・日は休講です</div>
            </div>
            <div style={{ overflowX: "auto", borderRadius: "18px", border: "1.5px solid #e2f1f8", boxShadow: "0 12px 30px rgba(10,147,196,.08)" }}>
              <table style={{ width: "100%", minWidth: "580px", tableLayout: "fixed", borderCollapse: "collapse", background: "#fff", fontSize: "13px" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "14px 10px", background: "#0a3346", color: "#fff", fontWeight: 800, textAlign: "center", width: "78px" }}>時間</th>
                    <th style={{ padding: "14px 10px", background: "#0a93c4", color: "#fff", fontWeight: 800, textAlign: "center" }}>月</th>
                    <th style={{ padding: "14px 10px", background: "#9bb6c2", color: "#fff", fontWeight: 800, textAlign: "center" }}>火</th>
                    <th style={{ padding: "14px 10px", background: "#0a93c4", color: "#fff", fontWeight: 800, textAlign: "center" }}>水</th>
                    <th style={{ padding: "14px 10px", background: "#0a93c4", color: "#fff", fontWeight: 800, textAlign: "center" }}>木</th>
                    <th style={{ padding: "14px 10px", background: "#0a93c4", color: "#fff", fontWeight: 800, textAlign: "center" }}>金</th>
                    <th style={{ padding: "14px 10px", background: "#9bb6c2", color: "#fff", fontWeight: 800, textAlign: "center" }}>土</th>
                    <th style={{ padding: "14px 10px", background: "#9bb6c2", color: "#fff", fontWeight: 800, textAlign: "center" }}>日</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "14px 8px", textAlign: "center", fontWeight: 800, color: "#0a3346", background: "#f5fbfe", borderTop: "1px solid #e2f1f8" }}>17:00<br />〜18:00</td>
                    <td style={{ padding: "14px 8px", textAlign: "center", fontWeight: 700, color: "#0a7d4f", background: "#eefaf3", borderTop: "1px solid #e2f1f8" }}>低学年<br />コース</td>
                    <td style={{ padding: "14px 8px", textAlign: "center", fontWeight: 700, color: "#9aa7ae", background: "#f3f5f6", borderTop: "1px solid #e2f1f8" }}>休講</td>
                    <td style={{ padding: "14px 8px", textAlign: "center", fontWeight: 700, color: "#c2491f", background: "#fff3ee", borderTop: "1px solid #e2f1f8" }}>高学年<br />コース</td>
                    <td style={{ padding: "14px 8px", textAlign: "center", fontWeight: 700, color: "#0a7d4f", background: "#eefaf3", borderTop: "1px solid #e2f1f8" }}>低学年コース<br />（体操教室）</td>
                    <td style={{ padding: "14px 8px", textAlign: "center", fontWeight: 700, color: "#c2491f", background: "#fff3ee", borderTop: "1px solid #e2f1f8" }}>高学年<br />コース</td>
                    <td style={{ padding: "14px 8px", textAlign: "center", fontWeight: 700, color: "#9aa7ae", background: "#f3f5f6", borderTop: "1px solid #e2f1f8" }}>休講</td>
                    <td style={{ padding: "14px 8px", textAlign: "center", fontWeight: 700, color: "#9aa7ae", background: "#f3f5f6", borderTop: "1px solid #e2f1f8" }}>休講</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "14px 8px", textAlign: "center", fontWeight: 800, color: "#0a3346", background: "#f5fbfe", borderTop: "1px solid #e2f1f8" }}>18:15<br />〜19:15</td>
                    <td style={{ padding: "14px 8px", textAlign: "center", fontWeight: 700, color: "#0a5f8a", background: "#eef6fb", borderTop: "1px solid #e2f1f8" }}>アスリート<br />育成</td>
                    <td style={{ padding: "14px 8px", textAlign: "center", fontWeight: 700, color: "#9aa7ae", background: "#f3f5f6", borderTop: "1px solid #e2f1f8" }}>休講</td>
                    <td style={{ padding: "14px 8px", textAlign: "center", fontWeight: 700, color: "#0a5f8a", background: "#eef6fb", borderTop: "1px solid #e2f1f8" }}>アスリート<br />育成</td>
                    <td style={{ padding: "14px 8px", textAlign: "center", fontWeight: 700, color: "#c7d0d5", background: "#fafbfb", borderTop: "1px solid #e2f1f8" }}>—</td>
                    <td style={{ padding: "14px 8px", textAlign: "center", fontWeight: 700, color: "#0a5f8a", background: "#eef6fb", borderTop: "1px solid #e2f1f8" }}>アスリート<br />育成</td>
                    <td style={{ padding: "14px 8px", textAlign: "center", fontWeight: 700, color: "#9aa7ae", background: "#f3f5f6", borderTop: "1px solid #e2f1f8" }}>休講</td>
                    <td style={{ padding: "14px 8px", textAlign: "center", fontWeight: 700, color: "#9aa7ae", background: "#f3f5f6", borderTop: "1px solid #e2f1f8" }}>休講</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ color: "#88a3ae", fontSize: "12px", margin: "12px 0 0" }}>※大会やイベントにより、スケジュールは変更になる場合があります。</p>
          </Reveal>
        </div>
      </section>

      {/* ===== ACCESS ===== */}
      <section id="access" style={{ background: "linear-gradient(180deg,#ffffff,#eaf7fc)", padding: "clamp(44px,6vw,80px) clamp(18px,4vw,40px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal delay={0} style={{ textAlign: "center", marginBottom: "clamp(28px,4vw,44px)" }}>
            <div style={{ fontWeight: 900, letterSpacing: ".2em", color: accent, fontSize: "13px", marginBottom: "12px" }}>ACCESS</div>
            <h2 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "clamp(26px,3.6vw,40px)", margin: 0, color: "#0a3346" }}>練習場所</h2>
          </Reveal>
          <Reveal delay={80} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "26px", alignItems: "stretch" }}>
            <div style={{ position: "relative", borderRadius: "24px", overflow: "hidden", minHeight: "300px", background: "repeating-linear-gradient(45deg,#dceef6,#dceef6 14px,#e8f4fa 14px,#e8f4fa 28px)", border: "1.5px solid #cfe6f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center", color: "#6f93a2" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 8px", display: "block" }}><path d="M12 21s-7-5.2-7-10a7 7 0 1114 0c0 4.8-7 10-7 10z" stroke="#6f93a2" strokeWidth="2" /><circle cx="12" cy="11" r="2.4" stroke="#6f93a2" strokeWidth="2" /></svg>
                <div style={{ fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontSize: "12px", letterSpacing: ".05em" }}>Google Map を埋め込み</div>
              </div>
            </div>
            <div style={{ background: "#fff", border: "1.5px solid #e2f1f8", borderRadius: "24px", padding: "clamp(26px,4vw,38px)", boxShadow: "0 16px 36px rgba(10,147,196,.1)" }}>
              <h3 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "23px", margin: "0 0 6px", color: "#0a3346" }}>コザ運動公園 陸上競技場</h3>
              <div style={{ color: ocean, fontWeight: 700, fontSize: "13.5px", marginBottom: "22px" }}>沖縄県沖縄市</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {ACCESS_ROWS.map((a) => (
                  <div key={a.tag} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div style={{ flex: "none", width: "38px", height: "38px", borderRadius: "11px", background: "#f3fbfe", display: "flex", alignItems: "center", justifyContent: "center", color: ocean, fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "12px" }}>{a.tag}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "14.5px", color: "#0a3346" }}>{a.label}</div>
                      <div style={{ fontSize: "13.5px", color: "#5a7d8c", marginTop: "2px", lineHeight: 1.7 }}>{a.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Hoverable
                as="button"
                onClick={openTrial}
                baseStyle={{ marginTop: "26px", width: "100%", fontFamily: "'Zen Maru Gothic',sans-serif", border: "none", cursor: "pointer", background: accent, color: "#fff", fontWeight: 900, fontSize: "16px", padding: "15px", borderRadius: "999px", boxShadow: "0 12px 26px rgba(255,90,43,.34)", transition: "transform .2s ease" }}
                hoverStyle={{ transform: "translateY(-2px)" }}
              >
                この場所で体験・見学を予約する
              </Hoverable>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg,#eaf7fc,#7fcdef)", padding: "clamp(50px,7vw,92px) clamp(18px,4vw,40px) clamp(70px,8vw,110px)", textAlign: "center" }}>
        <div style={{ position: "absolute", top: "30px", left: "12%", width: "120px", height: "36px", background: "#fff", borderRadius: "30px", opacity: 0.7, animation: "floatA 10s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: "70px", right: "16%", width: "90px", height: "28px", background: "#fff", borderRadius: "30px", opacity: 0.65, animation: "floatB 12s ease-in-out infinite" }} />
        <Reveal delay={0} style={{ position: "relative", zIndex: 2, maxWidth: "680px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "clamp(28px,4.6vw,48px)", margin: "0 0 16px", color: "#0a3346", lineHeight: 1.3 }}>青空の下で、<br />最初の一歩を踏み出そう。</h2>
          <p style={{ color: "#326073", fontSize: "16px", lineHeight: 1.9, margin: "0 0 30px" }}>まずは無料の体験・見学から。コーチ・お友だち・グラウンドの雰囲気を、その目で確かめてください。</p>
          <Hoverable
            as="button"
            onClick={openTrial}
            baseStyle={{ fontFamily: "'Zen Maru Gothic',sans-serif", border: "none", cursor: "pointer", background: accent, color: "#fff", fontWeight: 900, fontSize: "19px", padding: "20px 44px", borderRadius: "999px", boxShadow: "0 18px 38px rgba(255,90,43,.42)", display: "inline-flex", alignItems: "center", gap: "10px", transition: "transform .2s ease" }}
            hoverStyle={{ transform: "translateY(-3px) scale(1.02)" }}
          >
            無料で体験・見学を予約する
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Hoverable>
        </Reveal>
      </section>

      {/* ===== RECRUIT LINKS ===== */}
      <section style={{ background: "linear-gradient(180deg,#ffffff,#f1fafe)", padding: "clamp(34px,5vw,64px) clamp(18px,4vw,40px)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <Reveal delay={0} style={{ textAlign: "center", marginBottom: "clamp(22px,3vw,32px)" }}>
            <div style={{ fontWeight: 900, letterSpacing: ".2em", color: accent, fontSize: "13px", marginBottom: "10px" }}>JOIN US</div>
            <h2 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "clamp(22px,3vw,32px)", margin: 0, color: "#0a3346" }}>一緒に、子どもたちを応援しませんか</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "18px" }}>
            <Reveal as="a" delay={60} {...{ href: "/coach" }} style={{ textDecoration: "none", position: "relative", overflow: "hidden", display: "block", background: "linear-gradient(150deg,#ff7d4a,#ff5a2b)", borderRadius: "24px", padding: "30px 28px", boxShadow: "0 18px 38px rgba(255,90,43,.3)", transition: "transform .3s ease, box-shadow .3s ease" }} hoverStyle={{ transform: "translateY(-6px)", boxShadow: "0 26px 50px rgba(255,90,43,.42)" }}>
              <div style={{ position: "absolute", top: "-30px", right: "-20px", width: "130px", height: "130px", borderRadius: "50%", background: "rgba(255,255,255,.12)" }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: ".12em", color: "rgba(255,255,255,.85)", marginBottom: "8px" }}>COACH</div>
                <h3 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "24px", margin: "0 0 8px", color: "#fff" }}>コーチ募集</h3>
                <p style={{ margin: "0 0 16px", fontSize: "13.5px", lineHeight: 1.7, color: "rgba(255,255,255,.92)" }}>子どもたちの「できた！」を支える仲間を募集中。未経験・資格不問です。</p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "14px", color: "#fff" }}>募集ページを見る<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              </div>
            </Reveal>
            <Reveal as="a" delay={140} {...{ href: "/sponsor" }} style={{ textDecoration: "none", position: "relative", overflow: "hidden", display: "block", background: "linear-gradient(150deg,#0c3a4d,#0a93c4)", borderRadius: "24px", padding: "30px 28px", boxShadow: "0 18px 38px rgba(10,58,77,.3)", transition: "transform .3s ease, box-shadow .3s ease" }} hoverStyle={{ transform: "translateY(-6px)", boxShadow: "0 26px 50px rgba(10,58,77,.42)" }}>
              <div style={{ position: "absolute", top: "-30px", right: "-20px", width: "130px", height: "130px", borderRadius: "50%", background: "rgba(255,255,255,.1)" }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: ".12em", color: "#ffe39c", marginBottom: "8px" }}>SPONSOR</div>
                <h3 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "24px", margin: "0 0 8px", color: "#fff" }}>スポンサー募集</h3>
                <p style={{ margin: "0 0 16px", fontSize: "13.5px", lineHeight: 1.7, color: "rgba(255,255,255,.9)" }}>地域の子どもたちを一緒に応援してくださる協賛企業を募集しています。</p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "14px", color: "#fff" }}>募集ページを見る<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              </div>
            </Reveal>
          </div>

          {/* 関連事業 & コラボ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "18px", marginTop: "18px" }}>
            <Reveal delay={60} style={{ background: "#fff", border: "1px solid #e4ebef", borderRadius: "22px", padding: "26px 26px", boxShadow: "0 8px 24px rgba(10,58,77,.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: ocean }} />
                <span style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "15px", color: "#0a3346" }}>ミヤタサービス関連事業</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f5fbfe", border: "1px solid #e2f1f8", borderRadius: "13px", padding: "13px 16px" }}>
                  <div style={{ flex: "none", width: "38px", height: "38px", borderRadius: "11px", background: "linear-gradient(140deg,#0a93c4,#27c0e6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 5l-7 7M14 4l6 6M9 13l-5 5 2 2 5-5M11 11l2 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 800, fontSize: "14.5px", color: "#0a3346" }}>清掃事業部</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f5fbfe", border: "1px solid #e2f1f8", borderRadius: "13px", padding: "13px 16px" }}>
                  <div style={{ flex: "none", width: "38px", height: "38px", borderRadius: "11px", background: "linear-gradient(140deg,#5b4fa3,#8a6ad6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="3" stroke="#fff" strokeWidth="2" /><path d="M9 4v16M15 4v16M4 9h5M4 15h5M15 9h5M15 15h5" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
                  </div>
                  <div style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 800, fontSize: "14.5px", color: "#0a3346" }}>AI / DX事業部</div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={140} style={{ background: "#fff", border: "1px solid #e4ebef", borderRadius: "22px", padding: "26px 26px", boxShadow: "0 8px 24px rgba(10,58,77,.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: accent }} />
                <span style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "15px", color: "#0a3346" }}>コラボ</span>
              </div>
              <Hoverable
                as="a"
                href={GENKIDS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={openGenkids}
                baseStyle={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "14px", background: "#fff7f4", border: "1px solid #ffe0d3", borderRadius: "13px", padding: "15px 16px", transition: "transform .2s ease, box-shadow .2s ease" }}
                hoverStyle={{ transform: "translateY(-2px)", boxShadow: "0 12px 26px rgba(255,106,61,.16)" }}
              >
                <div style={{ flex: "none", width: "46px", height: "46px", borderRadius: "13px", background: "linear-gradient(140deg,#feda75,#d62976 55%,#962fbf)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="#fff" strokeWidth="2" /><circle cx="12" cy="12" r="4" stroke="#fff" strokeWidth="2" /><circle cx="17" cy="7" r="1.3" fill="#fff" /></svg>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "15.5px", color: "#0a3346" }}>けんきっず体操クラブ</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", color: accent, fontWeight: 800, marginTop: "3px" }}>
                    Instagramを見る
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </div>
              </Hoverable>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ background: "#0a3346", color: "#cfe3ec", padding: "40px clamp(18px,4vw,40px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "space-between", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/miyata-logo-dark.png" alt="ミヤタアスリートクラブ" style={{ height: "88px", width: "auto", display: "block" }} />
          <div style={{ fontSize: "12.5px", color: "#8fb3c2" }}>コザ運動公園 陸上競技場（沖縄県沖縄市）／ 対象 小学生〜一般</div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Hoverable as="a" href="#" target="_blank" rel="noopener" aria-label="Instagram" baseStyle={{ width: "38px", height: "38px", borderRadius: "50%", background: "rgba(255,255,255,.08)", color: "#cfe3ec", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s ease, color .2s ease" }} hoverStyle={{ background: accent, color: "#fff" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5.4" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" /><circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" /></svg>
            </Hoverable>
            <Hoverable as="a" href="#" target="_blank" rel="noopener" aria-label="X" baseStyle={{ width: "38px", height: "38px", borderRadius: "50%", background: "rgba(255,255,255,.08)", color: "#cfe3ec", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s ease, color .2s ease" }} hoverStyle={{ background: accent, color: "#fff" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.7 3h3.3l-7.2 8.2L22 21h-6.6l-5.2-6.4L4.3 21H1l7.7-8.8L2 3h6.8l4.7 5.9L17.7 3zm-1.2 16h1.8L7.6 4.9H5.7L16.5 19z" /></svg>
            </Hoverable>
            <Hoverable as="a" href="#" target="_blank" rel="noopener" aria-label="Facebook" baseStyle={{ width: "38px", height: "38px", borderRadius: "50%", background: "rgba(255,255,255,.08)", color: "#cfe3ec", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s ease, color .2s ease" }} hoverStyle={{ background: accent, color: "#fff" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7h2.3l.4-3h-2.7V9.1c0-.8.3-1.4 1.5-1.4h1.3V5.1C17.6 5 16.8 5 15.9 5c-2 0-3.4 1.2-3.4 3.6V11H10v3h2.5v7h1z" /></svg>
            </Hoverable>
            <Hoverable as="a" href="#" target="_blank" rel="noopener" aria-label="公式LINE" baseStyle={{ width: "38px", height: "38px", borderRadius: "50%", background: "#06C755", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform .2s ease" }} hoverStyle={{ transform: "translateY(-2px)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4C7 4 3 7.2 3 11.2c0 3.6 3.2 6.6 7.5 7.1.3 0 .5.2.5.5v1.5c0 .4.4.6.8.4 3-1.5 4.8-3 6-4.4 1.4-1.5 2.2-3 2.2-4.6C22 7.2 17.5 4 12 4z" /></svg>
            </Hoverable>
          </div>
          <div style={{ fontSize: "12px", color: "#6f95a6", display: "flex", gap: "14px", alignItems: "center" }}>
            © 2026 ミヤタアスリートクラブ
            <Hoverable as="button" onClick={openWithdraw} baseStyle={{ background: "transparent", border: "1px solid rgba(255,255,255,.22)", color: "#9fb9c6", fontFamily: "'Zen Kaku Gothic New',sans-serif", fontWeight: 700, fontSize: "12px", padding: "7px 14px", borderRadius: "999px", cursor: "pointer", transition: "background .2s, color .2s" }} hoverStyle={{ background: "rgba(255,255,255,.08)", color: "#e6f0f4" }}>
              退会手続き
            </Hoverable>
            <Link href="/admin" style={{ color: "#6f95a6", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,.25)" }}>スタッフ用</Link>
          </div>
        </div>
      </footer>

      {/* ===== WITHDRAW MODAL ===== */}
      {withdrawOpen && (
        <div onClick={closeWithdraw} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(8,40,55,.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "18px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "460px", maxHeight: "92vh", overflowY: "auto", background: "#fff", borderRadius: "26px", boxShadow: "0 30px 70px rgba(0,0,0,.4)", animation: "popIn .3s ease", position: "relative" }}>
            <button onClick={closeWithdraw} aria-label="閉じる" style={{ position: "absolute", top: "16px", right: "16px", zIndex: 3, width: "36px", height: "36px", borderRadius: "50%", border: "none", cursor: "pointer", background: "#f0f6f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#0c3a4d" strokeWidth="2.2" strokeLinecap="round" /></svg>
            </button>
            {withdrawn ? (
              <div style={{ padding: "48px 34px", textAlign: "center" }}>
                <div style={{ width: "78px", height: "78px", borderRadius: "50%", background: "rgba(31,176,107,.14)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", animation: "popIn .4s ease" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 10-11" stroke="#1fb06b" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <h3 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "23px", margin: "0 0 12px", color: "#0a3346" }}>退会申請を受け付けました</h3>
                <p style={{ fontSize: "14px", lineHeight: 1.85, color: "#48707f", margin: "0 0 28px" }}>担当より確認のご連絡をいたします。たくさんのご参加、ありがとうございました。またいつでもお待ちしています！</p>
                <button onClick={closeWithdraw} style={{ fontFamily: "'Zen Maru Gothic',sans-serif", border: "none", cursor: "pointer", background: ocean, color: "#fff", fontWeight: 900, fontSize: "16px", padding: "14px 34px", borderRadius: "999px" }}>閉じる</button>
              </div>
            ) : (
              <div style={{ padding: "30px 26px 28px" }}>
                <div style={{ display: "inline-block", background: "#eef3f6", color: "#5a7d8c", fontWeight: 900, fontFamily: "'Zen Maru Gothic',sans-serif", fontSize: "12px", padding: "6px 14px", borderRadius: "999px", marginBottom: "12px" }}>退会手続き</div>
                <h3 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "22px", margin: "0 0 6px", color: "#0a3346" }}>退会のご申請</h3>
                <p style={{ fontSize: "13px", color: "#5a7d8c", margin: "0 0 20px", lineHeight: 1.75 }}>下記をご入力ください。ご申請後、担当より手続きのご案内をいたします。（月末での退会となります）</p>
                <form onSubmit={submitWithdraw}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                    <label style={{ display: "block" }}>
                      <span style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#33606f", marginBottom: "5px" }}>会員名（お子さま・ご本人）</span>
                      <input type="text" placeholder="宮城 翔" style={fieldStyle} />
                    </label>
                    <label style={{ display: "block" }}>
                      <span style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#33606f", marginBottom: "5px" }}>受講コース</span>
                      <select style={fieldStyle} defaultValue="">
                        <option value="">選択してください</option>
                        <option value="低学年コース">低学年コース</option>
                        <option value="高学年コース">高学年コース</option>
                        <option value="アスリート育成コース">アスリート育成コース</option>
                      </select>
                    </label>
                    <label style={{ display: "block" }}>
                      <span style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#33606f", marginBottom: "5px" }}>退会希望月</span>
                      <input type="text" placeholder="例）７月末" style={fieldStyle} />
                    </label>
                    <label style={{ display: "block" }}>
                      <span style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#33606f", marginBottom: "5px" }}>電話番号 または メールアドレス</span>
                      <input type="text" placeholder="090-0000-0000" style={fieldStyle} />
                    </label>
                    <label style={{ display: "block" }}>
                      <span style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#33606f", marginBottom: "5px" }}>退会理由（任意）</span>
                      <textarea rows={2} placeholder="よろしければお聞かせください" style={{ ...fieldStyle, resize: "vertical" }} />
                    </label>
                  </div>
                  <button type="submit" style={{ marginTop: "20px", width: "100%", fontFamily: "'Zen Maru Gothic',sans-serif", border: "none", cursor: "pointer", background: "#0a3346", color: "#fff", fontWeight: 900, fontSize: "16px", padding: "15px", borderRadius: "999px", boxShadow: "0 12px 26px rgba(10,51,70,.28)" }}>退会を申請する</button>
                  <p style={{ textAlign: "center", fontSize: "11.5px", color: "#9bb2bc", margin: "12px 0 0" }}>＊本申請だけでは退会は確定しません。担当より確認ご連絡をいたします。</p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== COACHES OVERLAY ===== */}
      {coachesOpen && (
        <div onClick={closeCoaches} style={{ position: "fixed", inset: 0, zIndex: 210, background: "rgba(8,40,55,.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "clamp(16px,4vw,48px) 16px", overflowY: "auto" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "1080px", background: "linear-gradient(180deg,#ffffff,#f1fafe)", borderRadius: "26px", boxShadow: "0 30px 70px rgba(0,0,0,.4)", animation: "popIn .3s ease", position: "relative", padding: "clamp(28px,4vw,46px) clamp(20px,4vw,40px) clamp(30px,4vw,44px)" }}>
            <button onClick={closeCoaches} aria-label="閉じる" style={{ position: "absolute", top: "18px", right: "18px", zIndex: 3, width: "38px", height: "38px", borderRadius: "50%", border: "none", cursor: "pointer", background: "#eef4f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#0c3a4d" strokeWidth="2.2" strokeLinecap="round" /></svg>
            </button>
            <div style={{ textAlign: "center", marginBottom: "clamp(22px,3vw,34px)" }}>
              <div style={{ fontWeight: 900, letterSpacing: ".2em", color: accent, fontSize: "13px", marginBottom: "10px" }}>COACHES</div>
              <h2 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "clamp(24px,3.4vw,36px)", margin: "0 0 8px", color: "#0a3346" }}>コーチ紹介</h2>
              <p style={{ margin: 0, color: "#48707f", fontSize: "14.5px" }}>子どもから一般まで、一人ひとりに寄り添う指導者がそろっています。</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: "22px" }}>
              {COACHES.map((m) => (
                <div key={m.id} style={{ background: "#fff", border: "1.5px solid #e2f1f8", borderRadius: "22px", padding: "26px 24px", boxShadow: "0 14px 34px rgba(10,147,196,.08)", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div style={{ width: "92px", height: "92px", flex: "none", boxShadow: "0 6px 16px rgba(10,58,77,.16)", borderRadius: "50%", background: "#eef4f7", display: "flex", alignItems: "center", justifyContent: "center", color: "#9bb2bc", fontSize: "12px", textAlign: "center" }}>顔写真</div>
                    <div>
                      <span style={{ display: "inline-block", background: "#eef6fb", color: ocean, fontWeight: 800, fontSize: "11.5px", padding: "4px 11px", borderRadius: "999px", marginBottom: "7px" }}>{m.role}</span>
                      <h3 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "20px", margin: 0, color: "#0a3346" }}>{m.name}</h3>
                      <div style={{ fontSize: "12.5px", color: "#5a7d8c", fontWeight: 600, marginTop: "3px" }}>{m.specialty}</div>
                    </div>
                  </div>
                  <div style={{ height: "1px", background: "#e2f1f8", margin: "18px 0 14px" }} />
                  <div style={{ fontSize: "11.5px", fontWeight: 800, letterSpacing: ".06em", color: "#88a3ae", marginBottom: "10px" }}>実績・プロフィール</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: "9px" }}>
                    {m.achievements.map((a, j) => (
                      <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: "9px", fontSize: "13.5px", color: "#33606f", fontWeight: 600, lineHeight: 1.6 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flex: "none", marginTop: "2px" }}><circle cx="12" cy="12" r="10" fill="rgba(255,106,61,.14)" /><path d="M8 12.5l2.5 2.5L16 9" stroke="#ff6a3d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        {a}
                      </li>
                    ))}
                  </ul>
                  <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.85, color: "#5a7d8c", background: "#f5fbfe", borderRadius: "12px", padding: "14px 15px" }}>{m.message}</p>
                </div>
              ))}
            </div>
            <p style={{ textAlign: "center", color: "#9bb2bc", fontSize: "12px", margin: "22px 0 0" }}>＊お名前・写真・実績はサンプルです。実際の情報に差し替えてください。</p>
          </div>
        </div>
      )}

      {/* ===== CHECKOUT MODAL ===== */}
      {checkout && (
        <div onClick={closeCheckout} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(8,40,55,.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "18px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "520px", maxHeight: "92vh", overflowY: "auto", background: "#fff", borderRadius: "26px", boxShadow: "0 30px 70px rgba(0,0,0,.4)", animation: "popIn .3s ease", position: "relative" }}>
            <button onClick={closeCheckout} aria-label="閉じる" style={{ position: "absolute", top: "16px", right: "16px", zIndex: 3, width: "36px", height: "36px", borderRadius: "50%", border: "none", cursor: "pointer", background: "#f0f6f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#0c3a4d" strokeWidth="2.2" strokeLinecap="round" /></svg>
            </button>

            {paid ? (
              <div style={{ padding: "48px 34px", textAlign: "center" }}>
                <div style={{ width: "78px", height: "78px", borderRadius: "50%", background: "rgba(31,176,107,.14)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", animation: "popIn .4s ease" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 10-11" stroke="#1fb06b" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <h3 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "24px", margin: "0 0 12px", color: "#0a3346" }}>{isTrial ? "ご予約ありがとうございます！" : "お申し込み完了！"}</h3>
                <p style={{ fontSize: "14.5px", lineHeight: 1.85, color: "#48707f", margin: "0 0 28px" }}>
                  {isTrial
                    ? `${selLabel()} で体験・見学のご予約を受け付けました。担当より確認のご連絡をいたします。当日は動きやすい服装でお越しください！`
                    : "ご入会のお申し込みを受け付けました。担当より確認のご連絡をいたします。一緒にがんばりましょう！"}
                </p>
                <button onClick={closeCheckout} style={{ fontFamily: "'Zen Maru Gothic',sans-serif", border: "none", cursor: "pointer", background: ocean, color: "#fff", fontWeight: 900, fontSize: "16px", padding: "14px 34px", borderRadius: "999px" }}>閉じる</button>
              </div>
            ) : isTrial ? (
              <div style={{ padding: "26px 22px 26px" }}>
                <div style={{ display: "inline-block", background: "rgba(255,106,61,.12)", color: accent, fontWeight: 900, fontFamily: "'Zen Maru Gothic',sans-serif", fontSize: "12px", padding: "6px 14px", borderRadius: "999px", marginBottom: "12px" }}>無料・先着 {DAILY_TRIAL_LIMIT}組/日</div>
                <h3 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "22px", margin: "0 0 6px", color: "#0a3346" }}>体験・見学を予約する</h3>
                <p style={{ fontSize: "13px", color: "#5a7d8c", margin: "0 0 16px", lineHeight: 1.7 }}>ご希望の日を選んでください。</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "12px" }}>
                  <button onClick={() => setWeekOffset((w) => Math.max(0, w - 1))} aria-label="前の週" style={navBtnStyle(cal.canPrev)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#0c3a4d" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <div style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "14.5px", color: "#0a3346" }}>{cal.weekLabel}</div>
                  <button onClick={() => setWeekOffset((w) => Math.min(51, w + 1))} aria-label="次の週" style={navBtnStyle(cal.canNext)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#0c3a4d" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "5px" }}>
                  {cal.days.map((d) => (
                    <button
                      key={d.iso}
                      onClick={d.canBook ? () => setSelectedDate(d.iso) : undefined}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "3px",
                        padding: "8px 2px",
                        border: d.selected ? "2px solid var(--ocean,#0a93c4)" : "1.5px solid #e7eef2",
                        borderRadius: "10px",
                        background: d.selected ? "#eaf7fc" : d.canBook ? "#ffffff" : "#f4f6f7",
                        cursor: d.canBook ? "pointer" : "default",
                        opacity: d.past ? 0.45 : 1,
                        minHeight: "60px",
                      }}
                    >
                      <span style={{ fontSize: "10.5px", fontWeight: 800, color: d.isFri ? "#0a93c4" : d.isSat ? "#d2453a" : "#7c98a6" }}>{d.dow}</span>
                      <span style={{ fontSize: "12px", fontWeight: 800, color: "#0a3346" }}>{d.dm}</span>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "21px", fontSize: "16px", fontWeight: 900, lineHeight: 1, color: d.symColor }}>{d.sym}</span>
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", margin: "12px 0 2px", fontSize: "11.5px", color: "#5a7d8c", fontWeight: 700 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><span style={{ color: "#1fb06b", fontWeight: 900 }}>〇</span>予約可</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><span style={{ color: "#ef8a2b", fontWeight: 900 }}>△</span>残りわずか</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><span style={{ color: "#9aa7ae", fontWeight: 900 }}>✕</span>予約不可</span>
                </div>
                <div style={{ textAlign: "center", fontSize: "11px", color: "#9bb2bc", marginBottom: "4px" }}>＊体験予約は1日 先着{DAILY_TRIAL_LIMIT}組まで（火・土・日は休講）</div>
                {selectedDate && (
                  <>
                    <div style={{ marginTop: "14px", background: "#eaf7fc", border: "1.5px solid #cfe6f0", borderRadius: "12px", padding: "11px 14px", fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "14px", color: ocean, textAlign: "center" }}>選択中：{selLabel()}</div>
                    <form onSubmit={submitTrial}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "14px" }}>
                        <label style={{ display: "block" }}>
                          <span style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#33606f", marginBottom: "5px" }}>学年・区分</span>
                          <select value={gakunen} onChange={(e) => setGakunen(e.target.value)} style={fieldStyle}>
                            <option value="">選択してください</option>
                            <option value="小学1年生">小学1年生</option>
                            <option value="小学2年生">小学2年生</option>
                            <option value="小学3年生">小学3年生</option>
                            <option value="小学4年生">小学4年生</option>
                            <option value="小学5年生">小学5年生</option>
                            <option value="小学6年生">小学6年生</option>
                            <option value="中学1年生">中学1年生</option>
                            <option value="中学2年生">中学2年生</option>
                            <option value="中学3年生">中学3年生</option>
                            <option value="高校生">高校生</option>
                            <option value="一般">一般（社会人など）</option>
                          </select>
                        </label>
                        <div>
                          <span style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#33606f", marginBottom: "5px" }}>{nameLabel}</span>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            <input type="text" name="sei" placeholder="姓" style={fieldStyle} />
                            <input type="text" name="mei" placeholder="名" style={fieldStyle} />
                          </div>
                        </div>
                        <div>
                          <span style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#33606f", marginBottom: "5px" }}>フリガナ</span>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            <input type="text" name="furiSei" placeholder="セイ" style={fieldStyle} />
                            <input type="text" name="furiMei" placeholder="メイ" style={fieldStyle} />
                          </div>
                        </div>
                        <label style={{ display: "block" }}>
                          <span style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#33606f", marginBottom: "5px" }}>電話番号</span>
                          <input type="tel" name="tel" placeholder="090-0000-0000" style={fieldStyle} />
                        </label>
                        <label style={{ display: "block" }}>
                          <span style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#33606f", marginBottom: "5px" }}>メールアドレス</span>
                          <input type="email" name="email" placeholder="example@email.com" style={fieldStyle} />
                        </label>
                      </div>
                      {trialError && (
                        <div style={{ marginTop: "14px", background: "#fff1ee", border: "1px solid #ffd6cc", color: "#d2453a", fontSize: "12.5px", fontWeight: 700, padding: "10px 13px", borderRadius: "10px" }}>{trialError}</div>
                      )}
                      <button type="submit" style={{ marginTop: "18px", width: "100%", fontFamily: "'Zen Maru Gothic',sans-serif", border: "none", cursor: "pointer", background: accent, color: "#fff", fontWeight: 900, fontSize: "16px", padding: "15px", borderRadius: "999px", boxShadow: "0 12px 26px rgba(255,90,43,.34)" }}>この日で予約する</button>
                    </form>
                  </>
                )}
              </div>
            ) : isPlan && checkout.type === "plan" ? (
              <div>
                <div style={{ padding: "34px 30px 22px", background: "linear-gradient(160deg,#0c3a4d,#0a93c4)", borderRadius: "26px 26px 0 0", color: "#fff" }}>
                  <div style={{ fontSize: "12.5px", fontWeight: 700, opacity: 0.85 }}>お申し込みプラン</div>
                  <div style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "24px", marginTop: "4px" }}>{checkout.name}</div>
                  <div style={{ fontSize: "13px", opacity: 0.85, marginTop: "2px" }}>{checkout.sessions}</div>
                </div>
                <div style={{ padding: "24px 30px 0" }}>
                  <div style={{ background: "#f5fbfe", border: "1.5px solid #e2f1f8", borderRadius: "16px", padding: "18px 18px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 800, color: "#5a7d8c", marginBottom: "12px", letterSpacing: ".05em" }}>初月のお支払い</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#33606f", marginBottom: "9px" }}><span>入会金</span><span style={{ fontWeight: 700 }}>{yen(JOIN_FEE_YEN)}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#33606f", marginBottom: "12px" }}><span>月会費（{checkout.name}）</span><span style={{ fontWeight: 700 }}>{yen(checkout.monthlyYen)}</span></div>
                    <div style={{ height: "1px", background: "#e2f1f8", marginBottom: "12px" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><span style={{ fontWeight: 800, color: "#0a3346" }}>初月合計</span><span style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "22px", color: accent }}>{yen(checkout.firstMonthYen)}</span></div>
                    <div style={{ fontSize: "11.5px", color: "#88a3ae", marginTop: "8px" }}>2ヶ月目以降は {yen(checkout.monthlyYen)}/月 を自動決済（年1回 更新料 {yen(RENEWAL_FEE_YEN)}）</div>
                  </div>
                </div>
                <form onSubmit={submitPayment} style={{ padding: "20px 30px 30px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: "#5a7d8c", marginBottom: "12px", letterSpacing: ".05em", display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="3" stroke="#5a7d8c" strokeWidth="2" /><path d="M3 9h18" stroke="#5a7d8c" strokeWidth="2" /></svg>
                    カード情報
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <input type="text" placeholder="カード番号  1234 5678 9012 3456" inputMode="numeric" style={{ ...fieldStyle, padding: "13px 14px" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <input type="text" placeholder="MM / YY" style={{ ...fieldStyle, padding: "13px 14px" }} />
                      <input type="text" placeholder="CVC" style={{ ...fieldStyle, padding: "13px 14px" }} />
                    </div>
                    <input type="text" placeholder="カード名義（保護者さま）" style={{ ...fieldStyle, padding: "13px 14px" }} />
                  </div>
                  <button type="submit" style={{ marginTop: "20px", width: "100%", fontFamily: "'Zen Maru Gothic',sans-serif", border: "none", cursor: "pointer", background: accent, color: "#fff", fontWeight: 900, fontSize: "16px", padding: "16px", borderRadius: "999px", boxShadow: "0 12px 26px rgba(255,90,43,.34)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M6 12l4 4 8-9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    申し込む（{yen(checkout.firstMonthYen)}）
                  </button>
                  <div style={{ textAlign: "center", fontSize: "11.5px", color: "#9bb2bc", marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#9bb2bc" strokeWidth="2" /><path d="M8 11V8a4 4 0 018 0v3" stroke="#9bb2bc" strokeWidth="2" /></svg>
                    オンライン決済は準備中です（お申し込み内容を保存します）
                  </div>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
