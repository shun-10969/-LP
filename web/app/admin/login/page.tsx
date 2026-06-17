"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const STAFF_EMAIL_DOMAIN =
  process.env.NEXT_PUBLIC_STAFF_EMAIL_DOMAIN ?? "staff.miyata-athlete.jp";

function idToEmail(input: string): string {
  const v = input.trim();
  if (v.includes("@")) return v.toLowerCase();
  return `${v.toLowerCase()}@${STAFF_EMAIL_DOMAIN}`;
}

const inputStyle: React.CSSProperties = {
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

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function doLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const id = (
      (form.elements.namedItem("loginId") as HTMLInputElement)?.value || ""
    ).trim();
    const pw = (
      (form.elements.namedItem("loginPw") as HTMLInputElement)?.value || ""
    ).trim();
    if (!id || !pw) {
      setLoginError(true);
      return;
    }
    setBusy(true);
    setLoginError(false);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: idToEmail(id),
      password: pw,
    });
    setBusy(false);
    if (error) {
      setLoginError(true);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        fontFamily: "'Zen Kaku Gothic New',sans-serif",
        ["--accent" as string]: "#ff6a3d",
        ["--ocean" as string]: "#0a93c4",
      }}
    >
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          overflow: "hidden",
          background:
            "linear-gradient(160deg,#0c3a4d 0%, #0a6f95 55%, #0a93c4 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-40px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,227,156,.28) 0%, rgba(255,227,156,0) 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-90px",
            left: "-50px",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: "rgba(255,255,255,.06)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: "400px",
            background: "#fff",
            borderRadius: "24px",
            boxShadow: "0 30px 70px rgba(0,0,0,.32)",
            padding: "clamp(30px,5vw,40px) clamp(26px,4vw,36px)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/miyata-logo-trans.png"
              alt="ミヤタアスリートクラブ"
              style={{
                height: "64px",
                width: "auto",
                display: "block",
                margin: "0 auto 16px",
              }}
            />
            <h1
              style={{
                fontFamily: "'Zen Maru Gothic',sans-serif",
                fontWeight: 900,
                fontSize: "21px",
                margin: "0 0 5px",
                color: "#0a3346",
              }}
            >
              スタッフログイン
            </h1>
            <p style={{ margin: 0, fontSize: "12.5px", color: "#5a7d8c" }}>
              管理ダッシュボードへのアクセスには認証が必要です
            </p>
          </div>
          <form onSubmit={doLogin}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <label style={{ display: "block" }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "#33606f",
                    marginBottom: "6px",
                  }}
                >
                  スタッフID
                </span>
                <input
                  name="loginId"
                  type="text"
                  autoComplete="off"
                  placeholder="IDを入力"
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.currentTarget.style.border =
                      "1.5px solid var(--ocean,#0a93c4)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.border = "1.5px solid #dce9ef")
                  }
                />
              </label>
              <label style={{ display: "block" }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "#33606f",
                    marginBottom: "6px",
                  }}
                >
                  パスワード
                </span>
                <div style={{ position: "relative" }}>
                  <input
                    name="loginPw"
                    type={showPw ? "text" : "password"}
                    autoComplete="off"
                    placeholder="パスワードを入力"
                    style={{ ...inputStyle, padding: "13px 46px 13px 14px" }}
                    onFocus={(e) =>
                      (e.currentTarget.style.border =
                        "1.5px solid var(--ocean,#0a93c4)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.border = "1.5px solid #dce9ef")
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label="パスワードを表示"
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "8px",
                      transform: "translateY(-50%)",
                      width: "34px",
                      height: "34px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      color: "#7c98a6",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      {showPw ? (
                        <g
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        >
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                          <path d="M9.4 5.2A9.5 9.5 0 0112 5c5 0 9 4.5 9 7-.5 1-1.4 2.3-2.7 3.4M6.2 6.2C3.9 7.6 2.5 9.8 2 12c.7 1.5 2.3 3.7 4.8 5" />
                        </g>
                      ) : (
                        <g
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        >
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                          <circle cx={12} cy={12} r={3} />
                        </g>
                      )}
                    </svg>
                  </button>
                </div>
              </label>
            </div>
            {loginError && (
              <div
                style={{
                  marginTop: "14px",
                  background: "#fff1ee",
                  border: "1px solid #ffd6cc",
                  color: "#d2453a",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  padding: "10px 13px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#d2453a" strokeWidth="2" />
                  <path
                    d="M12 7v6M12 16.5v.5"
                    stroke="#d2453a"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                IDまたはパスワードが違います
              </div>
            )}
            <button
              type="submit"
              disabled={busy}
              style={{
                marginTop: "22px",
                width: "100%",
                fontFamily: "'Zen Maru Gothic',sans-serif",
                border: "none",
                cursor: busy ? "default" : "pointer",
                background: "var(--ocean,#0a93c4)",
                color: "#fff",
                fontWeight: 900,
                fontSize: "16px",
                padding: "15px",
                borderRadius: "999px",
                boxShadow: "0 12px 26px rgba(10,147,196,.32)",
                transition: "transform .2s ease",
                opacity: busy ? 0.7 : 1,
              }}
            >
              {busy ? "認証中…" : "ログイン"}
            </button>
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <Link
                href="/"
                style={{
                  color: "#9bb2bc",
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                ← サイトトップへ戻る
              </Link>
            </div>
          </form>
          <div
            style={{
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px dashed #e4ebef",
              textAlign: "center",
              fontSize: "11px",
              color: "#9bb2bc",
              lineHeight: 1.7,
            }}
          >
            関係者専用ページです。ID・パスワードは管理者にお問い合わせください。
          </div>
        </div>
      </div>
    </div>
  );
}
