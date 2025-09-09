# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.2 application using TypeScript with Turbopack enabled for faster development builds. The project uses the App Router architecture and is configured with Tailwind CSS v4 for styling.

## Common Commands

```bash
# Development
npm run dev          # Start development server with Turbopack (http://localhost:3000)

# Building
npm run build        # Production build with Turbopack
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npx tsc --noEmit    # Type checking without emitting files
```

## Architecture

### Project Structure
- **App Router**: Located in `src/app/` using the Next.js 15 App Router pattern
- **Root Layout**: `src/app/layout.tsx` - Defines the HTML structure and font configuration (Geist fonts)
- **Global Styles**: `src/app/globals.css` - Contains Tailwind CSS directives and global styles
- **TypeScript Config**: Strict mode enabled with path alias `@/*` mapping to `./src/*`

### Key Technologies
- **Next.js 15.5.2**: React framework with App Router
- **React 19.1.0**: Latest React version with concurrent features
- **TypeScript**: Strict mode configuration for type safety
- **Tailwind CSS v4**: Utility-first CSS framework with PostCSS
- **Turbopack**: Rust-based bundler for faster builds (enabled via --turbopack flag)

### Development Notes
- The project uses ES2017 as the compilation target
- Module resolution is set to "bundler" for optimal Next.js compatibility
- ESLint is configured with Next.js recommended rules (core-web-vitals)
- The app uses Google Fonts (Geist and Geist Mono) loaded via next/font for optimal performance