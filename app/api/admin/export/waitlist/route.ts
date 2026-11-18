import { requireAdminSession } from "@/lib/admin-session";
import { listAllWaitlistForExport } from "@/lib/admin-data";
import { buildWorkbook, excelResponse, formatAdminDate } from "@/lib/admin-excel";
import { jsonError } from "@/lib/api-utils";

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin) return jsonError("Unauthorized", 401);

  try {
    const rows = await listAllWaitlistForExport();
    const buffer = await buildWorkbook([
      {
        name: "Waitlist",
        columns: [
          { header: "ID", key: "id", width: 28 },
          { header: "Name", key: "name", width: 24 },
          { header: "Email", key: "email", width: 32 },
          { header: "Country", key: "country", width: 14 },
          { header: "City", key: "city", width: 16 },
          { header: "Pet type", key: "petType", width: 12 },
          { header: "Plan", key: "plan", width: 16 },
          { header: "Created at", key: "createdAt", width: 22 },
          { header: "Updated at", key: "updatedAt", width: 22 },
        ],
        rows: rows.map((row) => ({
          ...row,
          createdAt: formatAdminDate(row.createdAt),
          updatedAt: formatAdminDate(row.updatedAt),
        })),
      },
    ]);

    return excelResponse(buffer, `petz-waitlist-${new Date().toISOString().slice(0, 10)}.xlsx`);
  } catch (error) {
    console.error("admin export waitlist failed", error);
    return jsonError("Could not export waitlist.", 503);
  }
}
