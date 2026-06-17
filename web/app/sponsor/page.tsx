"use client";

import React, { Fragment, useRef, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Hoverable } from "@/components/Hoverable";

// ---------------------------------------------------------------------------
// Data (from the dc-script renderVals())
// ---------------------------------------------------------------------------

const merits = [
  {
    delay: 0,
    bg: "linear-gradient(140deg,#0a93c4,#27c0e6)",
    icon: "M4 7h16M4 12h16M4 17h10",
    title: "ロゴ掲出・PR",
    body: "ホームページ・ユニフォーム・大会横断幕などに企業ロゴを掲出。地域の方々の目に触れます。",
  },
  {
    delay: 120,
    bg: "linear-gradient(140deg,#1fb06b,#27c08a)",
    icon: "M12 21s-7-5.2-7-10a7 7 0 1114 0c0 4.8-7 10-7 10zM12 8a3 3 0 100 6 3 3 0 000-6z",
    title: "地域貢献・CSR",
    body: "子どものスポーツ振興を支える社会貢献活動として、企業価値の向上につながります。",
  },
  {
    delay: 240,
    bg: "linear-gradient(140deg,#ff8a5c,#ff5a2b)",
    icon: "M4 11a8 8 0 018-8M4 4v7h7M20 13a8 8 0 01-8 8M20 20v-7h-7",
    title: "SNS・イベント露出",
    body: "教室の公式SNSやイベントで協賛企業としてご紹介。継続的な情報発信で認知を高めます。",
  },
];

type Plan = {
  delay: number;
  name: string;
  price: string;
  featured: boolean;
  cardBg: string;
  border: string;
  shadow: string;
  titleColor: string;
  sub: string;
  divider: string;
  text: string;
  tick: string;
  tickStroke: string;
  btnBg: string;
  btnColor: string;
  btnBorder: string;
  features: string[];
};

const plans: Plan[] = [
  {
    delay: 0,
    name: "ブロンズ",
    price: "¥30,000",
    featured: false,
    cardBg: "#f7fbfd",
    border: "#e2f1f8",
    shadow: "0 14px 30px rgba(10,147,196,.08)",
    titleColor: "#0a3346",
    sub: "#5a7d8c",
    divider: "#e2f1f8",
    text: "#33606f",
    tick: "rgba(10,147,196,.14)",
    tickStroke: "#0a93c4",
    btnBg: "#fff",
    btnColor: "#0a93c4",
    btnBorder: "2px solid rgba(10,147,196,.3)",
    features: [
      "ホームページにロゴ掲載",
      "公式SNSで協賛企業として紹介",
      "活動報告レポートの送付",
    ],
  },
  {
    delay: 120,
    name: "シルバー",
    price: "¥60,000",
    featured: true,
    cardBg: "#f0f8fc",
    border: "var(--ocean,#0a93c4)",
    shadow: "0 22px 46px rgba(10,147,196,.2)",
    titleColor: "#0a3346",
    sub: "#5a7d8c",
    divider: "#d4e9f3",
    text: "#33606f",
    tick: "rgba(10,147,196,.16)",
    tickStroke: "#0a93c4",
    btnBg: "var(--ocean,#0a93c4)",
    btnColor: "#fff",
    btnBorder: "none",
    features: [
      "ブロンズの特典すべて",
      "ユニフォームにロゴ掲出",
      "大会・記録会の横断幕に掲出",
      "イベントでの企業紹介",
    ],
  },
  {
    delay: 240,
    name: "ゴールド",
    price: "¥120,000",
    featured: false,
    cardBg: "linear-gradient(165deg,#0c3a4d,#0a93c4)",
    border: "transparent",
    shadow: "0 26px 52px rgba(10,58,77,.32)",
    titleColor: "#fff",
    sub: "rgba(255,255,255,.8)",
    divider: "rgba(255,255,255,.18)",
    text: "rgba(255,255,255,.94)",
    tick: "rgba(255,227,156,.25)",
    tickStroke: "#ffe39c",
    btnBg: "var(--accent,#ff6a3d)",
    btnColor: "#fff",
    btnBorder: "none",
    features: [
      "シルバーの特典すべて",
      "メインスポンサーとして大きく掲出",
      "イベント・大会の冠協賛が可能",
      "専用の感謝状・年間報告",
      "個別のPRプランをご提案",
    ],
  },
];

