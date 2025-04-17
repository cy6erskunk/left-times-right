# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- No specific build/lint/test commands provided for this component
- Follow TypeScript typing and React best practices
- Test by importing the component into your React application

## Code Style Guidelines
- Use TypeScript with explicit types for all props, state and functions
- Use functional React components with hooks (useState, useRef, useEffect)
- Follow consistent naming: PascalCase for components, camelCase for variables/functions
- Import statements: group React imports first, then external libraries, then local imports
- State management: use React hooks, avoid class components
- CSS: Use provided classes in lib/styles/styles.css, maintain consistent styling
- Props typing: Use interfaces with descriptive names
- Error handling: Use guard clauses for early returns when validating input