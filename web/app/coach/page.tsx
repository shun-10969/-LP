"use client";

import React, { useState, Fragment } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Hoverable } from "@/components/Hoverable";

// ─── data ────────────────────────────────────────────────────────────────────

const wants = [
  { delay: 0, icon: "◎", bg: "linear-gradient(140deg,#0a93c4,#27c0e6)", title: "未経験・資格不問", body: "指導のやり方は研修でしっかりサポート。はじめての方も安心です。" },
  { delay: 90, icon: "♥", bg: "linear-gradient(140deg,#ff8a5c,#ff5a2b)", title: "子どもが好きな方", body: "子どもの成長を一緒に喜べる方。それがいちばん大切な資質です。" },
  { delay: 180, icon: "⚡", bg: "linear-gradient(140deg,#1fb06b,#27c08a)", title: "体を動かすのが好き", body: "一緒に走って、跳んで。元気いっぱい体を動かせる方を歓迎します。" },
  { delay: 270, icon: "★", bg: "linear-gradient(140deg,#6a8bd6,#8a6ad6)", title: "競技経験者は優遇", body: "陸上・スポーツの経験を、次の世代に活かしてみませんか。" },
];

const specs = [
  { k: "職種", v: "陸上教室コーチ（アシスタントから可）" },
  { k: "雇用形態", v: "アルバイト／業務委託（働き方は応相談）" },
  { k: "勤務地", v: "コザ運動公園 陸上競技場（沖縄県沖縄市）" },
  { k: "勤務時間", v: "平日夕方 17:00〜19:15 のうちシフト制（週1日〜OK）" },
  { k: "待遇", v: "時給 1,200円〜（例・経験により優遇）／交通費支給／研修あり" },
  { k: "応募資格", v: "不問（陸上・体育・保育・子ども関連の経験者は歓迎）" },
];