const placements = [
  {
    delay: 0,
    id: "place-uniform",
    label: "ユニフォーム",
    body: "選手が着用するウェアに企業ロゴを掲出します。",
  },
  {
    delay: 120,
    id: "place-banner",
    label: "大会横断幕",
    body: "大会・記録会の会場に横断幕としてロゴを掲出。",
  },
  {
    delay: 240,
    id: "place-web",
    label: "Webサイト",
    body: "当クラブの公式サイト・LPにロゴとリンクを掲載。",
  },
];

const steps = [
  {
    delay: 0,
    n: "01",
    title: "お問い合わせ",
    body: "下のフォームよりご連絡ください。資料もお送りします。",
  },
  {
    delay: 90,
    n: "02",
    title: "ご相談・ご提案",
    body: "ご予算・ご希望に合わせて最適なプランをご提案します。",
  },
  {
    delay: 180,
    n: "03",
    title: "ご契約",
    body: "内容にご納得いただけましたら、契約手続きへ進みます。",
  },
  {
    delay: 270,
    n: "04",
    title: "掲出・活動開始",
    body: "ロゴ掲出をスタート。活動報告も定期的にお届けします。",
  },
];

const fields = [
  { label: "会社名・団体名", ph: "株式会社○○○○" },
  { label: "ご担当者名", ph: "宮田 太郎" },
  { label: "電話番号 または メール", ph: "info@example.com" },
];

