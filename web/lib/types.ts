// Shared domain types for the ミヤタアスリートクラブ app.
// These mirror the public.* tables in supabase/migrations/0001_init.sql.

export type SubmissionCategory =
  | "trial"
  | "enrollment"
  | "coach"
  | "sponsor"
  | "withdrawal";

export type EnrollmentStatus = "pending" | "active" | "cancelled";

export interface TrialEntry {
  id: string;
  event_date: string; // YYYY-MM-DD
  gakunen: string | null;
  sei: string | null;
  mei: string | null;
  furi_sei: string | null;
  furi_mei: string | null;
  tel: string | null;
  email: string | null;
  note: string | null;
  created_at: string;
}

export interface Enrollment {
  id: string;
  plan_name: string;
  monthly_yen: number;
  first_month_yen: number;
  card_name: string | null;
  status: EnrollmentStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
}

export interface CoachApplication {
  id: string;
  name: string | null;
  age: string | null;
  experience: string | null;
  contact: string | null;
  motivation: string | null;
  created_at: string;
}

export interface SponsorInquiry {
  id: string;
  company: string | null;
  person: string | null;
  contact: string | null;
  message: string | null;
  created_at: string;
}

export interface Withdrawal {
  id: string;
  member_name: string | null;
  course: string | null;
  desired_month: string | null;
  contact: string | null;
  reason: string | null;
  created_at: string;
}

// ---- Course / plan catalogue (single source of truth) ----
export interface CoursePlan {
  key: string;
  title: string;
  grade: string;
  days: string;
  time: string;
  monthlyYen: number;
  firstMonthYen: number;
  sessions: string;
}

export const JOIN_FEE_YEN = 4400; // 入会金
export const RENEWAL_FEE_YEN = 3300; // 更新料（年1回・税込）

export const COURSE_PLANS: CoursePlan[] = [
  {
    key: "low",
    title: "低学年コース",
    grade: "小1〜3年",
    days: "月・木",
    time: "17:00〜18:00",
    monthlyYen: 6600,
    firstMonthYen: 11000,
    sessions: "週2回（月・木）/ 1回 約60分",
  },
  {
    key: "high",
    title: "高学年コース",
    grade: "小4〜6年",
    days: "水・金",
    time: "17:00〜18:00",
    monthlyYen: 6600,
    firstMonthYen: 11000,
    sessions: "週2回（水・金）/ 1回 約60分",
  },
  {
    key: "adv",
    title: "アスリート育成コース",
    grade: "中学生〜一般",
    days: "月・水・金",
    time: "18:15〜19:15",
    monthlyYen: 9900,
    firstMonthYen: 14300,
    sessions: "週2回・約60分 ／ 詳細は週間スケジュール",
  },
];

export const DAILY_TRIAL_LIMIT = Number(
  process.env.NEXT_PUBLIC_DAILY_TRIAL_LIMIT ?? 5,
);
