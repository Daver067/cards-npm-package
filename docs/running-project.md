---
outline: deep
---

# Running Project

## Overview

CardsJS is a card game library developed using Vite. This documentation will guide you through setting up and running the project locally.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Installation

1. Clone the repository:

```sh
git clone https://github.com/Daver067/cards-npm-package.git
cd cards-npm-package
```

2. Install dependencies:

```sh
npm install
```

## Development

### Running the Dev Server

Start the development server with hot-reload:

```sh
npm run dev
```

The main application will be accessible at `http://localhost:5173`. Additionally, a VitePress documentation server will run as a subprocess on port 5174, but you'll still access the documentation through the main application at port 5173.

### Building for Production

Create a production-ready build:

```sh
npm run build
```

This will generate optimized static files in the `dist` directory.

### Previewing Production Build

To preview the production build locally:

```sh
npm run preview
```

This serves the contents of the `dist` directory at `http://localhost:4173`.

For a quick build and preview in one command:

```sh
npm run build && npm run preview
```

## Project Structure

```
cards-npm-package/
├── .github/                # GitHub configuration files
├── .husky/                 # Git hooks configuration
├── dist/                   # Production build output
├── docs/                   # Documentation files
├── node_modules/           # Project dependencies
├── pages/                  # Page components
├── public/                 # Static assets
├── src/                    # Source files
│   ├── assets/             # Project assets
│   ├── components/         # Reusable Card components
│   ├── legacy/             # Legacy code
│   ├── styles/             # Stylesheets
│   ├── types/              # TypeScript type definitions
│   ├── main.ts             # Main entry point
├── tests/                  # Test files
├── .gitignore              # Git ignore configuration
├── .prettierrc.js          # Prettier configuration
├── index.html              # Main HTML file
├── commitlint.config.js    # Commit message linting configuration
├── eslint.config.js        # ESLint configuration
├── vite.config.js          # Vite configuration
├── package-lock.json       # NPM lock file
├── package.json            # Project configuration and dependencies
├── tsconfig.json           # TypeScript configuration
└── vitest.config.ts        # Vitest configuration
```

## Troubleshooting

If you encounter any issues:

1. Ensure all prerequisites are installed
2. Try removing `node_modules` and running `npm install` again
3. Check the [GitHub issues page](https://github.com/Daver067/cards-npm-package/issues)

## Contributing

Please read our [ contributing guidelines ](./contribution-guide.md) before submitting pull requests.

## License

<!--
[Add license information here] -->
