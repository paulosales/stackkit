import type { Worksheet, SavedWorksheetMeta } from '../types';
import { ORIGINAL_WORKSHEET_TEMPLATE } from '../constants/defaultTemplates';

const CURRENT_WORKSHEET_KEY = 'calligraphy_current_worksheet_v1';
const SAVED_WORKSHEETS_INDEX_KEY = 'calligraphy_saved_index_v1';
const WORKSHEET_PREFIX = 'calligraphy_sheet_v1_';

/**
 * Validate that an object has the essential Worksheet structure
 */
function isValidWorksheet(obj: unknown): obj is Worksheet {
  if (!obj || typeof obj !== 'object') return false;
  const w = obj as Partial<Worksheet>;
  return (
    typeof w.id === 'string' &&
    typeof w.title === 'string' &&
    Array.isArray(w.pages) &&
    typeof w.guidelines === 'object' &&
    typeof w.typography === 'object' &&
    typeof w.layout === 'object'
  );
}

/**
 * Load the active worksheet draft, or fall back to the original template
 */
export function loadCurrentWorksheet(): Worksheet {
  try {
    const raw = localStorage.getItem(CURRENT_WORKSHEET_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidWorksheet(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load active worksheet from localStorage, using template fallback.', err);
  }
  return { ...ORIGINAL_WORKSHEET_TEMPLATE, id: 'sheet_' + Date.now() };
}

/**
 * Persist the current draft
 */
export function saveCurrentWorksheet(worksheet: Worksheet): void {
  try {
    localStorage.setItem(CURRENT_WORKSHEET_KEY, JSON.stringify(worksheet));
  } catch (err) {
    console.error('Failed to save current worksheet to localStorage', err);
  }
}

/**
 * Get the list of all user-saved worksheets
 */
export function getSavedWorksheetsList(): SavedWorksheetMeta[] {
  try {
    const raw = localStorage.getItem(SAVED_WORKSHEETS_INDEX_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (Array.isArray(list)) {
      return list.filter(item => item && typeof item.id === 'string' && typeof item.title === 'string');
    }
  } catch (err) {
    console.error('Failed to get saved worksheets index', err);
  }
  return [];
}

/**
 * Load a specific saved worksheet by id
 */
export function getSavedWorksheetById(id: string): Worksheet | null {
  try {
    const raw = localStorage.getItem(WORKSHEET_PREFIX + id);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (isValidWorksheet(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.error(`Failed to get saved worksheet ${id}`, err);
  }
  return null;
}

/**
 * Save a worksheet into user's saved library
 */
export function saveWorksheetToLibrary(worksheet: Worksheet): void {
  try {
    const updatedSheet: Worksheet = {
      ...worksheet,
      updatedAt: Date.now(),
    };
    
    // 1. Save full data
    localStorage.setItem(WORKSHEET_PREFIX + updatedSheet.id, JSON.stringify(updatedSheet));

    // 2. Update index
    const index = getSavedWorksheetsList();
    const existingIndex = index.findIndex(i => i.id === updatedSheet.id);
    
    // Extract a brief preview snippet
    let preview = '';
    const firstRowWithText = updatedSheet.pages[0]?.sections[0]?.rows.find(r => r.text && r.text.trim().length > 0);
    if (firstRowWithText) {
      preview = firstRowWithText.text.substring(0, 40);
    } else {
      preview = 'Practice rows and blank lines';
    }

    const meta: SavedWorksheetMeta = {
      id: updatedSheet.id,
      title: updatedSheet.title || 'Untitled Sheet',
      updatedAt: updatedSheet.updatedAt,
      pageCount: updatedSheet.pages.length,
      previewSnippet: preview,
    };

    if (existingIndex >= 0) {
      index[existingIndex] = meta;
    } else {
      index.unshift(meta);
    }

    localStorage.setItem(SAVED_WORKSHEETS_INDEX_KEY, JSON.stringify(index));
    // Also update current
    saveCurrentWorksheet(updatedSheet);
  } catch (err) {
    console.error('Failed to save worksheet to library', err);
  }
}

/**
 * Delete a saved worksheet from the library
 */
export function deleteSavedWorksheet(id: string): void {
  try {
    localStorage.removeItem(WORKSHEET_PREFIX + id);
    const index = getSavedWorksheetsList().filter(item => item.id !== id);
    localStorage.setItem(SAVED_WORKSHEETS_INDEX_KEY, JSON.stringify(index));
  } catch (err) {
    console.error(`Failed to delete saved worksheet ${id}`, err);
  }
}

/**
 * Export worksheet as JSON file download
 */
export function exportWorksheetToJson(worksheet: Worksheet): void {
  try {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(worksheet, null, 2));
    const safeTitle = (worksheet.title || 'worksheet').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const filename = `${safeTitle}_calligraphy_sheet.json`;
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (err) {
    console.error('Failed to export worksheet JSON', err);
  }
}

/**
 * Import and validate worksheet from JSON string
 */
export function importWorksheetFromJson(jsonString: string): Worksheet | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (isValidWorksheet(parsed)) {
      return {
        ...parsed,
        id: 'imported_' + Date.now(),
        updatedAt: Date.now(),
      };
    }
  } catch (err) {
    console.error('Invalid JSON structure for worksheet import', err);
  }
  return null;
}
