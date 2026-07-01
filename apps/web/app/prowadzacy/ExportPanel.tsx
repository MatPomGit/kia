"use client";

import type { AttemptSummary, InstructorMetric } from "@/lib/instructor-dashboard";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const downloads = [
  {
    href: `${basePath}/downloads/ndp_tests_wyniki_demo.csv`,
    label: "Pobierz wyniki i logi CSV",
    format: "CSV",
  },
  {
    href: `${basePath}/downloads/ndp_tests_wyniki_demo.pdf`,
    label: "Pobierz wyniki i logi PDF",
    format: "PDF",
  },
  {
    href: `${basePath}/downloads/ndp_tests_instrukcja_projektowa.pdf`,
    label: "Pobierz instrukcję projektu PDF",
    format: "PDF",
  },
];

type ExportPanelProps = {
  metrics?: InstructorMetric[];
  attempts?: AttemptSummary[];
  isDemo?: boolean;
};

export function ExportPanel({ metrics = [], attempts = [], isDemo = true }: ExportPanelProps) {
  return (
    <section className="card export-panel" aria-labelledby="export-heading">
      <div>
        <span className="eyebrow">Eksport danych</span>
        <h2 id="export-heading">Pliki dla prowadzącego</h2>
        <p>
          {isDemo ? "Pliki zawierają wyłącznie dane demonstracyjne." : "Eksport powinien obejmować aktualnie pobrane dane panelu."}
          {" "}Model eksportu jest zgodny z widocznymi metrykami ({metrics.length}) i podejściami ({attempts.length}); w wersji produkcyjnej pliki powinny być generowane po uwierzytelnieniu i ograniczone do kursów przypisanych prowadzącemu.
        </p>
      </div>
      <div className="export-actions">
        {downloads.map((download) => (
          <a className="btn" href={download.href} download key={download.href}>
            {download.label}
            <span className="file-format" aria-hidden="true">{download.format}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