function BenefitIcon({ path }: { path: string }) {
  return (
    <svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <path d={path} stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const benefits = [
  { delay: 0, bg: "rgba(10,147,196,.12)", svg: <BenefitIcon path="M12 21s-7-5.2-7-10a7 7 0 1114 0c0 4.8-7 10-7 10z" />, title: "成長を間近で", body: "「できた！」の瞬間に立ち会える、何ものにも代えがたいやりがい。" },
  { delay: 120, bg: "rgba(255,106,61,.12)", svg: <BenefitIcon path="M16 11a4 4 0 10-8 0M3 20a6 6 0 0118 0" />, title: "チームで支え合う", body: "経験豊富なコーチがそばに。みんなで子どもたちを育てます。" },
  { delay: 240, bg: "rgba(31,176,107,.12)", svg: <BenefitIcon path="M12 4l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 17l-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" />, title: "スキルが身につく", body: "指導研修やコーチ同士の学び合いで、指導力・対応力が磨かれます。" },
];

const steps = [
  { delay: 0, n: "01", title: "応募フォーム", body: "下のフォームから30秒で応募。気軽にお問い合わせください。" },
  { delay: 90, n: "02", title: "面談", body: "担当者とカジュアルに面談（オンライン可）。疑問もここで解消。" },
  { delay: 180, n: "03", title: "体験・見学", body: "実際の練習を体験。雰囲気を感じてから判断できます。" },
  { delay: 270, n: "04", title: "採用・デビュー", body: "研修を経て、いよいよコーチデビュー。一緒にがんばりましょう！" },
];

const fields = [
  { label: "お名前", ph: "宮田 太郎" },
  { label: "年齢", ph: "25" },
  { label: "陸上・指導の経験（任意）", ph: "例）学生時代に短距離 / 未経験 など" },
  { label: "電話番号 または メール", ph: "090-0000-0000" },
];

// ─── FocusInput / FocusTextarea ───────────────────────────────────────────────

function FocusInput({ placeholder, inputRef }: { placeholder: string; inputRef?: React.RefObject<HTMLInputElement | null> }) {
  const [focused, setFocused] = useState(false);
  const baseStyle: React.CSSProperties = {
    width: "100%",
    border: "1.5px solid #dce9ef",
    borderRadius: "12px",
    padding: "13px 14px",
    fontSize: "15px",
    fontFamily: "'Zen Kaku Gothic New',sans-serif",
    color: "#0c3a4d",
    outline: "none",
    background: "#fafdfe",
    transition: "border .2s",
  };
  const focusStyle: React.CSSProperties = { border: "1.5px solid var(--ocean,#0a93c4)" };
  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      style={{ ...baseStyle, ...(focused ? focusStyle : {}) }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function FocusTextarea({ textareaRef }: { textareaRef?: React.RefObject<HTMLTextAreaElement | null> }) {
  const [focused, setFocused] = useState(false);
  const baseStyle: React.CSSProperties = {
    width: "100%",
    border: "1.5px solid #dce9ef",
    borderRadius: "12px",
    padding: "13px 14px",
    fontSize: "15px",
    fontFamily: "'Zen Kaku Gothic New',sans-serif",
    color: "#0c3a4d",
    outline: "none",
    background: "#fafdfe",
    resize: "vertical",
  };
  const focusStyle: React.CSSProperties = { border: "1.5px solid var(--ocean,#0a93c4)" };
  return (
    <textarea
      ref={textareaRef}
      rows={3}
      placeholder="「子どもが好きで…」など、自由にどうぞ"
      style={{ ...baseStyle, ...(focused ? focusStyle : {}) }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

// ─── ApplyForm ────────────────────────────────────────────────────────────────

function ApplyForm({ onSuccess }: { onSuccess: () => void }) {
  const nameRef = React.useRef<HTMLInputElement>(null);
  const ageRef = React.useRef<HTMLInputElement>(null);
  const experienceRef = React.useRef<HTMLInputElement>(null);
  const contactRef = React.useRef<HTMLInputElement>(null);
  const motivationRef = React.useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const name = nameRef.current?.value.trim() ?? "";
    const age = ageRef.current?.value.trim() ?? "";
    const experience = experienceRef.current?.value.trim() ?? "";
    const contact = contactRef.current?.value.trim() ?? "";
    const motivation = motivationRef.current?.value.trim() ?? "";

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age, experience, contact, motivation }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        setError("送信に失敗しました。もう一度お試しください。");
      }
    } catch {
      setError("送信に失敗しました。もう一度お試しください。");
    }
  };

  const inputRefs = [nameRef, ageRef, experienceRef, contactRef];

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      {fields.map((f, i) => (
        <Fragment key={i}>
          <label style={{ display: "block" }}>
            <span style={{ display: "block", fontSize: "12.5px", fontWeight: 800, color: "#33606f", marginBottom: "6px" }}>{f.label}</span>
            <FocusInput placeholder={f.ph} inputRef={inputRefs[i]} />
          </label>
        </Fragment>
      ))}
      <label style={{ display: "block" }}>
        <span style={{ display: "block", fontSize: "12.5px", fontWeight: 800, color: "#33606f", marginBottom: "6px" }}>志望動機・ひとこと</span>
        <FocusTextarea textareaRef={motivationRef} />
      </label>
      {error && (
        <p style={{ fontSize: "13px", color: "#e03a3a", margin: "0", textAlign: "center" }}>{error}</p>
      )}
      <Hoverable
        as="button"
        baseStyle={{
          marginTop: "6px",
          fontFamily: "'Zen Maru Gothic',sans-serif",
          border: "none",
          cursor: "pointer",
          background: "var(--accent,#ff6a3d)",
          color: "#fff",
          fontWeight: 900,
          fontSize: "16px",
          padding: "16px",
          borderRadius: "999px",
          boxShadow: "0 12px 26px rgba(255,90,43,.34)",
          transition: "transform .2s ease",
        }}
        hoverStyle={{ transform: "translateY(-2px)" }}
        type="submit"
      >
        応募を送信する
      </Hoverable>
      <p style={{ textAlign: "center", fontSize: "11.5px", color: "#9bb2bc", margin: "2px 0 0" }}>＊送信は無料。しつこい連絡はいたしません。</p>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CoachPage() {
  const [sent, setSent] = useState(false);

  return (
    <div
      id="coach-page"
      style={{
        position: "relative",
        fontFamily: "'Zen Kaku Gothic New',sans-serif",
        ["--accent" as string]: "#ff6a3d",
        ["--ocean" as string]: "#0a93c4",
      }}
    >
      {/* top bar / nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 80, background: "rgba(255,255,255,.88)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(10,147,196,.12)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "12px clamp(18px,4vw,40px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
            <img src="/assets/miyata-logo-trans.png" alt="ミヤタアスリートクラブ" style={{ height: "80px", width: "auto", display: "block" }} />
            <div style={{ fontSize: "9.5px", letterSpacing: ".16em", color: "var(--ocean,#0a93c4)", fontWeight: 700 }}>COACH RECRUITMENT</div>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link href="/" style={{ textDecoration: "none", color: "#5a7d8c", fontWeight: 700, fontSize: "13px" }}>← トップへ戻る</Link>
            <a href="#apply" style={{ textDecoration: "none", fontFamily: "'Zen Maru Gothic',sans-serif", background: "var(--accent,#ff6a3d)", color: "#fff", fontWeight: 900, fontSize: "13px", padding: "10px 18px", borderRadius: "999px", boxShadow: "0 8px 18px rgba(255,106,61,.35)" }}>応募する</a>
          </div>
        </div>
      </nav>

      {/* hero */}
      <header style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg,#7fcdef 0%, #a6e0f2 45%, #d8f3fb 80%, #ffffff 100%)", padding: "clamp(40px,6vw,80px) clamp(18px,4vw,40px) 0" }}>
        <div style={{ position: "absolute", top: "-90px", right: "-40px", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, #fff4d6 0%, #ffe39c 45%, rgba(255,227,156,0) 70%)", animation: "sunGlow 6s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "120px", left: "7%", width: "140px", height: "42px", background: "#fff", borderRadius: "40px", opacity: 0.85, animation: "floatA 9s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "90px", right: "32%", width: "100px", height: "30px", background: "#fff", borderRadius: "30px", opacity: 0.75, animation: "floatB 11s ease-in-out infinite", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "clamp(28px,4vw,52px)", alignItems: "center", paddingBottom: "90px" }}>
          <Reveal delay={0}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,.72)", border: "1.5px solid rgba(255,106,61,.3)", padding: "7px 16px", borderRadius: "999px", fontWeight: 800, fontSize: "12.5px", color: "var(--accent,#ff6a3d)", marginBottom: "20px" }}>COACH RECRUITMENT ／ コーチ募集</div>
            <h1 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "clamp(30px,4.8vw,52px)", lineHeight: 1.25, margin: "0 0 18px", color: "#0a3346" }}>
              子どもたちの<br /><span style={{ color: "var(--ocean,#0a93c4)" }}>「できた！」</span>を、<br />一緒に増やしませんか。
            </h1>
            <p style={{ fontSize: "clamp(15px,1.7vw,17px)", lineHeight: 1.95, color: "#326073", margin: "0 0 28px", maxWidth: "30em" }}>沖縄の青空の下で、子どもたちの成長に寄り添う仕事。資格や経験はいりません。「子どもが好き」「体を動かすのが好き」——その気持ちが、いちばんの資格です。</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "13px" }}>
              <Hoverable
                as="a"
                href="#apply"
                baseStyle={{ textDecoration: "none", fontFamily: "'Zen Maru Gothic',sans-serif", background: "var(--accent,#ff6a3d)", color: "#fff", fontWeight: 900, fontSize: "16px", padding: "16px 30px", borderRadius: "999px", boxShadow: "0 14px 30px rgba(255,106,61,.4)", display: "inline-flex", alignItems: "center", gap: "9px", transition: "transform .2s ease" }}
                hoverStyle={{ transform: "translateY(-3px)" }}
              >
                応募する
                <svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Hoverable>
              <a href="#requirements" style={{ textDecoration: "none", fontFamily: "'Zen Maru Gothic',sans-serif", background: "#fff", color: "var(--ocean,#0a93c4)", fontWeight: 800, fontSize: "15px", padding: "15px 26px", borderRadius: "999px", border: "2px solid rgba(10,147,196,.25)" }}>募集要項を見る</a>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", fontWeight: 700, color: "#2e5d70" }}>
                <svg width={17} height={17} viewBox="0 0 24 24" fill="none"><circle cx={12} cy={12} r={10} fill="rgba(31,176,107,.16)" /><path d="M8 12.5l2.5 2.5L16 9" stroke="#1fb06b" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                未経験・資格不問
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", fontWeight: 700, color: "#2e5d70" }}>
                <svg width={17} height={17} viewBox="0 0 24 24" fill="none"><circle cx={12} cy={12} r={10} fill="rgba(31,176,107,.16)" /><path d="M8 12.5l2.5 2.5L16 9" stroke="#1fb06b" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                週1日・夕方からOK
              </div>
            </div>
          </Reveal>

          <Reveal delay={160} style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: "-22px", right: "-12px", zIndex: 5, background: "linear-gradient(150deg,#ff7d4a,#ff5a2b)", color: "#fff", fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "13px", padding: "12px 18px", borderRadius: "16px", boxShadow: "0 12px 26px rgba(255,90,43,.45)", animation: "bob 3s ease-in-out infinite" }}>仲間募集中！</div>
            <div style={{ width: "100%", aspectRatio: "4/3", borderRadius: "26px", overflow: "hidden", boxShadow: "0 28px 56px rgba(11,58,77,.26)", border: "6px solid #fff" }}>
              <div style={{ width: "100%", height: "100%", animation: "kbZoom 8s ease forwards" }}>
                {/* image-slot coach-hero: no src → placeholder */}
                <div style={{ width: "100%", height: "100%", background: "#eef4f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#9bb2bc", borderRadius: "0" }}>
                  指導している様子の写真
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* wave divider */}
        <div style={{ position: "absolute", left: 0, bottom: "-1px", width: "100%", lineHeight: 0, pointerEvents: "none" }}>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: "100%", height: "84px", display: "block" }}>
            <path d="M0,40 C240,110 480,110 720,70 C960,30 1200,30 1440,80 L1440,120 L0,120 Z" fill="#ffffff" />
          </svg>
        </div>
      </header>

      {/* mission */}
      <section style={{ background: "#ffffff", padding: "clamp(36px,5vw,68px) clamp(18px,4vw,40px)" }}>
        <Reveal delay={0} style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontWeight: 900, letterSpacing: ".2em", color: "var(--accent,#ff6a3d)", fontSize: "13px", marginBottom: "14px" }}>OUR MISSION</div>
          <h2 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "clamp(22px,3vw,32px)", lineHeight: 1.5, margin: "0 0 18px", color: "#0a3346" }}>走る楽しさを伝えることは、<br />子どもの未来を応援すること。</h2>
          <p style={{ fontSize: "15.5px", lineHeight: 2, color: "#48707f", margin: 0 }}>私たちは、勝ち負けよりも「できた！」の笑顔を大切にしています。運動が得意な子も苦手な子も、一人ひとりのペースで伸びていく——その瞬間に立ち会えるのが、このコーチという仕事のいちばんの魅力です。あなたの声かけが、子どもの自信になります。</p>
        </Reveal>
      </section>

      {/* 求める人物像 */}
      <section style={{ background: "linear-gradient(180deg,#ffffff,#f1fafe)", padding: "clamp(40px,6vw,76px) clamp(18px,4vw,40px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal delay={0} style={{ textAlign: "center", marginBottom: "clamp(28px,4vw,44px)" }}>
            <div style={{ fontWeight: 900, letterSpacing: ".2em", color: "var(--accent,#ff6a3d)", fontSize: "13px", marginBottom: "12px" }}>WE&#39;RE LOOKING FOR</div>
            <h2 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "clamp(24px,3.4vw,38px)", margin: 0, color: "#0a3346" }}>こんな方を募集しています</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "18px" }}>
            {wants.map((w, i) => (
              <Fragment key={i}>
                <Reveal
                  delay={w.delay}
                  style={{ background: "#fff", border: "1.5px solid #e2f1f8", borderRadius: "20px", padding: "26px 22px", textAlign: "center", transition: "transform .3s ease, box-shadow .3s ease" }}
                  hoverStyle={{ transform: "translateY(-6px)", boxShadow: "0 20px 40px rgba(10,147,196,.14)" }}
                >
                  <div style={{ width: "58px", height: "58px", margin: "0 auto 16px", borderRadius: "18px", background: w.bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "22px" }}>{w.icon}</div>
                  <h3 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "16.5px", margin: "0 0 8px", color: "#0a3346" }}>{w.title}</h3>
                  <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.75, color: "#5a7d8c" }}>{w.body}</p>
                </Reveal>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 募集要項 */}
      <section id="requirements" style={{ background: "#ffffff", padding: "clamp(40px,6vw,76px) clamp(18px,4vw,40px)" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto" }}>
          <Reveal delay={0} style={{ textAlign: "center", marginBottom: "clamp(26px,3vw,40px)" }}>
            <div style={{ fontWeight: 900, letterSpacing: ".2em", color: "var(--accent,#ff6a3d)", fontSize: "13px", marginBottom: "12px" }}>REQUIREMENTS</div>
            <h2 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "clamp(24px,3.4vw,38px)", margin: 0, color: "#0a3346" }}>募集要項</h2>
          </Reveal>
          <Reveal delay={60} style={{ border: "1.5px solid #e2f1f8", borderRadius: "22px", overflow: "hidden", boxShadow: "0 14px 34px rgba(10,147,196,.08)" }}>
            {specs.map((s, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 0, borderBottom: "1px solid #eef4f7" }}>
                <div style={{ background: "#f5fbfe", padding: "16px 18px", fontWeight: 800, fontSize: "13.5px", color: "#0a3346", display: "flex", alignItems: "center" }}>{s.k}</div>
                <div style={{ padding: "16px 18px", fontSize: "14px", color: "#33606f", lineHeight: 1.7 }}>{s.v}</div>
              </div>
            ))}
          </Reveal>
          <p style={{ color: "#9bb2bc", fontSize: "12px", margin: "14px 0 0", textAlign: "center" }}>＊待遇・条件は一例です。経験や働き方に応じて相談に応じます。</p>
        </div>
      </section>

      {/* 働く魅力 */}
      <section style={{ background: "linear-gradient(180deg,#ffffff,#eaf7fc)", padding: "clamp(40px,6vw,76px) clamp(18px,4vw,40px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal delay={0} style={{ textAlign: "center", marginBottom: "clamp(28px,4vw,44px)" }}>
            <div style={{ fontWeight: 900, letterSpacing: ".2em", color: "var(--accent,#ff6a3d)", fontSize: "13px", marginBottom: "12px" }}>WHY JOIN US</div>
            <h2 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "clamp(24px,3.4vw,38px)", margin: 0, color: "#0a3346" }}>働く魅力</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "20px" }}>
            {benefits.map((b, i) => (
              <Fragment key={i}>
                <Reveal
                  delay={b.delay}
                  style={{ background: "#fff", border: "1.5px solid #e2f1f8", borderRadius: "22px", padding: "30px 26px", transition: "transform .3s ease, box-shadow .3s ease" }}
                  hoverStyle={{ transform: "translateY(-6px)", boxShadow: "0 20px 40px rgba(10,147,196,.14)" }}
                >
                  <div style={{ width: "52px", height: "52px", borderRadius: "15px", background: b.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>{b.svg}</div>
                  <h3 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "18px", margin: "0 0 9px", color: "#0a3346" }}>{b.title}</h3>
                  <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.85, color: "#48707f" }}>{b.body}</p>
                </Reveal>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 応募の流れ */}
      <section style={{ background: "#ffffff", padding: "clamp(40px,6vw,72px) clamp(18px,4vw,40px)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <Reveal delay={0} style={{ textAlign: "center", marginBottom: "clamp(28px,4vw,44px)" }}>
            <div style={{ fontWeight: 900, letterSpacing: ".2em", color: "var(--accent,#ff6a3d)", fontSize: "13px", marginBottom: "12px" }}>FLOW</div>
            <h2 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "clamp(24px,3.4vw,38px)", margin: 0, color: "#0a3346" }}>応募の流れ</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "16px" }}>
            {steps.map((st, i) => (
              <Fragment key={i}>
                <Reveal delay={st.delay} style={{ position: "relative", background: "#f5fbfe", border: "1.5px solid #e2f1f8", borderRadius: "20px", padding: "26px 22px" }}>
                  <div style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "13px", color: "var(--accent,#ff6a3d)", marginBottom: "10px" }}>STEP {st.n}</div>
                  <h3 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "16px", margin: "0 0 7px", color: "#0a3346" }}>{st.title}</h3>
                  <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.7, color: "#5a7d8c" }}>{st.body}</p>
                </Reveal>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* apply form */}
      <section id="apply" style={{ position: "relative", overflow: "hidden", background: "linear-gradient(160deg,var(--ocean,#0a93c4),#1cb3d8 60%,#36c7e3)", padding: "clamp(44px,6vw,84px) clamp(18px,4vw,40px)" }}>
        <div style={{ position: "absolute", top: "-40px", right: "-20px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,.1)" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "10%", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255,255,255,.08)" }} />
        <Reveal delay={0} style={{ position: "relative", zIndex: 2, maxWidth: "640px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "26px", color: "#fff" }}>
            <h2 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "clamp(26px,3.8vw,40px)", margin: "0 0 10px" }}>コーチに応募する</h2>
            <p style={{ margin: 0, fontSize: "14.5px", lineHeight: 1.8, opacity: 0.92 }}>まずはお気軽に。1分で完了します。担当より折り返しご連絡します。</p>
          </div>
          <div style={{ background: "#fff", borderRadius: "24px", boxShadow: "0 26px 56px rgba(0,0,0,.22)", padding: "clamp(26px,4vw,38px)" }}>
            {sent ? (
              /* 完了パネル */
              <div style={{ textAlign: "center", padding: "18px 6px" }}>
                <div style={{ width: "74px", height: "74px", borderRadius: "50%", background: "rgba(31,176,107,.14)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "popIn .4s ease" }}>
                  <svg width={38} height={38} viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4 10-11" stroke="#1fb06b" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 style={{ fontFamily: "'Zen Maru Gothic',sans-serif", fontWeight: 900, fontSize: "22px", margin: "0 0 10px", color: "#0a3346" }}>ご応募ありがとうございます！</h3>
                <p style={{ fontSize: "14px", lineHeight: 1.8, color: "#48707f", margin: 0 }}>担当者より2〜3日以内にご連絡いたします。お会いできるのを楽しみにしています。</p>
              </div>
            ) : (
              /* 応募フォーム */
              <ApplyForm onSuccess={() => setSent(true)} />
            )}
          </div>
        </Reveal>
      </section>

      {/* footer */}
      <footer style={{ background: "#0a3346", color: "#cfe3ec", padding: "34px clamp(18px,4vw,40px)", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
          <img src="/assets/miyata-logo-dark.png" alt="ミヤタアスリートクラブ" style={{ height: "84px", width: "auto", display: "block" }} />
        </div>
        <div style={{ fontSize: "12.5px", color: "#8fb3c2", marginBottom: "14px" }}>コザ運動公園 陸上競技場（沖縄県沖縄市）</div>
        <Link href="/" style={{ textDecoration: "none", color: "#cfe3ec", fontWeight: 700, fontSize: "13px", border: "1px solid rgba(255,255,255,.2)", padding: "9px 18px", borderRadius: "999px" }}>← トップページへ戻る</Link>
      </footer>
    </div>
  );
}
