# Contributing to FlipCheck

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. Clone the repo and follow the [README](./README.md) setup instructions.
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes with clear, atomic commits.
4. Ensure the backend starts without errors: `uvicorn main:app --reload`
5. Ensure the frontend builds cleanly: `npm run build`
6. Open a Pull Request against `main`.

## Code Style

- **Python**: Follow PEP 8. Use type hints on all function signatures.
- **JavaScript/React**: Use functional components and hooks. No class components.
- **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).

## Reporting Issues

Open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if UI-related
