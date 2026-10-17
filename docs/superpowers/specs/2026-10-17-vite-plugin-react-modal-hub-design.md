# vite-plugin-react-modal-hub 设计文档

日期：2026-10-17
状态：已评审通过（brainstorming 阶段）
范围：本仓库（`@jswork/vite-plugin-react-modal-hub`，全新实现，替换脚手架占位代码）
协作方：`@jswork/react-modal-hub`（核心 lib，设计见 react-modal-hub 仓库 `docs/superpowers/specs/2026-10-17-react-modal-hub-design.md`）

## 1. 定位

为 `@jswork/react-modal-hub` 提供零配置的弹窗组件发现：生成 `virtual:react-modal-hub` 虚拟模块，导出 `{ modals, eagerModals }` 组件表，用户 spread 进 Provider。

方案 A（已定）：**虚拟模块只出数据，props 合并**——核心 lib 的注册入口仍是 `modals` / `eagerModals` props，本插件是纯 DX 糖；核心 lib spec 不因此改变。

```tsx
// provider.tsx —— 用户唯一要写的两行
import modals from 'virtual:react-modal-hub';
<ModalHub {...modals} ready={isReady}>{children}</ModalHub>
```

对齐 `vite-plugin-tiny-state` 的既有模式（resolveId / load 虚拟模块、bun test、tsup 双格式）。

## 2. API

### 2.1 插件工厂

```ts
import vitePlugin from '@jswork/vite-plugin-react-modal-hub';

vitePlugin();      // 全默认
vitePlugin({ ... });
```

| Option | 类型 | 默认 | 语义 |
|--------|------|------|------|
| `modals` | `string \| string[]` | `['/src/modals/*.tsx', '/src/modals/**/index.tsx']` | 普通弹窗的 glob（相对项目根，支持 `!` 排除） |
| `eagerModals` | `string \| string[]` | `['/src/modals-eager/*.tsx', '/src/modals-eager/**/index.tsx']` | 忽略 `ready` 的常驻弹窗的 glob |

### 2.2 虚拟模块 `virtual:react-modal-hub`

```js
const modalsFiles = import.meta.glob([...], { eager: true });       // 由 Vite 原生展开
const eagerModalsFiles = import.meta.glob([...], { eager: true });

export const modals = toMap(modalsFiles, modalsRoot);
export const eagerModals = toMap(eagerModalsFiles, eagerModalsRoot);
export default { modals, eagerModals };
```

- 组件值取 `m.default || m`（同 scanVite 的 `valueFn`）
- `import.meta.glob` 在虚拟模块内由 Vite 处理：匹配文件新增/删除/重命名会触发虚拟模块失效，无需自建 watcher
- 同名 key 冲突（如 `user.tsx` 与 `user/index.tsx` 并存）：后者覆盖 + `console.warn`（保留文件在生成码里，devtools 可见，不炸构建）

### 2.3 key 派生规则（折叠 index，已确认）

root = 该组 pattern 的公共目录前缀（截至第一个 `*`）；key = root 相对路径、去扩展名，然后：

1. 尾段为 `index` 则折叠（`user/index.tsx` → `user`；折叠后为空回退 `index`）
2. 每段 camelize：`[._-]` → `_`，再 `_(\w)` → 大写（`date-picker` → `datePicker`，目录段同样处理）
3. 子目录以 `.` 连接（`confirm/delete/index.tsx` → `confirm.delete`）

示例（root `/src/modals/`）：

| 文件 | key |
|------|-----|
| `/src/modals/login.tsx` | `login` |
| `/src/modals/date-picker.tsx` | `datePicker` |
| `/src/modals/user/index.tsx` | `user` |
| `/src/modals/confirm/delete/index.tsx` | `confirm.delete` |
| `/src/modals/user/profile.tsx` | `user.profile` |

## 3. 内部架构

### 3.1 文件结构

```
src/
├── index.ts     # 工厂：options 归一化（string|string[] → 数组）+ resolveId + load
├── codegen.ts   # generateModule()（拼虚拟模块源码字符串）+ commonRoot()
└── keyfn.ts     # deriveKey(path, root) 纯函数；测试直测；codegen 经 fn.toString() 注入生成代码（单源，无重复实现）
client.d.ts      # declare module 'virtual:react-modal-hub'（modals/eagerModals/default 类型）
__tests__/index.spec.ts
```

- `keyfn.ts` 编译产物须无 TS 专属语法、无闭包依赖（tsup 默认不压缩，`toString()` 注入安全）
- 虚拟模块 id：`virtual:react-modal-hub` → 内部 id `\0virtual:react-modal-hub`

### 3.2 明确不做（1.x 展望）

- `autoInject`（方案 A 无副作用可注入，用户在 Provider 文件手动 import + spread）
- React.lazy 非 eager 加载（bundle 级代码分割）
- 文件系统直扫（放弃 import.meta.glob 的 HMR 语义不值得）

## 4. 测试策略（bun test，对齐 tiny-state）

- `deriveKey` 单测：上表 5 个命名用例 + 折叠后为空回退 `index`
- `commonRoot`：单 pattern / 多 pattern 公共前缀 / 无公共前缀回退 `/`
- 插件钩子（仿 tiny-state）：name、resolveId 命中与未命中、load 默认 pattern / 自定义 pattern / 自定义数组 / 生成码含 toMap、deriveKey 注入与冲突 warn 逻辑、default 导出形状

## 5. 交付与约束

- 替换脚手架占位 `src/index.ts`（现为 locale/handleHotUpdate 占位代码）与占位测试
- 保持既有工程设定：tsup（cjs+esm+dts）、bun test、TypeScript、`files: ["dist"]` 增加 `client.d.ts`
- 零运行时依赖；`vite` 仅 type-only 引用（devDependency）
- 仅动本仓库；提交信息英文；不推送远程
