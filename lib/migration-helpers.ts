/**
 * Migration Helper Functions for Bubble.io → PostgreSQL Migration
 */

// Parse CSV boolean values
export function parseBoolean(value: string | undefined): boolean | null {
  if (!value || value.trim() === '') return null;
  const lower = value.toLowerCase().trim();
  return lower === 'yes' || lower === 'true' || lower === '1';
}

// Parse CSV date strings
// Bubble exports dates in format: "Jul 22, 2020 1:40 pm"
export function parseDate(dateString: string | undefined): Date {
  if (!dateString || dateString.trim() === '') return new Date();
  try {
    const parsed = new Date(dateString);
    if (isNaN(parsed.getTime())) {
      console.warn(`Failed to parse date: ${dateString}, using current date`);
      return new Date();
    }
    return parsed;
  } catch (error) {
    console.warn(`Error parsing date: ${dateString}, using current date`);
    return new Date();
  }
}

// Parse comma-separated tags to array
export function parseTags(tagsString: string | undefined): string[] | null {
  if (!tagsString || tagsString.trim() === '') return null;
  return tagsString
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

// Parse comma-separated partnership types to array
export function parseArray(arrayString: string | undefined): string[] | null {
  if (!arrayString || arrayString.trim() === '') return null;
  return arrayString
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

// Parse integer values
export function parseInt(value: string | undefined): number | null {
  if (!value || value.trim() === '') return null;
  const parsed = Number.parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

// Parse float values (for percentages)
export function parseFloat(value: string | undefined): number | null {
  if (!value || value.trim() === '') return null;
  const parsed = Number.parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

// Clean string values (trim and handle empty)
export function cleanString(value: string | undefined): string | null {
  if (!value || value.trim() === '') return null;
  return value.trim();
}

// Log migration progress
export function logProgress(stage: string, processed: number, total: number) {
  const percentage = ((processed / total) * 100).toFixed(1);
  console.log(`[${stage}] Progress: ${processed}/${total} (${percentage}%)`);
}

// Log migration results
export interface MigrationResult {
  total: number;
  succeeded: number;
  failed: number;
  skipped: number;
  errors: Array<{ record: any; error: string }>;
}

export function logMigrationResult(stage: string, result: MigrationResult) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Migration Stage: ${stage}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Total Records:    ${result.total}`);
  console.log(`Succeeded:        ${result.succeeded} ✓`);
  console.log(`Failed:           ${result.failed} ✗`);
  console.log(`Skipped:          ${result.skipped} ⊝`);
  console.log(`${'='.repeat(60)}\n`);

  if (result.errors.length > 0) {
    console.log(`Errors encountered:`);
    result.errors.forEach((err, idx) => {
      console.log(`  ${idx + 1}. ${err.error}`);
      console.log(`     Record:`, JSON.stringify(err.record, null, 2));
    });
    console.log();
  }
}
