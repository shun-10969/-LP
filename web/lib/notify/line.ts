/**
 * LINE staff notification via the Messaging API push endpoint.
 *
 * Configure LINE_CHANNEL_ACCESS_TOKEN (Messaging API channel token) and
 * LINE_NOTIFY_TARGET_ID (the user/group id to push to). If either is
 * missing, notifications are skipped silently so form submission still
 * succeeds. Never throws — a notification failure must not fail a booking.
 */
export async function notifyStaffLine(text: string): Promise<void> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const to = process.env.LINE_NOTIFY_TARGET_ID;
  if (!token || !to) return;

  try {
    await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to,
        messages: [{ type: "text", text: text.slice(0, 4900) }],
      }),
    });
  } catch (err) {
    console.error("[line] push failed", err);
  }
}
