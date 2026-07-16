import { Badge } from "@/components/ui/badge";
import type { BookingRequestStatus } from "@/types/database.types";

const LABELS: Record<BookingRequestStatus, string> = {
  pending: "En attente",
  accepted: "Acceptée",
  refused: "Refusée",
  countered: "Contre-proposition",
  cancelled: "Annulée",
  expired: "Expirée",
  waitlisted: "Liste d'attente",
};

const VARIANTS: Record<BookingRequestStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  accepted: "default",
  refused: "destructive",
  countered: "outline",
  cancelled: "outline",
  expired: "outline",
  waitlisted: "secondary",
};

export function BookingStatusBadge({ status }: { status: BookingRequestStatus }) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>;
}
