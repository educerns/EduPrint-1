import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TrendingDown, Film, Clock, Calendar, BarChart2 } from "lucide-react";

interface CreditHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── STATIC DATA — replace with API response ──────────────────────────────────
const VIDEO_1 = {
  id: "VID-001", title: "Product Launch Promo 2025", date: "2025-02-20",
  time: "10:32 AM", durationSec: 45, creditsUsed: 5, plan: "Premium", week: "Week 3", month: "Feb 2025",
};
const VIDEO_2 = {
  id: "VID-002", title: "Diwali Sale Campaign", date: "2025-02-18",
  time: "03:15 PM", durationSec: 30, creditsUsed: 3, plan: "Premium", week: "Week 3", month: "Feb 2025",
};
const VIDEO_3 = {
  id: "VID-003", title: "Brand Awareness Reel", date: "2025-02-12",
  time: "11:00 AM", durationSec: 60, creditsUsed: 7, plan: "Premium", week: "Week 2", month: "Feb 2025",
};
const VIDEO_4 = {
  id: "VID-004", title: "Social Media Ad – Jan", date: "2025-01-28",
  time: "09:45 AM", durationSec: 15, creditsUsed: 2, plan: "Standard", week: "Week 4", month: "Jan 2025",
};
const VIDEO_5 = {
  id: "VID-005", title: "New Year Greeting", date: "2025-01-01",
  time: "12:00 PM", durationSec: 20, creditsUsed: 2, plan: "Standard", week: "Week 1", month: "Jan 2025",
};
const VIDEO_6 = {
  id: "VID-006", title: "Christmas Promo", date: "2024-12-22",
  time: "04:20 PM", durationSec: 35, creditsUsed: 4, plan: "Standard", week: "Week 3", month: "Dec 2024",
};
const VIDEO_7 = {
  id: "VID-007", title: "Year-End Sale Banner", date: "2024-12-05",
  time: "02:10 PM", durationSec: 25, creditsUsed: 3, plan: "Standard", week: "Week 1", month: "Dec 2024",
};

const ALL_VIDEOS = [VIDEO_1, VIDEO_2, VIDEO_3, VIDEO_4, VIDEO_5, VIDEO_6, VIDEO_7];

// ─── Monthly aggregates (static — replace with API) ───────────────────────────
const MONTHLY_DATA = [
  { label: "Dec 2024", premium: 0, standard: 7, total: 7 },
  { label: "Jan 2025", premium: 0, standard: 4, total: 4 },
  { label: "Feb 2025", premium: 15, standard: 0, total: 15 },
];

// ─── Weekly aggregates (static — replace with API) ────────────────────────────
const WEEKLY_DATA = [
  { label: "Dec W1", premium: 0, standard: 3, total: 3 },
  { label: "Dec W3", premium: 0, standard: 4, total: 4 },
  { label: "Jan W1", premium: 0, standard: 2, total: 2 },
  { label: "Jan W4", premium: 0, standard: 2, total: 2 },
  { label: "Feb W2", premium: 7, standard: 0, total: 7 },
  { label: "Feb W3", premium: 8, standard: 0, total: 8 },
];
// ─────────────────────────────────────────────────────────────────────────────

const totalCreditsUsed = ALL_VIDEOS.reduce((s, v) => s + v.creditsUsed, 0);
const maxMonthly = Math.max(...MONTHLY_DATA.map((m) => m.total));
const maxWeekly = Math.max(...WEEKLY_DATA.map((w) => w.total));

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const PlanBadge = ({ plan }: { plan: string }) =>
  plan === "Premium" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Premium
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />Standard
    </span>
  );

// ── Stacked bar (horizontal) ──────────────────────────────────────────────────
const HBar = ({
  label, premium, standard, total, max,
}: { label: string; premium: number; standard: number; total: number; max: number }) => {
  const pct = (val: number) => `${Math.round((val / max) * 100)}%`;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-gray-500 w-16 shrink-0 text-right">{label}</span>
      <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden flex">
        {premium > 0 && (
          <div
            className="h-full bg-gradient-to-r from-[#2C4E86] to-[#3d6ab5] flex items-center justify-center transition-all duration-700"
            style={{ width: pct(premium) }}
          >
            <span className="text-white text-[10px] font-bold">{premium}</span>
          </div>
        )}
        {standard > 0 && (
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center transition-all duration-700"
            style={{ width: pct(standard) }}
          >
            <span className="text-white text-[10px] font-bold">{standard}</span>
          </div>
        )}
      </div>
      <span className="text-xs font-bold text-gray-700 w-8 shrink-0">{total}</span>
    </div>
  );
};

