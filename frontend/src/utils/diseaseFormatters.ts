/**
 * Utilities for formatting agricultural disease treatment prescriptions
 * Removes '@' symbols, cleans measurement units, and parses compound prescriptions into structured elements.
 */

export interface PrescriptionItem {
  id: string;
  type: 'option' | 'curative' | 'preventive' | 'general';
  label?: string;
  remedy: string;
  dosage?: string;
}

/**
 * Strips all '@' characters and formats dosages cleanly with standardized spacing.
 */
export const cleanSuggestionText = (text?: string): string => {
  if (!text) return '';

  return text
    // Replace '@ 2g/L' or '@2g/L' with 'at 2 g/L'
    .replace(/@\s*/g, 'at ')
    // Ensure spaces before measurement units: '2g/L' -> '2 g/L', '1ml/L' -> '1 ml/L'
    .replace(/(\d+(?:\.\d+)?)\s*(g|ml|kg|l)\s*\/\s*(L|ha|acre)/gi, '$1 $2/$3')
    // Clean up unspaced unit parentheses: '(5g/L)' -> '(5 g/L)'
    .replace(/\((\d+(?:\.\d+)?)\s*(g|ml|kg|l)\s*\/\s*(L|ha|acre)\)/gi, '($1 $2/$3)')
    // Remove unwanted special characters
    .replace(/[~^`]/g, '')
    // Clean up double spaces
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Parses compound prescriptions (separated by 'or', ';', or 'curative:') into structured items.
 */
export const parsePrescriptionItems = (text?: string): PrescriptionItem[] => {
  const cleaned = cleanSuggestionText(text);
  if (!cleaned) return [];

  const items: PrescriptionItem[] = [];

  // Split on semicolons or distinct sentence boundaries first
  const segments = cleaned.split(/;\s*/).filter(Boolean);

  segments.forEach((seg, sIdx) => {
    // Check if segment is curative specific
    const isCurative = /curative\s*:/i.test(seg);
    const cleanSeg = seg.replace(/curative\s*:/i, '').trim();

    // Check if segment has 'or' alternatives
    const alternatives = cleanSeg.split(/\s+or\s+/i).filter(Boolean);

    alternatives.forEach((alt, aIdx) => {
      // Extract dosage pattern (e.g. "at 2.5 g/L" or "(5 g/L)")
      const doseMatch = alt.match(/(?:at\s+|\()([0-9.]+\s*(?:g|ml|kg|l)\s*\/\s*(?:L|ha|acre|\w+))\)?/i);
      const dose = doseMatch ? doseMatch[1] : undefined;

      // Extract remedy name by removing introductory verbs like "Spray", "Foliar spray of", etc.
      let remedyName = alt
        .replace(/^(?:Spray|Foliar spray of|Foliar spray with|Immediate application:|Immediate curative spray:|Apply)\s*/i, '')
        .replace(/(?:at\s+|\()?[0-9.]+\s*(?:g|ml|kg|l)\s*\/\s*(?:L|ha|acre|\w+)\)?/i, '')
        .replace(/(?:upon symptom onset|before rain spells|prior to rain\/fog spells|at tasseling)\.?/i, '')
        .trim();

      if (!remedyName) remedyName = alt;

      let type: PrescriptionItem['type'] = 'general';
      let label: string | undefined;

      if (isCurative) {
        type = 'curative';
        label = 'Curative Formulation';
      } else if (alternatives.length > 1) {
        type = 'option';
        label = `Option ${aIdx + 1}`;
      } else {
        label = 'Recommended Treatment';
      }

      items.push({
        id: `rx-${sIdx}-${aIdx}`,
        type,
        label,
        remedy: remedyName.replace(/^[\s,;]+|[\s,;.]+$/g, ''),
        dosage: dose
      });
    });
  });

  return items;
};
