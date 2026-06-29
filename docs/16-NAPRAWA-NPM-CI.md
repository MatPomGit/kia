# Naprawa błędu `npm ci: Exit handler never called`

## Przyczyna

W repozytorium występowały dwa czynniki ryzyka:

1. `package-lock.json` zawierał adresy pakietów prowadzące do wewnętrznego rejestru niedostępnego dla runnerów GitHub Actions.
2. Workflow uruchamiał instalację na Node.js 24 z domyślną wersją npm, co utrudniało powtarzalność środowiska.

## Zastosowana konfiguracja

- Node.js: `22`
- npm: `10.9.2`
- rejestr: `https://registry.npmjs.org/`
- instalacja: `npm ci --no-audit --no-fund`
- audyt bezpieczeństwa wykonywany w osobnym kroku

## Wymagany fragment workflow

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v6
  with:
    node-version: 22
    cache: npm
    cache-dependency-path: package-lock.json

- name: Pin npm version
  run: npm install --global npm@10.9.2

- name: Configure npm registry
  run: npm config set registry https://registry.npmjs.org/

- name: Install dependencies
  run: npm ci --no-audit --no-fund

- name: Security audit
  run: npm audit --audit-level=moderate
```

## Kontrola lokalna

```bash
rm -rf node_modules apps/*/node_modules
npm ci --no-audit --no-fund
npm audit --audit-level=moderate
npm run build:pages
```

## Kryterium zakończenia

Naprawa jest poprawna, gdy:

- `npm ci` kończy się kodem `0`,
- audyt zwraca `0 vulnerabilities`,
- katalog `apps/web/out` zostaje utworzony,
- workflow przechodzi do kroku przesyłania artefaktu Pages.