// ── Video table row ───────────────────────────────────────────────────────────
const VideoRow = ({ v }: { v: typeof VIDEO_1 }) => (
  <tr className="hover:bg-gray-50/70 transition-colors border-b border-gray-50">
    <td className="px-4 py-3">
      <div className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${v.plan === "Premium" ? "bg-[#2C4E86]/10" : "bg-amber-50"}`}>
          <Film className={`w-3.5 h-3.5 ${v.plan === "Premium" ? "text-[#2C4E86]" : "text-amber-500"}`} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-800 truncate max-w-[160px]">{v.title}</p>
          <p className="text-[10px] text-gray-400 font-mono">{v.id}</p>
        </div>
      </div>
    </td>
    <td className="px-4 py-3">
      <p className="text-xs text-gray-600 flex items-center gap-1">
        <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
        {formatDate(v.date)}
      </p>
      <p className="text-[10px] text-gray-400 mt-0.5 pl-4">{v.time}</p>
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-1 text-xs text-gray-600">
        <Clock className="w-3 h-3 text-gray-400" />
        {v.durationSec}s
      </div>
    </td>
    <td className="px-4 py-3"><PlanBadge plan={v.plan} /></td>
    <td className="px-4 py-3 text-right">
      <span className="text-sm font-extrabold text-rose-500">−{v.creditsUsed}</span>
    </td>
  </tr>
);

// ── Main component ────────────────────────────────────────────────────────────
const CreditHistory = ({ isOpen, onClose }: CreditHistoryProps) => {
  const [chartView, setChartView] = useState<"monthly" | "weekly">("monthly");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 rounded-2xl">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-rose-500" />
            </div>
            <DialogTitle className="text-lg font-bold text-gray-900 m-0 p-0">Credit History</DialogTitle>
          </div>
          <p className="text-xs text-gray-400">Video editing credit consumption</p>
        </div>

        {/* ── Summary strip ── */}
        <div className="grid grid-cols-4 gap-3 px-6 py-4 bg-gray-50/60 border-b border-gray-100 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Videos Edited</p>
            <p className="text-xl font-extrabold text-gray-900">{ALL_VIDEOS.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Credits Used</p>
            <p className="text-xl font-extrabold text-rose-500">−{totalCreditsUsed}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Avg per Video</p>
            <p className="text-xl font-extrabold text-gray-700">{(totalCreditsUsed / ALL_VIDEOS.length).toFixed(1)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Longest Video</p>
            <p className="text-xl font-extrabold text-[#2C4E86]">60s</p>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* ── Chart Card ── */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            {/* Chart header + toggle */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-bold text-gray-800">Credits Used Over Time</p>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setChartView("monthly")}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    chartView === "monthly"
                      ? "bg-white text-[#2C4E86] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setChartView("weekly")}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    chartView === "weekly"
                      ? "bg-white text-[#2C4E86] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 mb-4">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-sm bg-[#2C4E86] inline-block" />
                Premium plan credits
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />
                Standard plan credits
              </span>
            </div>

            {/* Monthly bars */}
            {chartView === "monthly" && (
              <div className="space-y-3">
                <HBar {...MONTHLY_DATA[0]} max={maxMonthly} />
                <HBar {...MONTHLY_DATA[1]} max={maxMonthly} />
                <HBar {...MONTHLY_DATA[2]} max={maxMonthly} />
              </div>
            )}

            {/* Weekly bars */}
            {chartView === "weekly" && (
              <div className="space-y-3">
                <HBar {...WEEKLY_DATA[0]} max={maxWeekly} />
                <HBar {...WEEKLY_DATA[1]} max={maxWeekly} />
                <HBar {...WEEKLY_DATA[2]} max={maxWeekly} />
                <HBar {...WEEKLY_DATA[3]} max={maxWeekly} />
                <HBar {...WEEKLY_DATA[4]} max={maxWeekly} />
                <HBar {...WEEKLY_DATA[5]} max={maxWeekly} />
              </div>
            )}
          </div>

          {/* ── Video Usage Table ── */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Per-Video Breakdown</p>
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Video</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Date & Time</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Length</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Plan</th>
                    <th className="text-right px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Credits</th>
                  </tr>
                </thead>
                <tbody>
                  <VideoRow v={VIDEO_1} />
                  <VideoRow v={VIDEO_2} />
                  <VideoRow v={VIDEO_3} />
                  <VideoRow v={VIDEO_4} />
                  <VideoRow v={VIDEO_5} />
                  <VideoRow v={VIDEO_6} />
                  <VideoRow v={VIDEO_7} />
                </tbody>
                <tfoot>
                  <tr className="bg-rose-50 border-t border-rose-100">
                    <td colSpan={4} className="px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wide">
                      Total Credits Consumed
                    </td>
                    <td className="px-4 py-3 text-right font-extrabold text-rose-600 text-base">
                      −{totalCreditsUsed}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <p className="text-center text-[11px] text-gray-400 pb-2">
            Credit cost per video is based on duration in seconds · Future billing will auto-calculate
          </p>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default CreditHistory;