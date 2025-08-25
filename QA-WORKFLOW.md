# QA + Performance/Security Audit Workflow

This repository includes a comprehensive automated QA workflow that runs performance, security, and quality audits on the Vite/React 19 app deployed on Firebase Hosting with Cloud Functions.

## Workflow Overview

The QA audit workflow (`qa-audit.yml`) implements 9 comprehensive audit steps:

### 0. Setup Phase
- **Clean install**: Auto-detects package manager (pnpm > npm > yarn)
- **Linting**: Runs if ESLint config is present
- **Production build**: Ensures build works and checks for server-only modules in client bundle
- **Environment**: Node 20.x

### 1. Dependency Sanity Check
- Scans `package.json` dependencies for server-only SDKs
- Checks `src/**` files for forbidden imports
- Flags: `firebase-admin`, `firebase-functions`, `stripe` server SDK, `openai`, `node-fetch`, `csv-parser`, `sharp`, etc.
- **Artifact**: `dep-sanity.json`

### 2. Vite Config & Chunking Analysis
- Verifies `@vitejs/plugin-react` or `@vitejs/plugin-react-swc` is configured
- Checks manual chunks for `react`/`firebase`/`icons`/`swiper`/`vendor`
- Analyzes bundle sizes (raw/gzip/brotli)
- Runs `source-map-explorer` on JS assets
- **Thresholds**: Initial JS >170KB gzip = FAIL, Any route >200KB gzip = FAIL
- **Artifacts**: `bundles.json`, `sme.json`, `route-payloads.json`

### 3. Serve & Network Audit
- Uses Firebase Hosting emulator if `firebase.json` hosting config exists
- Falls back to `vite preview --strictPort --port 4173`
- **Playwright tests**:
  - `/` (Home)
  - `/samsung` (Product category)
  - Product page
  - `/cos` (Cart)
  - `/cos/livrare` (Delivery) + Easybox interaction
- **Captures**: Console logs, page errors, CSP violations, network HAR
- **Fail conditions**: 404/500 for app assets, uncaught exceptions, Suspense remounts
- **Artifact**: `network-audit.json`

### 4. CSP Verification
- HEAD requests to `/index.html` and JS assets
- **Validates CSP directives**:
  - `script-src` includes `'self'`, `https://js.stripe.com`, `https://www.googletagmanager.com`, etc.
  - No `'unsafe-inline'` in `script-src`
  - `connect-src` includes Firebase endpoints, `https://api.stripe.com`
  - `frame-src` includes Stripe domains
- **Artifacts**: `csp.json`, `csp-headers.txt`

### 5. Stripe Client Flow
- Tests POST to `createCheckoutSession` Cloud Function
- Validates response format `{url, id}` and CORS headers
- Captures 4xx/5xx errors and CORS failures
- **Artifact**: `stripe-createCheckoutSession.json`

### 6. Sameday/Easybox Widget
- Interacts with widget if present
- Ensures no CSP blocks widget loading
- Verifies widget clicks don't accidentally submit forms
- Records locker payload functionality
- **Best-effort testing** via console monitoring

### 7. Accessibility & SEO (Lighthouse)
- **Mobile audits** for `/`, `/samsung`, product page, `/cos/livrare`
- **Fail thresholds**:
  - Performance < 0.90
  - LCP > 2.5s
  - CLS > 0.1
- **Artifacts**: `lighthouse-*.json`, `lighthouse-summary.json`

### 8. Images & LCP Optimization
- Verifies preload tags for hero/LCP images
- Checks `fetchpriority`/`loading` attributes
- Analyzes WebP usage ratio
- **Best-effort** via Lighthouse audits and static analysis
- **Artifact**: `image-optimization.json`

### 9. Router & State Preservation
- Scans code for React Router usage
- Checks state preservation patterns
- Analyzes lazy loading/code splitting
- **Artifact**: `router-analysis.json`

## Running the Workflow

