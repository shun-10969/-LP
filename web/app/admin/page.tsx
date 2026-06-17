import { requireStaff } from "@/lib/auth";
import { loadAdminData, unreadCount } from "@/lib/admin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import type { SubmissionCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireStaff();
  const data = await loadAdminData();

  const unread: Record<SubmissionCategory, number> = {
    trial: unreadCount(data.trial, data.lastSeen.trial),
    enrollment: unreadCount(data.enrollment, data.lastSeen.enrollment),
    coach: unreadCount(data.coach, data.lastSeen.coach),
    sponsor: unreadCount(data.sponsor, data.lastSeen.sponsor),
    withdrawal: unreadCount(data.withdrawal, data.lastSeen.withdrawal),
  };

  return <AdminDashboard data={data} unread={unread} />;
}