// ---------------------------------------------------------------------------
// Image-slot placeholder helper (no src → placeholder div)
// ---------------------------------------------------------------------------
function ImagePlaceholder({
  style,
  placeholder,
  shape,
}: {
  style?: React.CSSProperties;
  placeholder: string;
  shape: "rect" | "rounded" | "circle";
}) {
  const borderRadius =
    shape === "circle" ? "50%" : shape === "rounded" ? "14px" : "0";
  return (
    <div
      style={{
        ...style,
        background: "#eef4f7",
        borderRadius,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        color: "#9bb2bc",
      }}
    >
      {placeholder}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function SponsorPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form refs
  const companyRef = useRef<HTMLInputElement>(null);
  const personRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const company = companyRef.current?.value.trim() ?? "";
    const person = personRef.current?.value.trim() ?? "";
    const contact = contactRef.current?.value.trim() ?? "";
    const message = messageRef.current?.value.trim() ?? "";

    try {
      const res = await fetch("/api/sponsor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, person, contact, message }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError("送信に失敗しました。しばらく時間をおいてもう一度お試しください。");
      }
    } catch {
      setError("送信に失敗しました。しばらく時間をおいてもう一度お試しください。");
    }
  }

  return (
    <div
      id="sponsor-page"
      style={{
        position: "relative",
        fontFamily: "'Zen Kaku Gothic New',sans-serif",
        ["--accent" as string]: "#ff6a3d",
        ["--ocean" as string]: "#0a93c4",
      }}
    >
      {/* ── top bar ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 80,
          background: "rgba(255,255,255,.88)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(10,147,196,.12)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "12px clamp(18px,4vw,40px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
            }}
          >
            <img
              src="/assets/miyata-logo-trans.png"
              alt="ミヤタアスリートクラブ"
              style={{ height: "80px", width: "auto", display: "block" }}
            />
            <div
              style={{
                fontSize: "9.5px",
                letterSpacing: ".16em",
                color: "var(--ocean,#0a93c4)",
                fontWeight: 700,
              }}
            >
              SPONSORSHIP
            </div>
          </Link>
          <div
            style={{ display: "flex", alignItems: "center", gap: "16px" }}
          >
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "#5a7d8c",
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              ← トップへ戻る
            </Link>
            <a
              href="#contact"
              style={{
                textDecoration: "none",
                fontFamily: "'Zen Maru Gothic',sans-serif",
                background: "var(--ocean,#0a93c4)",
                color: "#fff",
                fontWeight: 900,
                fontSize: "13px",
                padding: "10px 18px",
                borderRadius: "999px",
                boxShadow: "0 8px 18px rgba(10,147,196,.35)",
              }}
            >
              お問い合わせ
            </a>
          </div>
        </div>
      </nav>

      {/* ── hero ── */}
      <header
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(180deg,#0c3a4d 0%, #0a6f95 48%, #0a93c4 100%)",
          padding:
            "clamp(40px,6vw,80px) clamp(18px,4vw,40px) 0",
        }}
      >
        {/* decorative orbs */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-30px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,227,156,.45) 0%, rgba(255,227,156,0) 70%)",
            animation: "sunGlow 6s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "120px",
            left: "7%",
            width: "130px",
            height: "40px",
            background: "rgba(255,255,255,.16)",
            borderRadius: "40px",
            animation: "floatA 9s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: "clamp(28px,4vw,52px)",
            alignItems: "center",
            paddingBottom: "90px",
          }}
        >
          {/* hero text */}
          <Reveal delay={0}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,.14)",
                border: "1.5px solid rgba(255,227,156,.4)",
                padding: "7px 16px",
                borderRadius: "999px",
                fontWeight: 800,
                fontSize: "12.5px",
                color: "#ffe39c",
                marginBottom: "20px",
              }}
            >
              SPONSORSHIP ／ スポンサー募集
            </div>
            <h1
              style={{
                fontFamily: "'Zen Maru Gothic',sans-serif",
                fontWeight: 900,
                fontSize: "clamp(28px,4.6vw,50px)",
                lineHeight: 1.3,
                margin: "0 0 18px",
                color: "#fff",
              }}
            >
              沖縄の子どもたちの
              <br />
              未来に、
              <span style={{ color: "#ffe39c" }}>あなたの企業</span>の
              <br />
              名前を。
            </h1>
            <p
              style={{
                fontSize: "clamp(15px,1.7vw,17px)",
                lineHeight: 1.95,
                color: "rgba(255,255,255,.9)",
                margin: "0 0 28px",
                maxWidth: "30em",
              }}
            >
              地域のスポーツ振興と、子どもたちの健やかな成長。その応援に、企業として参加しませんか。ご協賛は、地域貢献（CSR）と企業PRを同時にかなえます。
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "13px" }}>
              <Hoverable
                as="a"
                baseStyle={{
                  textDecoration: "none",
                  fontFamily: "'Zen Maru Gothic',sans-serif",
                  background: "var(--accent,#ff6a3d)",
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: "16px",
                  padding: "16px 30px",
                  borderRadius: "999px",
                  boxShadow: "0 14px 30px rgba(255,106,61,.42)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "9px",
                  transition: "transform .2s ease",
                }}
                hoverStyle={{ transform: "translateY(-3px)" }}
                href="#contact"
              >
                協賛のお問い合わせ
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="#fff"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Hoverable>
              <a
                href="#plans"
                style={{
                  textDecoration: "none",
                  fontFamily: "'Zen Maru Gothic',sans-serif",
                  background: "rgba(255,255,255,.12)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "15px",
                  padding: "15px 26px",
                  borderRadius: "999px",
                  border: "2px solid rgba(255,255,255,.35)",
                }}
              >
                協賛プランを見る
              </a>
            </div>
          </Reveal>

          {/* hero image / badge */}
          <Reveal
            delay={160}
            style={{ position: "relative" }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                left: "-12px",
                zIndex: 5,
                background: "linear-gradient(150deg,#ffe39c,#ffcf5a)",
                color: "#0a3346",
                fontFamily: "'Zen Maru Gothic',sans-serif",
                fontWeight: 900,
                fontSize: "13px",
                padding: "11px 17px",
                borderRadius: "16px",
                boxShadow: "0 12px 26px rgba(0,0,0,.25)",
                animation: "bob 3s ease-in-out infinite",
              }}
            >
              協賛企業 募集中
            </div>
            <div
              style={{
                width: "100%",
                aspectRatio: "4/3",
                borderRadius: "26px",
                overflow: "hidden",
                boxShadow: "0 28px 56px rgba(0,0,0,.35)",
                border: "6px solid #fff",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  animation: "kbZoom 8s ease forwards",
                }}
              >
                <ImagePlaceholder
                  style={{ width: "100%", height: "100%", display: "block" }}
                  shape="rect"
                  placeholder="大会・チームの写真"
                />
              </div>
            </div>
          </Reveal>
        </div>

        {/* wave divider */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: "-1px",
            width: "100%",
            lineHeight: 0,
            pointerEvents: "none",
          }}
        >
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "84px", display: "block" }}
          >
            <path
              d="M0,40 C240,110 480,110 720,70 C960,30 1200,30 1440,80 L1440,120 L0,120 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </header>

      {/* ── impact / vision ── */}
      <section
        style={{
          background: "#ffffff",
          padding: "clamp(36px,5vw,68px) clamp(18px,4vw,40px)",
        }}
      >
        <Reveal
          delay={0}
          style={{
            maxWidth: "780px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontWeight: 900,
              letterSpacing: ".2em",
              color: "var(--accent,#ff6a3d)",
              fontSize: "13px",
              marginBottom: "14px",
            }}
          >
            OUR VISION
          </div>
          <h2
            style={{
              fontFamily: "'Zen Maru Gothic',sans-serif",
              fontWeight: 900,
              fontSize: "clamp(22px,3vw,32px)",
              lineHeight: 1.5,
              margin: "0 0 18px",
              color: "#0a3346",
            }}
          >
            子どもの「走る」を支えることは、
            <br />
            地域の未来を育てること。
          </h2>
          <p
            style={{
              fontSize: "15.5px",
              lineHeight: 2,
              color: "#48707f",
              margin: 0,
            }}
          >
            私たちは、コザ運動公園を拠点に、小学生から一般まで幅広い世代の陸上活動を応援しています。ご協賛いただいた資金は、子どもたちの活動環境の充実や、大会・記録会への挑戦を支えます。企業の皆さまの想いを、次の世代へとつなぎます。
          </p>
        </Reveal>
      </section>

      {/* ── merits ── */}
      <section
        style={{
          background: "linear-gradient(180deg,#ffffff,#f1fafe)",
          padding: "clamp(40px,6vw,76px) clamp(18px,4vw,40px)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal
            delay={0}
            style={{ textAlign: "center", marginBottom: "clamp(28px,4vw,44px)" }}
          >
            <div
              style={{
                fontWeight: 900,
                letterSpacing: ".2em",
                color: "var(--accent,#ff6a3d)",
                fontSize: "13px",
                marginBottom: "12px",
              }}
            >
              MERITS
            </div>
            <h2
              style={{
                fontFamily: "'Zen Maru Gothic',sans-serif",
                fontWeight: 900,
                fontSize: "clamp(24px,3.4vw,38px)",
                margin: 0,
                color: "#0a3346",
              }}
            >
              協賛で得られる3つのメリット
            </h2>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: "20px",
            }}
          >
            {merits.map((m, i) => (
              <Fragment key={i}>
                <Reveal
                  delay={m.delay}
                  style={{
                    background: "#fff",
                    border: "1.5px solid #e2f1f8",
                    borderRadius: "22px",
                    padding: "30px 26px",
                    transition: "transform .3s ease, box-shadow .3s ease",
                  }}
                  hoverStyle={{
                    transform: "translateY(-6px)",
                    boxShadow: "0 20px 40px rgba(10,147,196,.14)",
                  }}
                >
                  <div
                    style={{
                      width: "54px",
                      height: "54px",
                      borderRadius: "16px",
                      background: m.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d={m.icon}
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Zen Maru Gothic',sans-serif",
                      fontWeight: 900,
                      fontSize: "18px",
                      margin: "0 0 9px",
                      color: "#0a3346",
                    }}
                  >
                    {m.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      lineHeight: 1.85,
                      color: "#48707f",
                    }}
                  >
                    {m.body}
                  </p>
                </Reveal>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── plans ── */}
      <section
        id="plans"
        style={{
          background: "#ffffff",
          padding: "clamp(40px,6vw,76px) clamp(18px,4vw,40px)",
        }}
      >
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <Reveal
            delay={0}
            style={{ textAlign: "center", marginBottom: "clamp(28px,4vw,44px)" }}
          >
            <div
              style={{
                fontWeight: 900,
                letterSpacing: ".2em",
                color: "var(--accent,#ff6a3d)",
                fontSize: "13px",
                marginBottom: "12px",
              }}
            >
              PLANS
            </div>
            <h2
              style={{
                fontFamily: "'Zen Maru Gothic',sans-serif",
                fontWeight: 900,
                fontSize: "clamp(24px,3.4vw,38px)",
                margin: "0 0 10px",
                color: "#0a3346",
              }}
            >
              協賛プラン
            </h2>
            <p
              style={{
                margin: 0,
                color: "#48707f",
                fontSize: "14.5px",
              }}
            >
              ご予算・ご希望に合わせて選べます。記載は一例です。内容はお気軽にご相談ください。
            </p>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))",
              gap: "22px",
              alignItems: "stretch",
            }}
          >
            {plans.map((p, i) => (
              <Fragment key={i}>
                <Reveal
                  delay={p.delay}
                  style={{
                    position: "relative",
                    background: p.cardBg,
                    border: `2px solid ${p.border}`,
                    borderRadius: "24px",
                    padding: "32px 28px",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: p.shadow,
                    transition: "transform .3s ease",
                  }}
                  hoverStyle={{ transform: "translateY(-7px)" }}
                >
                  {p.featured && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-13px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "var(--accent,#ff6a3d)",
                        color: "#fff",
                        fontFamily: "'Zen Maru Gothic',sans-serif",
                        fontWeight: 900,
                        fontSize: "12px",
                        padding: "6px 16px",
                        borderRadius: "999px",
                        boxShadow: "0 8px 18px rgba(255,90,43,.4)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      おすすめ
                    </div>
                  )}
                  <div
                    style={{
                      fontFamily: "'Zen Maru Gothic',sans-serif",
                      fontWeight: 900,
                      fontSize: "20px",
                      color: p.titleColor,
                    }}
                  >
                    {p.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "4px",
                      margin: "16px 0 4px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Zen Maru Gothic',sans-serif",
                        fontWeight: 900,
                        fontSize: "34px",
                        color: p.titleColor,
                      }}
                    >
                      {p.price}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        color: p.sub,
                        fontWeight: 700,
                      }}
                    >
                      /年（例）
                    </span>
                  </div>
                  <div
                    style={{
                      height: "1px",
                      background: p.divider,
                      margin: "18px 0",
                    }}
                  />
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: "0 0 24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "11px",
                    }}
                  >
                    {p.features.map((f, fi) => (
                      <li
                        key={fi}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "9px",
                          fontSize: "13.5px",
                          color: p.text,
                          fontWeight: 600,
                          lineHeight: 1.6,
                        }}
                      >
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          style={{ flex: "none", marginTop: "1px" }}
                        >
                          <circle cx="12" cy="12" r="10" fill={p.tick} />
                          <path
                            d="M8 12.5l2.5 2.5L16 9"
                            stroke={p.tickStroke}
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Hoverable
                    as="a"
                    baseStyle={{
                      marginTop: "auto",
                      textAlign: "center",
                      textDecoration: "none",
                      fontFamily: "'Zen Maru Gothic',sans-serif",
                      background: p.btnBg,
                      color: p.btnColor,
                      fontWeight: 900,
                      fontSize: "15px",
                      padding: "14px",
                      borderRadius: "999px",
                      border: p.btnBorder,
                      transition: "transform .2s ease",
                      display: "block",
                    }}
                    hoverStyle={{ transform: "scale(1.03)" }}
                    href="#contact"
                  >
                    このプランを相談する
                  </Hoverable>
                </Reveal>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── placement images ── */}
      <section
        style={{
          background: "linear-gradient(180deg,#ffffff,#eaf7fc)",
          padding: "clamp(40px,6vw,72px) clamp(18px,4vw,40px)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal
            delay={0}
            style={{ textAlign: "center", marginBottom: "clamp(26px,3vw,40px)" }}
          >
            <div
              style={{
                fontWeight: 900,
                letterSpacing: ".2em",
                color: "var(--accent,#ff6a3d)",
                fontSize: "13px",
                marginBottom: "12px",
              }}
            >
              EXAMPLES
            </div>
            <h2
              style={{
                fontFamily: "'Zen Maru Gothic',sans-serif",
                fontWeight: 900,
                fontSize: "clamp(24px,3.4vw,38px)",
                margin: 0,
                color: "#0a3346",
              }}
            >
              ロゴ掲出のイメージ
            </h2>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: "18px",
            }}
          >
            {placements.map((pl, i) => (
              <Fragment key={i}>
                <Reveal
                  delay={pl.delay}
                  style={{
                    background: "#fff",
                    border: "1.5px solid #e2f1f8",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 14px 30px rgba(10,147,196,.08)",
                  }}
                >
                  <ImagePlaceholder
                    style={{ width: "100%", height: "170px", display: "block" }}
                    shape="rect"
                    placeholder={pl.label}
                  />
                  <div style={{ padding: "16px 18px" }}>
                    <h3
                      style={{
                        fontFamily: "'Zen Maru Gothic',sans-serif",
                        fontWeight: 900,
                        fontSize: "15.5px",
                        margin: "0 0 4px",
                        color: "#0a3346",
                      }}
                    >
                      {pl.label}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12.5px",
                        color: "#5a7d8c",
                        lineHeight: 1.6,
                      }}
                    >
                      {pl.body}
                    </p>
                  </div>
                </Reveal>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── flow ── */}
      <section
        style={{
          background: "#ffffff",
          padding: "clamp(40px,6vw,72px) clamp(18px,4vw,40px)",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <Reveal
            delay={0}
            style={{ textAlign: "center", marginBottom: "clamp(28px,4vw,44px)" }}
          >
            <div
              style={{
                fontWeight: 900,
                letterSpacing: ".2em",
                color: "var(--accent,#ff6a3d)",
                fontSize: "13px",
                marginBottom: "12px",
              }}
            >
              FLOW
            </div>
            <h2
              style={{
                fontFamily: "'Zen Maru Gothic',sans-serif",
                fontWeight: 900,
                fontSize: "clamp(24px,3.4vw,38px)",
                margin: 0,
                color: "#0a3346",
              }}
            >
              ご協賛までの流れ
            </h2>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: "16px",
            }}
          >
            {steps.map((st, i) => (
              <Fragment key={i}>
                <Reveal
                  delay={st.delay}
                  style={{
                    background: "#f5fbfe",
                    border: "1.5px solid #e2f1f8",
                    borderRadius: "20px",
                    padding: "26px 22px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Zen Maru Gothic',sans-serif",
                      fontWeight: 900,
                      fontSize: "13px",
                      color: "var(--accent,#ff6a3d)",
                      marginBottom: "10px",
                    }}
                  >
                    STEP {st.n}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Zen Maru Gothic',sans-serif",
                      fontWeight: 900,
                      fontSize: "16px",
                      margin: "0 0 7px",
                      color: "#0a3346",
                    }}
                  >
                    {st.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      lineHeight: 1.7,
                      color: "#5a7d8c",
                    }}
                  >
                    {st.body}
                  </p>
                </Reveal>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── contact ── */}
      <section
        id="contact"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(160deg,#0c3a4d,#0a6f95 60%,#0a93c4)",
          padding: "clamp(44px,6vw,84px) clamp(18px,4vw,40px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-20px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(255,255,255,.08)",
          }}
        />
        <Reveal
          delay={0}
          style={{ position: "relative", zIndex: 2, maxWidth: "640px", margin: "0 auto" }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "26px",
              color: "#fff",
            }}
          >
            <h2
              style={{
                fontFamily: "'Zen Maru Gothic',sans-serif",
                fontWeight: 900,
                fontSize: "clamp(26px,3.8vw,40px)",
                margin: "0 0 10px",
              }}
            >
              協賛のお問い合わせ
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "14.5px",
                lineHeight: 1.8,
                opacity: 0.9,
              }}
            >
              資料送付・ご相談も歓迎です。まずはお気軽にどうぞ。
            </p>
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: "24px",
              boxShadow: "0 26px 56px rgba(0,0,0,.3)",
              padding: "clamp(26px,4vw,38px)",
            }}
          >
            {sent ? (
              /* thank-you panel */
              <div style={{ textAlign: "center", padding: "18px 6px" }}>
                <div
                  style={{
                    width: "74px",
                    height: "74px",
                    borderRadius: "50%",
                    background: "rgba(31,176,107,.14)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    animation: "popIn .4s ease",
                  }}
                >
                  <svg
                    width="38"
                    height="38"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5 13l4 4 10-11"
                      stroke="#1fb06b"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: "'Zen Maru Gothic',sans-serif",
                    fontWeight: 900,
                    fontSize: "22px",
                    margin: "0 0 10px",
                    color: "#0a3346",
                  }}
                >
                  お問い合わせありがとうございます！
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.8,
                    color: "#48707f",
                    margin: 0,
                  }}
                >
                  担当者より2〜3営業日以内にご連絡いたします。どうぞよろしくお願いいたします。
                </p>
              </div>
            ) : (
              /* inquiry form */
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "15px" }}
              >
                {fields.map((f, i) => (
                  <label key={i} style={{ display: "block" }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: "12.5px",
                        fontWeight: 800,
                        color: "#33606f",
                        marginBottom: "6px",
                      }}
                    >
                      {f.label}
                    </span>
                    <input
                      ref={
                        i === 0
                          ? companyRef
                          : i === 1
                          ? personRef
                          : contactRef
                      }
                      type="text"
                      placeholder={f.ph}
                      style={{
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
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.border =
                          "1.5px solid var(--ocean,#0a93c4)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.border = "1.5px solid #dce9ef";
                      }}
                    />
                  </label>
                ))}
                <label style={{ display: "block" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "12.5px",
                      fontWeight: 800,
                      color: "#33606f",
                      marginBottom: "6px",
                    }}
                  >
                    ご興味のあるプラン・ご質問
                  </span>
                  <textarea
                    ref={messageRef}
                    rows={3}
                    placeholder="例）シルバープランに興味があります／資料がほしい など"
                    style={{
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
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border =
                        "1.5px solid var(--ocean,#0a93c4)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = "1.5px solid #dce9ef";
                    }}
                  />
                </label>
                {error && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#e0330c",
                      lineHeight: 1.6,
                    }}
                  >
                    {error}
                  </p>
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
                    width: "100%",
                  }}
                  hoverStyle={{ transform: "translateY(-2px)" }}
                  type="submit"
                >
                  お問い合わせを送信する
                </Hoverable>
              </form>
            )}
          </div>
        </Reveal>
      </section>

      {/* ── footer ── */}
      <footer
        style={{
          background: "#0a3346",
          color: "#cfe3ec",
          padding: "34px clamp(18px,4vw,40px)",
          textAlign: "center",
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}
        >
          <img
            src="/assets/miyata-logo-dark.png"
            alt="ミヤタアスリートクラブ"
            style={{ height: "84px", width: "auto", display: "block" }}
          />
        </div>
        <div
          style={{
            fontSize: "12.5px",
            color: "#8fb3c2",
            marginBottom: "14px",
          }}
        >
          コザ運動公園 陸上競技場（沖縄県沖縄市）
        </div>
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "#cfe3ec",
            fontWeight: 700,
            fontSize: "13px",
            border: "1px solid rgba(255,255,255,.2)",
            padding: "9px 18px",
            borderRadius: "999px",
          }}
        >
          ← トップページへ戻る
        </Link>
      </footer>
    </div>
  );
}
