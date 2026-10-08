# Workspace 🚀

A modern **pnpm monorepo workspace** built with TypeScript and designed to manage multiple packages, libraries, and artifacts in a single repository.
<img width="453" height="261" alt="chatbot " src="https://github.com/user-attachments/assets/f0864f75-373e-4961-9b3a-2bfee1ded22f" />

 
## ✨ Features

- 📦 pnpm workspace / monorepo
- 🔷 TypeScript support
- 🎨 Prettier for code formatting
- 🔌 Replit Connectors SDK
- 🏗️ Workspace-wide build system
- ✅ TypeScript type checking
- 📁 Support for multiple libraries and artifacts
- 🔒 MIT License

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| pnpm | Package manager & workspace management |
| TypeScript | Type-safe development |
| Prettier | Code formatting |
| Replit Connectors SDK | Connector integrations |

## 📋 Requirements

Make sure you have the following installed:

- Node.js 18+
- pnpm
- Git

Check your versions:

```bash
node --version
pnpm --version
git --version
```

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

Enter the project directory:

```bash
cd YOUR-REPOSITORY
```

Install dependencies using **pnpm**:

```bash
pnpm install
```

> ⚠️ This project requires pnpm. `npm install` and `yarn install` are intentionally blocked by the project's `preinstall` script.

## 🚀 Development

After installing the dependencies, you can work on the individual packages inside the workspace.

Typical workspace structure:

```text
workspace/
├── artifacts/
│   ├── package-1/
│   ├── package-2/
│   └── ...
├── libs/
│   ├── library-1/
│   └── ...
├── scripts/
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
└── README.md
```

> The exact folders may vary depending on the packages included in your repository.

## 🏗️ Build

Build and type-check the complete workspace:

```bash
pnpm run build
```

This command:

1. Runs the TypeScript type checker.
2. Builds available workspace packages.

## 🔍 Type Checking

Run type checking for libraries:

```bash
pnpm run typecheck:libs
```

Run type checking across the workspace:

```bash
pnpm run typecheck
```

The workspace typecheck includes applicable packages under:

```text
artifacts/**
scripts
```

## 🎨 Code Formatting

This project uses **Prettier** for consistent code formatting.

Run Prettier with:

```bash
pnpm prettier .
```

You can also format specific files:

```bash
pnpm prettier --write src/
```

## 📦 Workspace Commands

Because this is a pnpm workspace, commands can be executed across packages.

Run a command recursively:

```bash
pnpm -r run build
```

Run a command only when available:

```bash
pnpm -r --if-present run build
```

## 🔌 Replit Connectors SDK

This project includes:

```text
@replit/connectors-sdk
```

The SDK can be used to integrate supported Replit connectors into applications within the workspace.

## 🔐 Package Manager Security

The repository intentionally removes existing lock files during installation and verifies that the package manager is **pnpm**.

If you see:

```text
Use pnpm instead
```

make sure you are using:

```bash
pnpm install
```

instead of:

```bash
npm install
```

or:

```bash
yarn install
```

## 📜 Available Scripts

| Command | Description |
|---|---|
| `pnpm install` | Install project dependencies |
| `pnpm run build` | Type-check and build the workspace |
| `pnpm run typecheck:libs` | Type-check libraries |
| `pnpm run typecheck` | Type-check applicable workspace packages |
| `pnpm -r run build` | Build workspace packages recursively |

## 🤝 Contributing

Contributions are welcome!

### 1. Fork the repository

Create your own fork of this repository.

### 2. Clone your fork

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

### 3. Create a branch

```bash
git checkout -b feature/my-feature
```

### 4. Make your changes

Implement your changes and make sure type checking passes:

```bash
pnpm run typecheck
```

### 5. Commit your changes

```bash
git add .
git commit -m "Add new feature"
```

### 6. Push your branch

```bash
git push origin feature/my-feature
```

Then open a Pull Request.

## 📄 License

This project is licensed under the **MIT License**.

## 👨‍💻 Author

**Your Name**

GitHub:

```text
https://github.com/YOUR-USERNAME
```

---

⭐ If you find this project useful, please consider giving it a **star** on GitHub.
