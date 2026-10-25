import { createContactHandler } from "@/lib/contact-server";

export const runtime = "nodejs";
export const POST = createContactHandler();
