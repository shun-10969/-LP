"use client";

import React, { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { markSeenAction, logoutAction } from "@/app/admin/actions";
import type { AdminData } from "@/lib/admin";
import type { SubmissionCategory } from "@/lib/types";

type TabKey = "trial" | "pay" | "coach" | "sponsor" | "withdraw";
const TAB_CATEGORY: Record<TabKey, SubmissionCategory> = {
  trial: "trial",
  pay: "enrollment",
  coach: "coach",
  sponsor: "sponsor",
  withdraw: "withdrawal",
};

const STUDENTS = [
  { n: "比嘉 蓮", g: "小2", c: "low" },
  { n: "金城 陽菜", g: "小1", c: "low" },
  { n: "大城 颯", g: "小3", c: "low" },
  { n: "島袋 さくら", g: "小2", c: "low" },
  { n: "宮里 結愛", g: "小5", c: "high" },
  { n: "新垣 大輔", g: "小4", c: "high" },
  { n: "上原 美月", g: "小6", c: "high" },
  { n: "山城 楓", g: "小5", c: "high" },
  { n: "仲村 海斗", g: "中2", c: "adv" },
  { n: "玉城 莉子", g: "中1", c: "adv" },
  { n: "下地 翔太", g: "中3", c: "adv" },
  { n: "平良 健", g: "高1", c: "adv" },
] as const;

const CM: Record<
  string,
  { label: string; color: string; bg: string; days: number[] }
> = {
  low: { label: "低学年", color: "#0a7d4f", bg: "#e9f8f0", days: [1, 4] },
  high: { label: "高学年", color: "#c2491f", bg: "#fff0ea", days: [3, 5] },
  adv: { label: "アスリート育成", color: "#0a5f8a", bg: "#e9f3fb", days: [1, 3, 5] },
};
const WK = ["日", "月", "火", "水", "木", "金", "土"];

const yen = (n: number) => "¥" + n.toLocaleString();
function isoOf(d: Date) {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}
function mdLabel(s: string | null) {
  if (!s) return "—";
  const d = new Date(s);
  return d.getMonth() + 1 + "/" + d.getDate();
}

export function AdminDashboard({
  data,
  unread,
}: {
  data: AdminData;
  unread: Record<SubmissionCategory, number>;
}) {
  const [tab, setTab] = useState<TabKey>("trial");
  const [seen, setSeen] = useState<Record<SubmissionCategory, boolean>>({
    trial: true, // trial is open on mount
    enrollment: false,
    coach: false,
    sponsor: false,
    withdrawal: false,
  });
  const [, startTransition] = useTransition();

  function openTab(key: TabKey) {
    setTab(key);
    const cat = TAB_CATEGORY[key];
    if (!seen[cat]) {
      setSeen((s) => ({ ...s, [cat]: true }));
      startTransition(() => {
        markSeenAction(cat);
      });
    }
  }

  const counts: Record<TabKey, number> = {
    trial: data.trial.length,
    pay: data.enrollment.length,
    coach: data.coach.length,
    sponsor: data.sponsor.length,
    withdraw: data.withdrawal.length,
  };

  const tabDefs: { key: TabKey; label: string }[] = [
    { key: "trial", label: "体験・見学予約" },
    { key: "pay", label: "料金決済（入会）" },
    { key: "coach", label: "コーチ募集" },
    { key: "sponsor", label: "スポンサー募集" },
    { key: "withdraw", label: "退会申請" },
  ];

  // ---- trial-tab roster (14 days) ----
  const { days, weekTrials, todayLabel } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const out: {
      label: string;
      dow: string;
      isToday: boolean;
      closed: boolean;
      trials: { name: string; gakunen: string; contact: string }[];
      students: {
        name: string;
        grade: string;
        tag: string;
        tagColor: string;
        tagBg: string;
      }[];
      headStyle: React.CSSProperties;
    }[] = [];
    let week = 0;
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const w = d.getDay();
      const iso = isoOf(d);
      const closed = w === 0 || w === 2 || w === 6;
      const trials = data.trial
        .filter((e) => e.event_date === iso)
        .map((e) => ({
          name: ((e.sei || "") + " " + (e.mei || "")).trim() || "(無記名)",
          gakunen: e.gakunen || "—",
          contact: e.tel || e.email || "—",
        }));
      const students = closed
        ? []
        : STUDENTS.filter((s) => CM[s.c].days.includes(w)).map((s) => ({
            name: s.n,
            grade: s.g,
            tag: CM[s.c].label,
            tagColor: CM[s.c].color,
            tagBg: CM[s.c].bg,
          }));
      if (i < 7) week += trials.length;
      out.push({
        label: d.getMonth() + 1 + "/" + d.getDate(),
        dow: WK[w],
        isToday: i === 0,
        closed,
        trials,
        students,
        headStyle:
          i === 0
            ? {
                background: "linear-gradient(135deg,#0a3346,#0a93c4)",
                color: "#ffffff",
              }
            : { background: "#f5f9fb", color: "#0a3346" },
      });
    }
    const tl =
      today.getMonth() +
      1 +
      "月" +
      today.getDate() +
      "日（" +
      WK[today.getDay()] +
      "）";
    return { days: out, weekTrials: week, todayLabel: tl };
  }, [data.trial]);

  const stats = [
    {
      label: "本日の体験予約",
      value: days[0]?.trials.length ?? 0,
      unit: "件",
      c: "var(--accent,#ff6a3d)",
    },
    { label: "今週の体験予約", value: weekTrials, unit: "件", c: "var(--ocean,#0a93c4)" },
    { label: "在籍生徒", value: STUDENTS.length, unit: "名", c: "#1fb06b" },
    { label: "体験申込 累計", value: data.trial.length, unit: "件", c: "#5b4fa3" },
  ];

  const payments = data.enrollment;
  const coachApps = data.coach;
  const sponsors = data.sponsor;
  const withdraws = data.withdrawal;

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        fontFamily: "'Zen Kaku Gothic New',sans-serif",
        background: "#eef3f6",
        color: "#0c3a4d",
        ["--accent" as string]: "#ff6a3d",
        ["--ocean" as string]: "#0a93c4",
      }}
    >
      {/* top bar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "#ffffff",
          borderBottom: "1px solid #e4ebef",
          boxShadow: "0 2px 12px rgba(10,58,77,.05)",
        }}
      >
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "11px clamp(16px,3vw,32px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/miyata-logo-trans.png"
              alt="ミヤタアスリートクラブ"
              style={{ height: "46px", width: "auto", display: "block" }}
            />
            <div style={{ height: "30px", width: "1px", background: "#e4ebef" }} />
            <div
              style={{
                fontFamily: "'Zen Maru Gothic',sans-serif",
                fontWeight: 900,
                fontSize: "16px",
                color: "#0a3346",
              }}
            >
              管理ダッシュボード
            </div>
            <span
              style={{
                background: "#eef3f6",
                color: "#5a7d8c",
                fontWeight: 800,
                fontSize: "10.5px",
                letterSpacing: ".1em",
                padding: "4px 9px",
                borderRadius: "6px",
              }}
            >
              STAFF
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "#5a7d8c",
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              サイトを見る
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontFamily: "'Zen Maru Gothic',sans-serif",
                  border: "1.5px solid #f0d4cd",
                  background: "#fff",
                  color: "#c2491f",
                  fontWeight: 800,
                  fontSize: "13px",
                  padding: "9px 14px",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 17l5-5-5-5M20 12H9M11 4H6a2 2 0 00-2 2v12a2 2 0 002 2h5"
                    stroke="#c2491f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                ログアウト
              </button>
            </form>
            <button
              onClick={() => location.reload()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                fontFamily: "'Zen Maru Gothic',sans-serif",
                border: "1.5px solid #d9e4ea",
                background: "#fff",
                color: "#0a3346",
                fontWeight: 800,
                fontSize: "13px",
                padding: "9px 16px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 11a8 8 0 10-2 5.3M20 20v-5h-5"
                  stroke="#0a93c4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              更新
            </button>
          </div>
        </div>
      </nav>

      <main
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "clamp(20px,3vw,30px) clamp(16px,3vw,32px) 60px",
        }}
      >
        <div style={{ marginBottom: "18px" }}>
          <h1
            style={{
              fontFamily: "'Zen Maru Gothic',sans-serif",
              fontWeight: 900,
              fontSize: "clamp(22px,3vw,30px)",
              margin: "0 0 4px",
              color: "#0a3346",
            }}
          >
            予約・申込管理
          </h1>
          <div style={{ color: "#5a7d8c", fontSize: "13.5px", fontWeight: 600 }}>
            本日 {todayLabel} 時点 ／ 各フォームの申込を確認できます
          </div>
        </div>

        {/* tabs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "4px",
            borderBottom: "1px solid #e0e8ec",
            marginBottom: "24px",
          }}
        >
          {tabDefs.map((t) => {
            const active = tab === t.key;
            const cat = TAB_CATEGORY[t.key];
            const count = counts[t.key];
            const isNew = !seen[cat] && unread[cat] > 0;
            return (
              <button
                key={t.key}
                onClick={() => openTab(t.key)}
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily: "'Zen Maru Gothic',sans-serif",
                  fontWeight: 900,
                  fontSize: "14.5px",
                  padding: "12px 16px",
                  color: active ? "#0a3346" : "#8aa3af",
                  borderBottom: active
                    ? "2.5px solid var(--ocean,#0a93c4)"
                    : "2.5px solid transparent",
                  marginBottom: "-1px",
                }}
              >
                <span>{t.label}</span>
                {count > 0 && (
                  <span
                    style={{
                      background: active ? "var(--ocean,#0a93c4)" : "#dde7ec",
                      color: active ? "#fff" : "#5a7d8c",
                      fontWeight: 900,
                      fontSize: "11px",
                      minWidth: "20px",
                      textAlign: "center",
                      padding: "2px 7px",
                      borderRadius: "999px",
                    }}
                  >
                    {count}
                  </span>
                )}
                {isNew && (
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "var(--accent,#ff6a3d)",
                      animation: "pulseDot 1.4s ease-in-out infinite",
                      boxShadow: "0 0 0 3px rgba(255,106,61,.18)",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ===== TAB: 体験予約 ===== */}
        {tab === "trial" && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                gap: "14px",
                marginBottom: "26px",
              }}
            >
              {stats.map((st, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    border: "1px solid #e4ebef",
                    borderRadius: "16px",
                    padding: "20px 22px",
                    boxShadow: "0 6px 18px rgba(10,58,77,.05)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12.5px",
                      color: "#5a7d8c",
                      fontWeight: 700,
                      marginBottom: "8px",
                    }}
                  >
                    {st.label}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
                    <span
                      style={{
                        fontFamily: "'Zen Maru Gothic',sans-serif",
                        fontWeight: 900,
                        fontSize: "34px",
                        color: st.c,
                        lineHeight: 1,
                      }}
                    >
                      {st.value}
                    </span>
                    <span style={{ fontSize: "13px", color: "#5a7d8c", fontWeight: 700 }}>
                      {st.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "18px",
                  background: "var(--ocean,#0a93c4)",
                  borderRadius: "2px",
                }}
              />
              <h2
                style={{
                  fontFamily: "'Zen Maru Gothic',sans-serif",
                  fontWeight: 900,
                  fontSize: "17px",
                  margin: 0,
                  color: "#0a3346",
                }}
              >
                日付ごとの名簿
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(330px,1fr))",
                gap: "16px",
              }}
            >
              {days.map((d, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    border: "1px solid #e4ebef",
                    borderRadius: "18px",
                    overflow: "hidden",
                    boxShadow: "0 6px 18px rgba(10,58,77,.06)",
                  }}
                >
                  <div style={d.headStyle}>
                    <div
                      style={{
                        padding: "15px 18px",
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Zen Maru Gothic',sans-serif",
                          fontWeight: 900,
                          fontSize: "19px",
                        }}
                      >
                        {d.label}
                      </span>
                      <span style={{ fontWeight: 800, fontSize: "13px", opacity: 0.85 }}>
                        （{d.dow}）
                      </span>
                      {d.isToday && (
                        <span
                          style={{
                            background: "var(--accent,#ff6a3d)",
                            color: "#fff",
                            fontWeight: 900,
                            fontSize: "10.5px",
                            padding: "3px 9px",
                            borderRadius: "999px",
                          }}
                        >
                          本日
                        </span>
                      )}
                      {d.closed && (
                        <span
                          style={{
                            background: "rgba(154,167,174,.25)",
                            color: "inherit",
                            fontWeight: 800,
                            fontSize: "10.5px",
                            padding: "3px 9px",
                            borderRadius: "999px",
                          }}
                        >
                          休講
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "16px 18px 18px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "9px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Zen Maru Gothic',sans-serif",
                            fontWeight: 900,
                            fontSize: "13.5px",
                            color: "#0a3346",
                          }}
                        >
                          体験者名簿
                        </span>
                        <span
                          style={{
                            background: "#fff1ea",
                            color: "var(--accent,#ff6a3d)",
                            fontWeight: 900,
                            fontSize: "11.5px",
                            padding: "3px 10px",
                            borderRadius: "999px",
                          }}
                        >
                          {d.trials.length}件
                        </span>
                      </div>
                      {d.trials.length > 0 ? (
                        <div
                          style={{ display: "flex", flexDirection: "column", gap: "7px" }}
                        >
                          {d.trials.map((t, j) => (
                            <div
                              key={j}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "8px",
                                background: "#fbfdfe",
                                border: "1px solid #eef4f7",
                                borderRadius: "11px",
                                padding: "10px 12px",
                              }}
                            >
                              <div style={{ minWidth: 0 }}>
                                <div
                                  style={{
                                    fontWeight: 800,
                                    fontSize: "13.5px",
                                    color: "#0a3346",
                                  }}
                                >
                                  {t.name}
                                </div>
                                <div
                                  style={{
                                    fontSize: "11.5px",
                                    color: "#7c98a6",
                                    marginTop: "1px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {t.contact}
                                </div>
                              </div>
                              <span
                                style={{
                                  flex: "none",
                                  background: "#eaf4fb",
                                  color: "var(--ocean,#0a93c4)",
                                  fontWeight: 800,
                                  fontSize: "11px",
                                  padding: "3px 9px",
                                  borderRadius: "999px",
                                }}
                              >
                                {t.gakunen}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: "12.5px",
                            color: "#9bb2bc",
                            background: "#f7fafb",
                            border: "1px dashed #e1e9ed",
                            borderRadius: "11px",
                            padding: "11px 12px",
                            textAlign: "center",
                          }}
                        >
                          体験予約はありません
                        </div>
                      )}
                    </div>
                    <div style={{ height: "1px", background: "#eef3f6" }} />
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "9px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Zen Maru Gothic',sans-serif",
                            fontWeight: 900,
                            fontSize: "13.5px",
                            color: "#0a3346",
                          }}
                        >
                          生徒名簿
                        </span>
                        <span
                          style={{
                            background: "#eaf4fb",
                            color: "var(--ocean,#0a93c4)",
                            fontWeight: 900,
                            fontSize: "11.5px",
                            padding: "3px 10px",
                            borderRadius: "999px",
                          }}
                        >
                          {d.students.length}名
                        </span>
                      </div>
                      {d.closed ? (
                        <div
                          style={{
                            fontSize: "12.5px",
                            color: "#9bb2bc",
                            background: "#f7fafb",
                            border: "1px dashed #e1e9ed",
                            borderRadius: "11px",
                            padding: "11px 12px",
                            textAlign: "center",
                          }}
                        >
                          休講日です
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                          {d.students.map((s, j) => (
                            <div
                              key={j}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "7px",
                                background: "#fbfdfe",
                                border: "1px solid #eef4f7",
                                borderRadius: "10px",
                                padding: "7px 11px",
                              }}
                            >
                              <span
                                style={{ fontWeight: 800, fontSize: "13px", color: "#0a3346" }}
                              >
                                {s.name}
                              </span>
                              <span
                                style={{ fontSize: "10.5px", color: "#7c98a6", fontWeight: 700 }}
                              >
                                {s.grade}
                              </span>
                              <span
                                style={{
                                  background: s.tagBg,
                                  color: s.tagColor,
                                  fontWeight: 800,
                                  fontSize: "10px",
                                  padding: "2px 7px",
                                  borderRadius: "6px",
                                }}
                              >
                                {s.tag}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===== TAB: 料金決済 ===== */}
        {tab === "pay" &&
          (payments.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
                gap: "16px",
              }}
            >
              {payments.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #e4ebef",
                    borderRadius: "18px",
                    boxShadow: "0 6px 18px rgba(10,58,77,.06)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      background: "linear-gradient(135deg,#0c3a4d,#0a93c4)",
                      color: "#fff",
                      padding: "16px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Zen Maru Gothic',sans-serif",
                        fontWeight: 900,
                        fontSize: "16px",
                      }}
                    >
                      {p.plan_name || "—"}
                    </span>
                    <span
                      style={{
                        background: "rgba(255,255,255,.18)",
                        fontWeight: 800,
                        fontSize: "13px",
                        padding: "4px 11px",
                        borderRadius: "999px",
                      }}
                    >
                      {yen(p.monthly_yen)}/月
                    </span>
                  </div>
                  <div
                    style={{
                      padding: "16px 18px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "9px",
                    }}
                  >
                    <Row label="申込者" value={p.card_name || "(未記入)"} bold />
                    <Row label="初月請求" value={yen(p.first_month_yen)} color="var(--accent,#ff6a3d)" bold />
                    <Row label="決済日" value={mdLabel(p.created_at)} />
                    <div
                      style={{
                        display: "inline-flex",
                        alignSelf: "flex-start",
                        alignItems: "center",
                        gap: "5px",
                        marginTop: "3px",
                        background: "#eafaf2",
                        color: "#1fb06b",
                        fontWeight: 800,
                        fontSize: "11px",
                        padding: "4px 10px",
                        borderRadius: "999px",
                      }}
                    >
                      受付済み
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="決済（入会申込）はまだありません。" />
          ))}

        {/* ===== TAB: コーチ募集 ===== */}
        {tab === "coach" &&
          (coachApps.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(330px,1fr))",
                gap: "16px",
              }}
            >
              {coachApps.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #e4ebef",
                    borderRadius: "18px",
                    boxShadow: "0 6px 18px rgba(10,58,77,.06)",
                    padding: "18px 20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                      <span
                        style={{
                          fontFamily: "'Zen Maru Gothic',sans-serif",
                          fontWeight: 900,
                          fontSize: "17px",
                          color: "#0a3346",
                        }}
                      >
                        {c.name || "(未記入)"}
                      </span>
                      <span
                        style={{
                          background: "#eaf4fb",
                          color: "var(--ocean,#0a93c4)",
                          fontWeight: 800,
                          fontSize: "11px",
                          padding: "3px 9px",
                          borderRadius: "999px",
                        }}
                      >
                        {c.age || "—"}
                      </span>
                    </div>
                    <span style={{ color: "#9bb2bc", fontSize: "11.5px", fontWeight: 700 }}>
                      {mdLabel(c.created_at)}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                    <Field label="経験" value={c.experience || "—"} />
                    <Field label="志望動機" value={c.motivation || "—"} multiline />
                  </div>
                  <div
                    style={{
                      marginTop: "13px",
                      paddingTop: "11px",
                      borderTop: "1px solid #eef3f6",
                      fontSize: "12.5px",
                      color: "#5a7d8c",
                      fontWeight: 700,
                    }}
                  >
                    連絡先：{c.contact || "—"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="コーチ募集への応募はまだありません。" />
          ))}

        {/* ===== TAB: スポンサー募集 ===== */}
        {tab === "sponsor" &&
          (sponsors.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(330px,1fr))",
                gap: "16px",
              }}
            >
              {sponsors.map((s) => (
                <div
                  key={s.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #e4ebef",
                    borderRadius: "18px",
                    boxShadow: "0 6px 18px rgba(10,58,77,.06)",
                    padding: "18px 20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Zen Maru Gothic',sans-serif",
                        fontWeight: 900,
                        fontSize: "16px",
                        color: "#0a3346",
                      }}
                    >
                      {s.company || "(未記入)"}
                    </span>
                    <span style={{ color: "#9bb2bc", fontSize: "11.5px", fontWeight: 700 }}>
                      {mdLabel(s.created_at)}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                    <Row label="ご担当" value={s.person || "—"} bold />
                    <Field label="ご質問・ご興味" value={s.message || "—"} multiline />
                  </div>
                  <div
                    style={{
                      marginTop: "13px",
                      paddingTop: "11px",
                      borderTop: "1px solid #eef3f6",
                      fontSize: "12.5px",
                      color: "#5a7d8c",
                      fontWeight: 700,
                    }}
                  >
                    連絡先：{s.contact || "—"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="スポンサー募集へのお問い合わせはまだありません。" />
          ))}

        {/* ===== TAB: 退会申請 ===== */}
        {tab === "withdraw" &&
          (withdraws.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(330px,1fr))",
                gap: "16px",
              }}
            >
              {withdraws.map((w) => (
                <div
                  key={w.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #e4ebef",
                    borderRadius: "18px",
                    boxShadow: "0 6px 18px rgba(10,58,77,.06)",
                    padding: "18px 20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                      <span
                        style={{
                          fontFamily: "'Zen Maru Gothic',sans-serif",
                          fontWeight: 900,
                          fontSize: "16px",
                          color: "#0a3346",
                        }}
                      >
                        {w.member_name || "(未記入)"}
                      </span>
                      <span
                        style={{
                          background: "#f0f2f4",
                          color: "#5a7d8c",
                          fontWeight: 800,
                          fontSize: "11px",
                          padding: "3px 9px",
                          borderRadius: "999px",
                        }}
                      >
                        {w.course || "—"}
                      </span>
                    </div>
                    <span style={{ color: "#9bb2bc", fontSize: "11.5px", fontWeight: 700 }}>
                      {mdLabel(w.created_at)}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                    <Row label="退会希望月" value={w.desired_month || "—"} color="#c2491f" bold />
                    <Field label="退会理由" value={w.reason || "—"} multiline />
                  </div>
                  <div
                    style={{
                      marginTop: "13px",
                      paddingTop: "11px",
                      borderTop: "1px solid #eef3f6",
                      fontSize: "12.5px",
                      color: "#5a7d8c",
                      fontWeight: 700,
                    }}
                  >
                    連絡先：{w.contact || "—"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="退会申請はまだありません。" />
          ))}

        <p
          style={{
            textAlign: "center",
            color: "#9bb2bc",
            fontSize: "12px",
            margin: "28px 0 0",
          }}
        >
          ＊各データはサイトのフォーム送信内容を保存して表示しています。新着がある項目にはタブに通知が表示されます。
        </p>
      </main>
    </div>
  );
}

function Row({
  label,
  value,
  color,
  bold,
}: {
  label: string;
  value: string;
  color?: string;
  bold?: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px" }}>
      <span style={{ color: "#7c98a6" }}>{label}</span>
      <span style={{ fontWeight: bold ? 800 : 700, color: color ?? "#0a3346" }}>
        {value}
      </span>
    </div>
  );
}

function Field({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: "11px",
          fontWeight: 800,
          color: "#9bb2bc",
          letterSpacing: ".05em",
          marginBottom: "2px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "13.5px",
          color: "#33606f",
          ...(multiline ? { lineHeight: 1.7 } : null),
        }}
      >
        {value}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px dashed #d8e3e9",
        borderRadius: "16px",
        padding: "40px",
        textAlign: "center",
        color: "#9bb2bc",
        fontSize: "14px",
      }}
    >
      {text}
    </div>
  );
}
