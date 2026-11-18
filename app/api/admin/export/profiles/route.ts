import { requireAdminSession } from "@/lib/admin-session";
import { listAllAdminProfilesForExport } from "@/lib/admin-data";
import { buildWorkbook, excelResponse, formatAdminDate } from "@/lib/admin-excel";
import { jsonError } from "@/lib/api-utils";

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin) return jsonError("Unauthorized", 401);

  try {
    const data = await listAllAdminProfilesForExport();
    const buffer = await buildWorkbook([
      {
        name: "Accounts",
        columns: [
          { header: "User ID", key: "id", width: 28 },
          { header: "Name", key: "name", width: 24 },
          { header: "Email", key: "email", width: 32 },
          { header: "Sign-in method", key: "signInMethod", width: 16 },
          { header: "Email verified", key: "emailVerified", width: 22 },
          { header: "Created at", key: "createdAt", width: 22 },
          { header: "Pet count", key: "petCount", width: 12 },
          { header: "Assessment count", key: "assessmentCount", width: 16 },
          { header: "Latest score", key: "latestScore", width: 14 },
        ],
        rows: data.accounts.map((row) => ({
          ...row,
          emailVerified: formatAdminDate(row.emailVerified),
          createdAt: formatAdminDate(row.createdAt),
          latestScore: row.latestScore ?? "",
        })),
      },
      {
        name: "Pets",
        columns: [
          { header: "Pet ID", key: "id", width: 28 },
          { header: "User ID", key: "userId", width: 28 },
          { header: "Name", key: "name", width: 20 },
          { header: "Species", key: "species", width: 12 },
          { header: "Breed", key: "breed", width: 20 },
          { header: "Gender", key: "gender", width: 12 },
          { header: "City", key: "city", width: 16 },
          { header: "Created at", key: "createdAt", width: 22 },
        ],
        rows: data.pets.map((row) => ({
          ...row,
          createdAt: formatAdminDate(row.createdAt),
        })),
      },
      {
        name: "Assessments",
        columns: [
          { header: "Assessment ID", key: "id", width: 28 },
          { header: "User ID", key: "userId", width: 28 },
          { header: "Owner email", key: "ownerEmail", width: 32 },
          { header: "Pet name", key: "petName", width: 20 },
          { header: "Species", key: "species", width: 12 },
          { header: "Score", key: "score", width: 10 },
          { header: "Created at", key: "createdAt", width: 22 },
        ],
        rows: data.assessments.map((row) => ({
          ...row,
          createdAt: formatAdminDate(row.createdAt),
        })),
      },
    ]);

    return excelResponse(buffer, `petz-profiles-${new Date().toISOString().slice(0, 10)}.xlsx`);
  } catch (error) {
    console.error("admin export profiles failed", error);
    return jsonError("Could not export profiles.", 503);
  }
}
