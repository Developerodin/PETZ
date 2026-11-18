import { requireAdminSession } from "@/lib/admin-session";
import { listAllContactForExport } from "@/lib/admin-data";
import { buildWorkbook, excelResponse, formatAdminDate } from "@/lib/admin-excel";
import { jsonError } from "@/lib/api-utils";

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin) return jsonError("Unauthorized", 401);

  try {
    const rows = await listAllContactForExport();
    const buffer = await buildWorkbook([
      {
        name: "Contact",
        columns: [
          { header: "ID", key: "id", width: 28 },
          { header: "First name", key: "firstName", width: 16 },
          { header: "Last name", key: "lastName", width: 16 },
          { header: "Email", key: "email", width: 32 },
          { header: "Phone", key: "phone", width: 16 },
          { header: "City", key: "city", width: 16 },
          { header: "Subject", key: "subject", width: 28 },
          { header: "Message", key: "message", width: 48, wrap: true },
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

    return excelResponse(buffer, `petz-contact-${new Date().toISOString().slice(0, 10)}.xlsx`);
  } catch (error) {
    console.error("admin export contact failed", error);
    return jsonError("Could not export contact messages.", 503);
  }
}