### Manual Trigger
1. Go to **Actions** → **QA + Performance/Security Audit**
2. Click **"Run workflow"**
3. Select branch (default: `main`)
4. Click **"Run"**

### Automatic Triggers
The workflow can be extended to run on:
- `pull_request` to `main`
- `push` to `main`
- Scheduled runs (e.g., daily)

## Artifacts Generated

All audit results are saved as JSON artifacts:

| Artifact | Description |
|----------|-------------|
| `dep-sanity.json` | Dependency sanity check results |
| `vite-config.json` | Vite configuration analysis |
| `bundles.json` | Bundle size analysis with thresholds |
| `sme.json` | Source map explorer results |
| `network-audit.json` | Playwright network audit results |
| `csp.json` | CSP validation results |
| `csp-headers.txt` | Raw CSP headers |
| `stripe-createCheckoutSession.json` | Stripe flow test results |
| `sameday-widget.json` | Sameday/Easybox widget analysis |
| `lighthouse-*.json` | Individual Lighthouse reports |
| `lighthouse-summary.json` | Lighthouse summary with thresholds |
| `image-optimization.json` | Image optimization analysis |
| `router-analysis.json` | Router and state preservation analysis |
| `audit-summary.json` | **Complete audit summary** |

## Local Testing

Run local QA checks before pushing:

```bash
# Test QA components locally
node test-qa-local.cjs

# Fix asset import issues (if needed)
node fix-imports.cjs

# Build and verify
npm run build
npm run preview
```

## Thresholds & Pass/Fail Criteria

### Bundle Size Thresholds
- **Initial JS**: ≤170KB gzipped
- **Any route**: ≤200KB gzipped

### Lighthouse Thresholds
- **Performance**: ≥90%
- **LCP**: ≤2.5 seconds
- **CLS**: ≤0.1

### Security Checks
- CSP headers present and properly configured
- No server-only modules in client bundles
- No unsafe CSP directives

### Network Health
- No 404/500 errors for app assets
- No uncaught JavaScript exceptions
- No excessive Suspense remounting

## Extending the Workflow

### Adding New Checks
1. Add new step in `.github/workflows/qa-audit.yml`
2. Generate artifacts in `${{ env.AUDIT_ARTIFACTS_DIR }}/`
3. Update summary generation logic

### Custom Thresholds
Modify threshold values in the workflow file:
- Bundle sizes in step "Bundle analysis"
- Lighthouse scores in step "Lighthouse audits"
- CSP requirements in step "CSP verification"

### Environment Variables
Available workflow variables:
- `NODE_VERSION`: Node.js version (default: `20.x`)
- `AUDIT_ARTIFACTS_DIR`: Artifacts directory (default: `artifacts`)
- `USE_FIREBASE_EMULATOR`: Auto-detected based on `firebase.json`

## Troubleshooting

### Common Issues

**Build Failures**
- Check asset import case sensitivity
- Run `node fix-imports.cjs` to fix common issues
- Verify all dependencies are properly installed

**Firebase Emulator Issues**
- Ensure `firebase.json` has hosting configuration
- Check Firebase CLI is properly configured
- Workflow falls back to Vite preview if emulator fails

**Lighthouse Timeouts**
- Increase timeout in workflow if needed
- Check server startup times
- Verify all assets load properly

**CSP Validation Failures**
- Review `csp-headers.txt` artifact
- Update CSP directives in `firebase.json`
- Test CSP manually in browser

### Getting Help

1. Check workflow run logs in GitHub Actions
2. Download and review audit artifacts
3. Run local tests with `node test-qa-local.cjs`
4. Review `audit-summary.json` for comprehensive results

## Integration with CI/CD

The workflow generates a comprehensive audit summary that can be:
- Posted as PR comments
- Integrated with notification systems
- Used for deployment gates
- Archived for compliance tracking

Results include pass/fail status, detailed metrics, and actionable recommendations for optimization.