import "server-only";

/**
 * Operator details for Impressum, AGB and Datenschutz. Read from environment variables so they can be
 * set in Vercel without a code change. Unset → shown as [Platzhalter]; set to "-" → the optional line is omitted.
 */
const raw = (key: string) => process.env[key]?.trim() ?? "";
const req = (key: string, label: string) => raw(key) || `[${label}]`;
const opt = (key: string, label: string) => (raw(key) === "-" ? null : raw(key) || `[${label}]`);

export function getLegal() {
  return {
    company: req("LEGAL_COMPANY", "Firmenname bzw. Name"),
    legalForm: opt("LEGAL_FORM", "Rechtsform, z. B. UG (haftungsbeschränkt)"),
    street: req("LEGAL_STREET", "Straße Hausnummer"),
    zipCity: req("LEGAL_ZIP_CITY", "PLZ Ort"),
    country: req("LEGAL_COUNTRY", "Land"),
    representative: opt("LEGAL_REPRESENTATIVE", "Vorname Nachname, Geschäftsführung"),
    email: raw("LEGAL_EMAIL") || "support@tastysoxx.com",
    phone: opt("LEGAL_PHONE", "Telefonnummer"),
    registerCourt: opt("LEGAL_REGISTER_COURT", "Amtsgericht"),
    registerNumber: opt("LEGAL_REGISTER_NUMBER", "HRB-Nummer"),
    vatId: opt("LEGAL_VAT_ID", "USt-IdNr."),
    youthOfficer: opt("LEGAL_YOUTH_OFFICER", "Name und Kontakt der bzw. des Jugendschutzbeauftragten"),
    dpo: opt("LEGAL_DPO", "Name und Kontakt der bzw. des Datenschutzbeauftragten"),
    authority: req("LEGAL_AUTHORITY", "zuständige Datenschutz-Aufsichtsbehörde"),
    court: req("LEGAL_COURT", "Gerichtsort"),
  };
}

/** One-line operator address, e.g. for the AGB and the privacy policy. */
export function operatorLine(l: ReturnType<typeof getLegal>) {
  return `${l.company}${l.legalForm ? ` (${l.legalForm})` : ""}, ${l.street}, ${l.zipCity}, ${l.country}`;
}

/** True while any [Platzhalter] is left in the texts, so the "draft" notice stays visible. */
export const hasPlaceholders = (...texts: string[]) => texts.some((t) => /\[[^\]]+\]/.test(t));
