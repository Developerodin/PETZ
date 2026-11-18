import { requireAdminSession } from "@/lib/admin-session";
import { listAllNewsletterForExport } from "@/lib/admin-data";
import { buildWorkbook, excelResponse, formatAdminDate } from "@/lib/admin-excel";
import { jsonError } from "@/lib/api-utils";

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin) return jsonError("Unauthorized", 401);

  try {
    const rows = await listAllNewsletterForExport();
    const buffer = await buildWorkbook([
      {
        name: "Newsletter",
        columns: [
          { header: "ID", key: "id", width: 28 },
          { header: "Email", key: "email", width: 36 },
          { header: "Status", key: "status", width: 14 },
          { header: "Consented at", key: "consentedAt", width: 22 },
          { header: "Created at", key: "createdAt", width: 22 },
          { header: "Updated at", key: "updatedAt", width: 22 },
        ],
        rows: rows.map((row) => ({
          ...row,
          consentedAt: formatAdminDate(row.consentedAt),
          createdAt: formatAdminDate(row.createdAt),
          updatedAt: formatAdminDate(row.updatedAt),
        })),
      },
    ]);

    return excelResponse(buffer, `petz-newsletter-${new Date().toISOString().slice(0, 10)}.xlsx`);
  } catch (error) {
    console.error("admin export newsletter failed", error);
    return jsonError("Could not export newsletter.", 503);
  }
}
