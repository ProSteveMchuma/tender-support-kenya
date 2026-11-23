import { handleLead } from "@/lib/leads.server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handleLead("quote", req);
}
