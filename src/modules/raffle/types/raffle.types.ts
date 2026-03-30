export interface Raffle {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  drawDate: string;
  status: "draft" | "active" | "drawn" | "cancelled";
  ticketPrice: number;
  maxTicketsPerUser: number;
  prizes: RafflePrize[];
  totalTicketLimit: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface RafflePrize {
  id: string;
  name: string;
  type: "coins" | "freeSpin" | "bonus";
  amount: number;
  quantity: number;
  imageUrl: string;
}
