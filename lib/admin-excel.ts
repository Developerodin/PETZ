import ExcelJS from "exceljs";

const HEADER_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFFF8139" },
};

const HEADER_FONT: Partial<ExcelJS.Font> = {
  bold: true,
  color: { argb: "FFFFFFFF" },
  name: "Calibri",
  size: 11,
};

const BODY_FONT: Partial<ExcelJS.Font> = {
  name: "Calibri",
  size: 11,
};

export type SheetColumn = {
  header: string;
  key: string;
  width: number;
  wrap?: boolean;
};

export async function buildWorkbook(
  sheets: Array<{
    name: string;
    columns: SheetColumn[];
    rows: Array<Record<string, string | number | null | undefined>>;
  }>,
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "PETZ Admin";
  workbook.created = new Date();

  for (const sheet of sheets) {
    const ws = workbook.addWorksheet(sheet.name, {
      views: [{ state: "frozen", ySplit: 1 }],
    });

    ws.columns = sheet.columns.map((col) => ({
      header: col.header,
      key: col.key,
      width: col.width,
    }));

    const headerRow = ws.getRow(1);
    headerRow.height = 22;
    headerRow.eachCell((cell) => {
      cell.fill = HEADER_FILL;
      cell.font = HEADER_FONT;
      cell.alignment = { vertical: "middle", horizontal: "left" };
    });

    for (const row of sheet.rows) {
      const values: Record<string, string | number> = {};
      for (const col of sheet.columns) {
        const raw = row[col.key];
        values[col.key] = raw == null ? "" : raw;
      }
      const excelRow = ws.addRow(values);
      excelRow.font = BODY_FONT;
      excelRow.alignment = { vertical: "top", wrapText: false };
      sheet.columns.forEach((col, index) => {
        if (col.wrap) {
          excelRow.getCell(index + 1).alignment = { vertical: "top", wrapText: true };
        }
      });
    }

    ws.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: sheet.columns.length },
    };
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export function excelResponse(buffer: Buffer, filename: string) {
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

export function formatAdminDate(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().replace("T", " ").slice(0, 19);
}
