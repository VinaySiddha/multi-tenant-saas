import { Badge, type BadgeTone } from "@/components/ui";

const ORDER_TONES: Record<string, BadgeTone> = {
  PLACED: "info",
  CONFIRMED: "indigo",
  IN_KITCHEN: "warning",
  READY: "success",
  COMPLETED: "success",
  CANCELLED: "danger",
};

const PAYMENT_TONES: Record<string, BadgeTone> = {
  UNPAID: "danger",
  PARTIAL: "warning",
  PAID: "success",
  REFUNDED: "neutral",
};

const TABLE_TONES: Record<string, BadgeTone> = {
  AVAILABLE: "success",
  OCCUPIED: "warning",
  RESERVED: "info",
  BILLING: "danger",
  CLEANING: "neutral",
};

const KOT_TONES: Record<string, BadgeTone> = {
  PENDING: "warning",
  IN_PROGRESS: "info",
  READY: "success",
  SERVED: "neutral",
  CANCELLED: "danger",
};

const SUBSCRIPTION_TONES: Record<string, BadgeTone> = {
  ACTIVE: "success",
  TRIALING: "info",
  PAST_DUE: "warning",
  CANCELED: "danger",
};

function prettify(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function OrderStatusBadge({ status }: { status?: string | null }) {
  if (!status) return <Badge tone="neutral">Unknown</Badge>;
  return <Badge tone={ORDER_TONES[status] ?? "neutral"}>{prettify(status)}</Badge>;
}

export function PaymentStatusBadge({ status }: { status?: string | null }) {
  if (!status) return <Badge tone="neutral">—</Badge>;
  return <Badge tone={PAYMENT_TONES[status] ?? "neutral"}>{prettify(status)}</Badge>;
}

export function TableStatusBadge({ status }: { status?: string | null }) {
  if (!status) return <Badge tone="neutral">—</Badge>;
  return <Badge tone={TABLE_TONES[status] ?? "neutral"}>{prettify(status)}</Badge>;
}

export function KotStatusBadge({ status }: { status?: string | null }) {
  if (!status) return <Badge tone="neutral">—</Badge>;
  return <Badge tone={KOT_TONES[status] ?? "neutral"}>{prettify(status)}</Badge>;
}

export function SubscriptionBadge({ status }: { status?: string | null }) {
  if (!status) return <Badge tone="neutral">—</Badge>;
  return <Badge tone={SUBSCRIPTION_TONES[status] ?? "neutral"}>{prettify(status)}</Badge>;
}

export function OrderTypeLabel({ type }: { type?: string | null }) {
  if (!type) return <>—</>;
  return <>{prettify(type)}</>;
}
