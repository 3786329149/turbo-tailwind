# shadcn-ui 集成指南

## 概述

本文档描述了如何在 turbo-tailwind monorepo 中集成 shadcn-ui 组件库。

## 架构设计

### 方案选择

- **组织方式**：新建独立的 `packages/shadcn-ui` 包，保持职责分离
- **组件范围**：按需添加，使用 shadcn CLI 逐步集成
- **样式策略**：无前缀，直接使用 shadcn-ui 默认类名

### 目录结构

```
packages/shadcn-ui/
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── turbo.json
├── src/
│   ├── styles.css          # shadcn-ui 样式（无前缀）
│   ├── lib/
│   │   └── utils.ts        # cn() 工具函数
│   ├── components/
│   │   └── ui/             # shadcn-ui 组件
│   │       ├── index.ts    # 组件导出
│   │       └── button.tsx  # 示例组件
│   └── index.ts            # 统一导出入口
└── dist/                   # 构建输出
```

## 依赖管理

### 核心依赖

```json
{
  "dependencies": {
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.400.0",
    "@radix-ui/react-slot": "^1.0.2"
  },
  "peerDependencies": {
    "react": "^19",
    "react-dom": "^19"
  }
}
```

### 工具函数

**src/lib/utils.ts** 提供 `cn()` 函数用于 className 合并：

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 样式系统

### 样式文件

**src/styles.css** 包含 shadcn-ui 的 CSS 变量和基础样式：

```css
@import "tailwindcss";

/* 这是 v4 标准写法 */
@theme {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
}

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ...更多 CSS 变量 */
  }

  .dark {
    /* 暗色主题变量 */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 组件样式

shadcn-ui 组件使用 Tailwind 类名，通过 `cn()` 函数合并类名，支持 variants：

```typescript
const buttonVariants = cva("inline-flex items-center justify-center gap-2...", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      /* ...其他变体 */
    },
    size: {
      default: "h-10 px-4 py-2",
      /* ...其他尺寸 */
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
```

## 组件导出策略

### 包导出配置

**package.json** 配置导出路径：

```json
{
  "exports": {
    "./styles.css": "./src/styles.css",
    "./components/*": "./src/components/*.tsx",
    ".": "./src/index.ts"
  }
}
```

### 组件导出

**src/components/ui/index.ts** 导出所有组件：

```typescript
export * from "./button";
```

**src/index.ts** 统一导出入口：

```typescript
export { cn } from "./lib/utils";
export * from "./components/ui";
```

## Apps 配置

### Next.js Apps (web, docs)

#### 1. 配置 next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/shadcn-ui"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
```

#### 2. 导入样式

在 `app/globals.css` 中添加：

```css
@import "tailwindcss";
@import "@repo/tailwind-config";
@import "@repo/shadcn-ui/styles.css";
```

### Vite App (admin)

#### 1. 配置 vite.config.ts

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@repo/shadcn-ui": path.resolve(
        __dirname,
        "../../packages/shadcn-ui/src",
      ),
    },
  },
});
```

#### 2. 导入样式

在 `src/globals.css` 中添加：

```css
@import "tailwindcss";
@import "@repo/tailwind-config";
@import "@repo/shadcn-ui/styles.css";
```

## 组件使用

### 基础用法

在 apps 中导入并使用组件：

```typescript
import { Button } from "@repo/shadcn-ui/components/ui/button";
import { cn } from "@repo/shadcn-ui";

export default function Page() {
  return (
    <Button variant="default" size="lg">
      Click me
    </Button>
  );
}
```

### 组件 Props

shadcn-ui 组件继承原生 HTML 元素的 props：

```typescript
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
```

## 组件添加流程

### 使用 shadcn CLI

```bash
# 进入 shadcn-ui 包目录
cd packages/shadcn-ui

# 初始化 shadcn
npx shadcn@latest init

# 添加组件
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
```

### 手动添加

如果 CLI 不可用，可以手动复制 shadcn-ui 组件代码到 `src/components/ui/` 目录。

### 更新导出

添加新组件后，更新 `src/components/ui/index.ts`：

```typescript
export * from "./button";
export * from "./input";
export * from "./card";
```

## 开发命令

### 构建

```bash
# 构建样式
cd packages/shadcn-ui
pnpm build:styles

# 类型检查
pnpm check-types

# Lint
pnpm lint

# 开发模式（监听样式变化）
pnpm dev:styles
```

### 根目录命令

```bash
# 构建所有包
pnpm build

# 开发所有应用
pnpm dev

# Lint 所有包
pnpm lint

# 类型检查所有包
pnpm check-types
```

## TypeScript 配置

**packages/shadcn-ui/tsconfig.json**：

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "module": "ESNext",
    "moduleResolution": "Bundler"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 注意事项

### 样式隔离

由于选择无前缀样式，确保：

1. Tailwind 配置正确，避免与其他 UI 包冲突
2. CSS 变量在每个 app 的根样式文件中正确导入
3. 不要在应用中覆盖 shadcn-ui 的 CSS 变量

### 依赖管理

- Radix UI 组件按需安装，减少包体积
- 确保所有 peer dependencies（react, react-dom）版本兼容

### 类型导出

- 确保导出所有需要的类型定义
- 组件 props 继承原生元素类型

### 文档更新

- 添加新组件时更新本文档
- 在 AGENTS.md 中添加 shadcn-ui 相关的开发规范

## 常见问题

### Q: 样式没有生效？

A: 确保在应用的 `globals.css` 中导入了 `@import "@repo/shadcn-ui/styles.css"`

### Q: TypeScript 类型错误？

A: 确保应用已配置 `transpilePackages` 并且 tsconfig.json 包含正确的路径别名

### Q: 如何自定义主题？

A: 修改 `packages/shadcn-ui/src/styles.css` 中的 CSS 变量值

### Q: 可以在 shadcn-ui 包中使用其他 UI 组件吗？

A: 可以，但需要注意样式冲突。建议将 shadcn-ui 用于基础组件，复杂组件在各应用中独立实现

## 资源链接

- [shadcn-ui 官方文档](https://ui.shadcn.com)
- [Radix UI 文档](https://www.radix-ui.com)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [Turborepo 文档](https://turbo.build/repo)
