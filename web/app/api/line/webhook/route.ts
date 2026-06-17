import { NextResponse } from "next/server";

/**
 * LINE Messaging API webhook — setup helper.
 *
 * Its main job is to make finding LINE_NOTIFY_TARGET_ID trivial: when a staff
 * member sends any message to the bot (or adds the bot to a group), the bot
 * replies with the source id to paste into the LINE_NOTIFY_TARGET_ID env var.
 *
 * - LINE "Verify" sends a POST with an empty events array -> we return 200.
 * - Replies require LINE_CHANNEL_ACCESS_TOKEN to be configured.
 * No signature verification: this endpoint only echoes the caller's own id and
 * stores nothing.
 */
type LineSource = {
  type?: string;
  userId?: string;
  groupId?: string;
  roomId?: string;
};
type LineEvent = { replyToken?: string; source?: LineSource };

export async function POST(req: Request) {
  let body: { events?: LineEvent[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const events = body.events ?? [];

  for (const ev of events) {
    const src = ev.source ?? {};
    const id = src.groupId || src.roomId || src.userId || "(取得できませんでした)";
    const kind = src.groupId
      ? "グループ"
      : src.roomId
        ? "トークルーム"
        : "個人";
    const text =
      `✅ 通知先IDを確認しました（${kind}）。\n\n` +
      `${id}\n\n` +
      `この値を Vercel の環境変数 LINE_NOTIFY_TARGET_ID に設定して再デプロイすると、` +
      `申込・体験予約がこのトークに通知されます。`;

    if (ev.replyToken && token) {
      await fetch("https://api.line.me/v2/bot/message/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          replyToken: ev.replyToken,
          messages: [{ type: "text", text }],
        }),
      }).catch((err) => console.error("[line] reply failed", err));
    }
  }

  return NextResponse.json({ ok: true });
}

// Simple health check (LINE verifies via POST, but GET is handy for testing).
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "line-webhook" });
}
