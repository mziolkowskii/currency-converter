# Currency Converter

A React Native mobile app built with Expo that converts between world currencies using real-time exchange rates from the [CurrencyBeacon API](https://currencybeacon.com).

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Key Libraries](#key-libraries)
- [Code Quality](#code-quality)
- [Commit Rules](#commit-rules)
- [Testing](#testing)
- [TypeScript](#typescript)

---

## Prerequisites

| Tool           | Version | Notes                                       |
| -------------- | ------- | ------------------------------------------- |
| Node.js        | 18+     | LTS recommended                             |
| npm            | 9+      | Comes with Node                             |
| Xcode          | 15+     | iOS builds (macOS only)                     |
| Android Studio | Latest  | Android builds                              |
| Expo CLI       | Latest  | `npm install -g expo-cli`                   |
| CocoaPods      | Latest  | iOS dependencies - `brew install cocoapods` |

---

## Getting Started

```bash
# 1. Clone the repository
git clone <repo-url>
cd currency-converter

# 2. Install JS dependencies
npm install

# 3. Install iOS native dependencies
cd ios && pod install && cd ..

# 4. Copy the environment file and fill in your values
cp .env.example .env
```

> **Note:** The `.env` file is **not** committed. See [Environment Variables](#environment-variables) for the required keys.

---

## Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_API_KEY=your_currencybeacon_api_key
EXPO_PUBLIC_API_URL=https://api.currencybeacon.com/v1
```

All variables prefixed with `EXPO_PUBLIC_` are inlined at build time by Expo and are safe to use in client code. They are validated at app startup via `validateEnvs()` - the app will throw early rather than fail silently at runtime.

Get a free API key at [currencybeacon.com](https://currencybeacon.com).

---

## Running the App

### Development build (recommended)

A dev client build gives you access to native modules and matches production behaviour more closely than Expo Go.

```bash
# iOS simulator
npm run ios

# Android emulator
npm run android
```

### Expo Go (quick preview - limited native features)

```bash
npm start
# then scan the QR code with Expo Go
```

### Useful scripts

```bash
npm run type-check        # TypeScript check with no emit
npm run lint              # ESLint across the project
npm run lint:fix          # Auto-fix ESLint issues
npm run lint:check        # Lint with zero-warning tolerance (used in CI)
npm run prettier          # Format all files with Prettier
npm run prettier:check    # Check formatting without writing
npm run format            # Prettier + ESLint fix in one pass
npm run test              # Run Jest tests once
npm run test:watch        # Jest in interactive watch mode
npm run test:coverage     # Jest with coverage report
```

---

## Project Structure

```
currency-converter/
├── assets/                     # Static assets (fonts, images)
├── src/
│   ├── app/                    # Expo Router file-based routing
│   │   ├── _layout.tsx         # Root layout - providers, error boundary
│   │   └── index.tsx           # Entry screen
│   ├── components/             # Shared UI components
│   │   ├── errors/             # Error boundary, error screens/views
│   │   ├── features/home/      # Home feature components
│   │   ├── form/               # Form primitives (TextInput, FormField)
│   │   └── typography/         # Text component with theme variants
│   ├── constants/              # App-wide constants
│   ├── context/                # React contexts (SetupContext)
│   ├── hooks/
│   │   ├── api/converter/      # TanStack Query hooks (useGetCurrencies, useConvert)
│   │   └── *.ts                # Shared hooks (useDebounce, useKeyboard, useBottomOffset)
│   ├── i18n/                   # i18next translations (en/)
│   ├── screens/                # Screen components
│   ├── services/api/           # Axios instance + API types
│   ├── styles/                 # Global theme (colors, typography, buttons)
│   └── utils/                  # Pure utilities (env validation, timestamps, etc.)
├── app.config.ts               # Expo app config
├── eslint.config.mjs           # ESLint flat config
├── tsconfig.json               # TypeScript config with path aliases
└── .husky/pre-commit           # Git hook - lint-staged + type-check + tests
```

### Path aliases

TypeScript paths are configured in `tsconfig.json` to avoid deep relative imports:

| Alias           | Maps to            |
| --------------- | ------------------ |
| `@components/*` | `src/components/*` |
| `@hooks/*`      | `src/hooks/*`      |
| `@services/*`   | `src/services/*`   |
| `@styles/*`     | `src/styles/*`     |
| `@utils/*`      | `src/utils/*`      |
| `@i18n/*`       | `src/i18n/*`       |
| `@screens/*`    | `src/screens/*`    |
| `@context/*`    | `src/context/*`    |
| `@assets/*`     | `src/assets/*`     |
| `@appAssets/*`  | `assets/*`         |

---

## Key Libraries

### Expo SDK `~55`

The foundation of the project. Provides the managed/bare workflow, OTA updates, and a unified API surface for native capabilities. Using the bare workflow (native `ios/` and `android/` folders are present) to allow full native module access while keeping Expo tooling.

### Expo Router `~55`

File-based routing for React Native - same mental model as Next.js App Router. Chosen over bare React Navigation for automatic deep linking, typed routes (`experiments.typedRoutes`), and co-location of screens with their route segments.

### React Native `0.83` / React `19`

Latest stable versions. React 19 brings the new `use()` hook (used in `SetupContext`) and concurrent features.

### `@tanstack/react-query` `~5`

Server state management for all API calls. Provides caching, background refetch, loading/error states, and deduplication out of the box. API hooks live in `src/hooks/api/` and wrap `useQuery` - keeping components clean and data-fetching concerns separate.

### `axios` `~1.15`

HTTP client for the CurrencyBeacon API. Used over `fetch` for its interceptor system - the request interceptor injects the API key on every GET, and the response error interceptor normalises network vs. HTTP errors before they reach query hooks.

### `@shopify/flash-list` `2.0`

High-performance list component replacing `FlatList`. FlashList recycles cells natively (inspired by `RecyclerView`) and achieves significantly higher frame rates for long lists. Used in the currency picker bottom sheet where all 150+ currencies are rendered.

### `@gorhom/bottom-sheet` `~5`

Performant bottom sheet and bottom sheet modal backed by Reanimated and Gesture Handler. Runs animations on the UI thread, keeping the JS thread free. The currency picker uses `BottomSheetModal` with `FlashList` scrollable integration.

### `react-native-reanimated` `4`

Runs JavaScript animations on the UI thread via Worklets, eliminating bridge overhead for gesture-driven and layout animations. Required peer dependency for `@gorhom/bottom-sheet`.

### `react-native-gesture-handler` `~2.30`

Native touch handling for smooth swipe/drag interactions. Required by both `@gorhom/bottom-sheet` and `@shopify/flash-list`.

### `react-hook-form` `~7` + `zod` `~4` + `@hookform/resolvers`

Form state management with schema validation. `react-hook-form` minimises re-renders via uncontrolled inputs; `zod` provides end-to-end type-safe schemas (schema inferred directly to `FormValues` type). Validation runs in `onChange` mode for immediate feedback.

### `i18next` + `react-i18next` + `@os-team/i18next-react-native-language-detector`

Internationalisation stack. The language detector automatically reads the device locale so the app speaks the user's language without manual configuration. Translation keys are typed via `i18next.d.ts` declarations.

### `react-native-keyboard-controller`

Provides `KeyboardProvider` and keyboard-aware hooks that work consistently across iOS and Android. Used instead of `KeyboardAvoidingView` for more predictable layout shifts when the soft keyboard appears.

### `expo-linear-gradient` + `expo-blur`

Native gradient and blur effects. Used for UI polish (backgrounds, overlays) without custom native code.

### `react-native-safe-area-context` `~5`

Provides insets for notches, home indicators, and dynamic islands. The `useBottomOffset` hook reads the bottom inset to pad list content above the home indicator.

---

## Code Quality

### ESLint

Flat config (`eslint.config.mjs`) with the following plugins:

| Plugin                       | Purpose                                                                            |
| ---------------------------- | ---------------------------------------------------------------------------------- |
| `@typescript-eslint`         | TypeScript-aware rules - `no-explicit-any` as warning, strict unused-var detection |
| `eslint-plugin-react`        | React best practices - `react-in-jsx-scope` off (React 17+ transform)              |
| `eslint-plugin-react-hooks`  | Exhaustive deps, rules of hooks - both set to `error`                              |
| `eslint-plugin-react-native` | No inline styles, no unused StyleSheet styles                                      |
| `eslint-plugin-import`       | Import ordering enforcement, circular dependency detection                         |

**Notable rules:**

- `no-console` - only `console.warn` and `console.error` are allowed; use them for dev-only warnings guarded by `isDevelopment`.
- `no-restricted-imports` - `Text`, `Button`, `TextInput` from `react-native` are banned; import the themed versions from `@components` instead.
- `import/order` - enforces `external → builtin → internal → parent → sibling → index` ordering.
- `prefer-const` and `no-var` - enforced at error level.
- `semi` - required (matches Prettier config).

Test files (`*.test.ts/tsx`, `**/__mocks__/**`) have relaxed rules - `require` imports and `no-restricted-imports` are off.

### Prettier

Config in `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 120,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

Run `npm run format` to apply both Prettier and ESLint auto-fixes in one pass.

---

## Commit Rules

Commits are gated by a three-stage Husky `pre-commit` hook:

```
Stage 1 - lint-staged   Fast: formats and lints only staged files
Stage 2 - type-check    Runs tsc --noEmit across the whole project
Stage 3 - jest          Runs only tests related to staged files (--findRelatedTests)
```

`lint-staged` configuration (in `package.json`):

```json
"lint-staged": {
  "*.{ts,tsx,js,jsx}": ["prettier --write", "eslint --max-warnings 0"],
  "*.{json,md,css,yml,yaml}": ["prettier --write"]
}
```

**Rules:**

- A commit is rejected if any lint warning exists (`--max-warnings 0`).
- A commit is rejected if TypeScript reports any type errors.
- A commit is rejected if any test related to a staged file fails.
- All staged files are auto-formatted by Prettier before the lint check.

To bypass the hook in exceptional cases (not recommended):

```bash
git commit --no-verify -m "your message"
```

---

## Testing

Tests use **Jest** with the `jest-expo` preset and **Testing Library** (`@testing-library/react-native`).

```bash
npm run test              # single run
npm run test:watch        # watch mode
npm run test:coverage     # coverage report
```

Test files live next to the code they test, inside `__tests__/` subdirectories:

```
src/components/__tests__/Button.test.tsx
src/components/features/home/__tests__/CurrencyConverter.test.tsx
src/hooks/__tests__/useBottomOffset.test.ts
```

---

## TypeScript

Strict mode is enabled with additional compiler checks:

```json
"strict": true,
"noImplicitAny": true,
"noImplicitThis": true,
"noUnusedLocals": true,
"noUnusedParameters": true,
"noImplicitReturns": true,
"noFallthroughCasesInSwitch": true
```

Run `npm run type-check` to validate types without emitting output. This is also run automatically on every commit.
