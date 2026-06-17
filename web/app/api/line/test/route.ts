import { NextResponse } from "next/server";

/**
 * LINE notification diagnostics. Visit:
 *   /api/line/test?key=miyata-line-check
 * Reports whether the env vars are present (without leaking them) and the raw
 * LINE push API response, so we can see the exact failure (401 token, 403 not
 * friended, 400 bad target id, etc.). Sends one test message on success.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("key") !== "miyata-line-check") {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const to = process.env.LINE_NOTIFY_TARGET_ID;

  const diag = {
    hasToken: !!token,
    tokenLength: token?.length ?? 0,
    hasTarget: !!to,
    targetPrefix: to ? to.slice(0, 1) : null,
    targetLength: to?.length ?? 0,
  };

  if (!token || !to) {
    return NextResponse.json({
      ok: false,
      reason: "ENV_MISSING",
      hint: "Vercelに LINE_CHANNEL_ACCESS_TOKEN / LINE_NOTIFY_TARGET_ID を登録して再デプロイしてください。",
      diag,
    });
  }

  let status = 0;
  let lineResponse = "";
  try {
    const r = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to,
        messages: [
          { type: "text", text: "【テスト送信】この通知が届けばLINE設定は成功です ✅" },
        ],
      }),
    });
    status = r.status;
    lineResponse = await r.text();
  } catch (err) {
    return NextResponse.json({
      ok: false,
      reason: "FETCH_FAILED",
      error: String(err),
      diag,
    });
  }

  return NextResponse.json({
    ok: status === 200,
    status,
    lineResponse,
    diag,
  });
}
