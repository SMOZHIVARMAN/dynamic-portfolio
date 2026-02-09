import { useState, useEffect } from "react";

const SHEET_ID = "1m1LrPS0et3ZIo3EO1lbV7lKqDRNSOEyuULYkmsgLSKE";

interface SheetResponse {
  table: {
    cols: Array<{ label: string }>;
    rows: Array<{ c: Array<{ v: string | number | null } | null> }>;
  };
}

function parseGvizResponse(text: string): SheetResponse | null {
  try {
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);?\s*$/);
    if (match) {
      return JSON.parse(match[1]);
    }
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// For transposed sheets (keys in col A, values in cols B, C, D...)
function parseTransposed(response: SheetResponse): Record<string, string>[] {
  const { rows } = response.table;
  if (!rows?.length) return [];

  const fieldRows: Array<{ key: string; values: string[] }> = [];

  for (const row of rows) {
    const cells = row.c || [];
    const key = String(cells[0]?.v || "").replace(/[\s\n\r]+/g, " ").trim();
    if (!key) continue;
    const values = cells.slice(1).map((c) => String(c?.v ?? "").trim());
    fieldRows.push({ key, values });
  }

  if (!fieldRows.length) return [];

  const maxCols = Math.max(...fieldRows.map((r) => r.values.length));
  const items: Record<string, string>[] = [];

  for (let i = 0; i < maxCols; i++) {
    const item: Record<string, string> = {};
    let hasValue = false;
    for (const field of fieldRows) {
      const val = field.values[i] || "";
      if (val) hasValue = true;
      item[field.key] = val;
    }
    if (hasValue) items.push(item);
  }

  return items;
}

// For standard tabular sheets (headers in row 1)
function parseTabular(response: SheetResponse): Record<string, string>[] {
  const { cols, rows } = response.table;
  if (!cols?.length || !rows?.length) return [];

  const headers = cols.map((c) => (c.label || "").replace(/[\s\n\r]+/g, " ").trim());
  return rows
    .map((row) => {
      const item: Record<string, string> = {};
      (row.c || []).forEach((cell, i) => {
        if (headers[i]) {
          item[headers[i]] = String(cell?.v ?? "").trim();
        }
      });
      return item;
    })
    .filter((item) => {
      // Filter out rows where all values (except ID fields) are empty
      return Object.entries(item).some(
        ([key, val]) => val && !key.endsWith("_id") && val !== "null"
      );
    });
}

async function fetchSheet(sheetName: string): Promise<Record<string, string>[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url);
  const text = await res.text();
  const response = parseGvizResponse(text);
  if (!response?.table) return [];

  const { cols, rows } = response.table;
  if (!rows?.length) return [];

  // Check if cols have meaningful header labels
  const hasHeaders = cols.some((c) => {
    const label = (c.label || "").replace(/[\s\n\r]+/g, " ").trim();
    return label && label.includes("_");
  });

  if (hasHeaders) {
    return parseTabular(response);
  }

  // Check if first ROW contains header-like values across ALL columns
  // (e.g., Profile sheet: row1 = [profile_image, profile_roles, info_description, info_logos])
  const firstRowCells = rows[0]?.c || [];
  const firstRowValues = firstRowCells.map((c) => String(c?.v || "").trim()).filter(Boolean);
  const headerLikeCount = firstRowValues.filter(
    (v) => v.includes("_") && !v.startsWith("http")
  ).length;

  // If most first-row values look like field names, treat row 1 as headers
  if (firstRowValues.length > 0 && headerLikeCount / firstRowValues.length >= 0.5) {
    // Parse as tabular using first row as headers
    const headers = firstRowCells.map((c) =>
      String(c?.v || "").replace(/[\s\n\r]+/g, " ").trim()
    );
    const dataRows = rows.slice(1);
    return dataRows
      .map((row) => {
        const item: Record<string, string> = {};
        (row.c || []).forEach((cell, i) => {
          if (headers[i]) {
            item[headers[i]] = String(cell?.v ?? "").replace(/^\u0022|\u0022$/g, "").trim();
          }
        });
        return item;
      })
      .filter((item) =>
        Object.entries(item).some(
          ([key, val]) => val && !key.endsWith("_id") && val !== "null"
        )
      );
  }

  // Fallback: check if first column values look like field names (transposed layout)
  const firstColValues = rows
    .map((r) => String(r.c?.[0]?.v || ""))
    .filter(Boolean);
  const looksTransposed = firstColValues.some(
    (v) => v.includes("_") && !v.startsWith("http")
  );

  if (looksTransposed) {
    return parseTransposed(response);
  }

  // Default: try tabular
  return parseTabular(response);
}

export function useSheetData(sheetName: string) {
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchSheet(sheetName)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [sheetName]);

  return { data, loading, error };
}

// Profile sheet returns a single object
export function useProfileData() {
  const { data, loading, error } = useSheetData("Profile");
  const profile = data[0] || null;
  return { profile, loading, error };
}
