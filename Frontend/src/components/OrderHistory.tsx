import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Package, Calendar, ChevronDown, ChevronUp, CreditCard, X } from "lucide-react";

interface OrderHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── STATIC DATA — swap each object's values with API response fields ─────────
const ORDER_1 = {
  id: "TXN-20250201-001",
  date: "2025-02-01",
  plan: "Premium",
  credits: 100,
  amount: 499,
  paymentMethod: "UPI",
  account: "user@okaxis",
  status: "Success",
  invoiceId: "INV-2025-001",
  gst: "18%",
  gstAmount: 76.10,
};

const ORDER_2 = {
  id: "TXN-20250115-002",
  date: "2025-01-15",
  plan: "Standard",
  credits: 500,
  amount: 1999,
  paymentMethod: "Credit Card",
  account: "XXXX-XXXX-4242",
  status: "Success",
  invoiceId: "INV-2025-002",
  gst: "18%",
  gstAmount: 305.24,
};

const ORDER_3 = {
  id: "TXN-20241210-003",
  date: "2024-12-10",
  plan: "Premium",
  credits: 100,
  amount: 499,
  paymentMethod: "Net Banking",
  account: "HDFC Bank",
  status: "Success",
  invoiceId: "INV-2024-003",
  gst: "18%",
  gstAmount: 76.10,
};

const ORDER_4 = {
  id: "TXN-20241105-004",
  date: "2024-11-05",
  plan: "Standard",
  credits: 500,
  amount: 1999,
  paymentMethod: "UPI",
  account: "user@paytm",
  status: "Success",
  invoiceId: "INV-2024-004",
  gst: "18%",
  gstAmount: 305.24,
};
// ─────────────────────────────────────────────────────────────────────────────

const ALL_ORDERS = [ORDER_1, ORDER_2, ORDER_3, ORDER_4];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const PlanBadge = ({ plan }: { plan: string }) =>
  plan === "Premium" ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Premium
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />Standard
    </span>
  );

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-700">
    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />{status}
  </span>
);

const OrderHistory = ({ isOpen, onClose }: OrderHistoryProps) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const totalSpent = ALL_ORDERS.reduce((s, o) => s + o.amount, 0);
  const totalCredits = ALL_ORDERS.reduce((s, o) => s + o.credits, 0);
  const totalOrders = ALL_ORDERS.length;

  const toggleRow = (id: string) => setExpandedRow(expandedRow === id ? null : id);

  const renderRow = (order: typeof ORDER_1) => (
    <>
      <tr
        key={order.id}
        className="hover:bg-blue-50/40 cursor-pointer transition-colors border-b border-gray-50"
        onClick={() => toggleRow(order.id)}
      >
        <td className="px-4 py-3.5">
          <span className="font-mono text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{order.id}</span>
        </td>
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {formatDate(order.date)}
          </div>
        </td>
        <td className="px-4 py-3.5"><PlanBadge plan={order.plan} /></td>
        <td className="px-4 py-3.5">
          <span className="text-sm font-bold text-[#2C4E86]">+{order.credits}</span>
          <span className="text-[10px] text-gray-400 ml-1">cr</span>
        </td>
        <td className="px-4 py-3.5">
          <span className="text-sm font-bold text-gray-900">₹{order.amount.toLocaleString("en-IN")}</span>
        </td>
        <td className="px-4 py-3.5"><StatusBadge status={order.status} /></td>
        <td className="px-4 py-3.5 text-gray-400 text-center">
          {expandedRow === order.id ? <ChevronUp className="w-4 h-4 mx-auto" /> : <ChevronDown className="w-4 h-4 mx-auto" />}
        </td>
      </tr>
      {expandedRow === order.id && (
        <tr className="bg-blue-50/30 border-b border-blue-100">
          <td colSpan={7} className="px-6 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Payment Method</p>
                <p className="font-semibold text-gray-800">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Account / UPI</p>
                <p className="font-semibold text-gray-800">{order.account}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">GST ({order.gst})</p>
                <p className="font-semibold text-gray-800">₹{order.gstAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Invoice ID</p>
                <p className="font-semibold text-[#2C4E86]">{order.invoiceId}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[88vh] overflow-hidden flex flex-col p-0 gap-0 rounded-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#2C4E86]/10 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-[#2C4E86]" />
            </div>
            <DialogTitle className="text-lg font-bold text-gray-900 m-0 p-0">Order History</DialogTitle>
          </div>
          <p className="text-xs text-gray-400">All membership purchases</p>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-3 px-6 py-4 bg-gray-50/60 border-b border-gray-100 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Total Orders</p>
            <p className="text-2xl font-extrabold text-gray-900">{totalOrders}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Total Spent</p>
            <p className="text-2xl font-extrabold text-[#2C4E86]">₹{totalSpent.toLocaleString("en-IN")}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Credits Purchased</p>
            <p className="text-2xl font-extrabold text-green-600">+{totalCredits}</p>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Transaction ID</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Plan</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Credits</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="w-8 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {renderRow(ORDER_1)}
                {renderRow(ORDER_2)}
                {renderRow(ORDER_3)}
                {renderRow(ORDER_4)}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t border-gray-200">
                  <td colSpan={4} className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Total Paid</td>
                  <td className="px-4 py-3 font-extrabold text-gray-900 text-base">₹{totalSpent.toLocaleString("en-IN")}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-center text-[11px] text-gray-400 mt-4">
            Click any row to view payment details · All amounts include GST
          </p>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default OrderHistory;