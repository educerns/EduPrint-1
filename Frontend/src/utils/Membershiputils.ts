// ─── Types ────────────────────────────────────────────────────────────────────
export type MembershipType = "premium" | "standard";

export interface Membership {
  type: MembershipType;
  credits: number;
  totalCredits: number;
  purchasedAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const UPLOAD_COUNT_KEY = "videoUploadCount";
const MEMBERSHIP_KEY = "userMembership";
export const FREE_UPLOAD_LIMIT = 2;

const PLAN_CREDITS: Record<MembershipType, number> = {
  premium: 100,
  standard: 500,
};

// ─── Upload count ──────────────────────────────────────────────────────────────
export const getUploadCount = (): number =>
  parseInt(localStorage.getItem(UPLOAD_COUNT_KEY) || "0", 10);

export const incrementUploadCount = (): number => {
  const next = getUploadCount() + 1;
  localStorage.setItem(UPLOAD_COUNT_KEY, String(next));
  return next;
};

// ─── Membership ────────────────────────────────────────────────────────────────
export const getMembership = (): Membership | null => {
  try {
    const raw = localStorage.getItem(MEMBERSHIP_KEY);
    return raw ? (JSON.parse(raw) as Membership) : null;
  } catch {
    return null;
  }
};

export const saveMembership = (type: MembershipType): Membership => {
  const credits = PLAN_CREDITS[type];
  const membership: Membership = {
    type,
    credits,
    totalCredits: credits,
    purchasedAt: new Date().toISOString(),
  };
  localStorage.setItem(MEMBERSHIP_KEY, JSON.stringify(membership));
  window.dispatchEvent(new Event("storage"));
  return membership;
};

export const consumeMembershipCredit = (): Membership | null => {
  const m = getMembership();
  if (!m) return null;
  const updated: Membership = { ...m, credits: Math.max(0, m.credits - 1) };
  localStorage.setItem(MEMBERSHIP_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("storage"));
  return updated;
};

export const hasActiveMembership = (): boolean => {
  const m = getMembership();
  return !!m && m.credits > 0;
};

/**
 * Check BEFORE allowing upload modal to open.
 * Returns true if user has hit free limit AND has no active membership.
 */
export const shouldBlockUpload = (): boolean => {
  if (hasActiveMembership()) return false;
  return getUploadCount() >= FREE_UPLOAD_LIMIT;
};