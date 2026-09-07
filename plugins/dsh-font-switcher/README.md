# dsh-font-switcher

> DeepSeek Harness 界面插件：**为整个 DSH 界面切换字体**（界面字体 + 等宽/代码字体），
> 在会话头部工具区（标题栏右侧）提供「字体」入口，选择**即时生效**并持久化，
> 重启后依然保持。

## 功能

| 能力 | 说明 |
| --- | --- |
| **界面字体** | 覆盖 DSH 主题变量 `--dsw-font-family`，全界面（按钮、面板、消息、标题等）立即换字体 |
| **等宽/代码字体** | 覆盖 `--ds-font-family-code` / `--dsw-font-mono`，影响代码块、命令行、命令 ID 等；可"跟随界面字体" |
| **即时预览** | 点击选项立刻全局生效，无需刷新/重启 |
| **本机检测** | 用 `document.fonts.check` 检测预设字体栈是否本机可用；「（内置）」字体内嵌随包（离线即用）；「（系统）」字体未安装时提示「本机未安装，切换后外观可能不变」 |
| **持久化** | 存于 `~/.dsh/settings.yaml` 的 `dsh-font-switcher` 一节（`uiFont` / `codeFont`），空串=默认 |
| **一键恢复** | 面板底部「恢复默认字体」清空所有覆盖（真实移除覆盖，回到主题默认） |
| **内置离线字体** | 11 款字族以 WOFF2 全量字形随插件内嵌：界面/正文＝思源黑体 Noto Sans SC、思源宋体 Noto Serif SC、霞鹜文楷 LXGW WenKai、HarmonyOS Sans SC、MiSans、OPPO Sans 4.0；等宽/代码＝Cascadia Code、JetBrains Mono、Fira Code、Source Code Pro、IBM Plex Mono。完全断网、系统未装任何字体时也能切换生效（面板标「（内置）」） |

> 机制说明：DSH 的主题样式在 `:root` 定义 `--dsw-font-family` 与 `--ds-font-family-code`，
> 大量派生 typography token 引用它们；插件在 `<html>` 上用内联样式覆盖这两个变量 +
> 基础继承字体，因此能**整个界面**生效，且不改动 DSH 任何源码。空串即还原默认。
>
> 离线字体机制：DSH 客户端插件由宿主把插件源码文本注入页面执行，没有包内静态文件
> 路由，因此字体内嵌为 data-URI 的 @font-face（由 `scripts/build-client.mjs` 依据
> `scripts/fonts.registry.json` 与 `assets/fonts/{woff2,chunks}` 生成 `lib/client.js`，
> 生成产物约 78 MB）。各字体的再分发授权、来源与逐款许可文本见
> `assets/fonts/README.md` 与 `assets/fonts/licenses/`。

## 安装（开发调试，desktop profile）

```bash
# 复制进 profile 后登记到 package.json 的 dependencies 与 dsh.profile.bundles，重启 DSH Desktop
# 或使用 dsh plugin --profile desktop add file:D:/DSH/dsh-font-switcher
```

## 目录结构

```
dsh-font-switcher/
├── package.json        # 包清单 + dsh.client 注入配置（files 含 lib/assets/scripts）
├── dsh.plugin.json     # 插件元数据清单
├── cordis.patch.yml    # bundle 组合补丁（loader 条目）
├── lib/
│   ├── index.js        # 节点端：注册 dsh-font-switcher 设置命名空间
│   └── client.js       # 浏览器端（生成产物）：头部「字体」入口 + 全局字体应用 + 内嵌字体
├── assets/fonts/
│   ├── woff2/<slug>/   # 内嵌字族源文件（全量字形）
│   ├── chunks/<slug>/  # Google Fonts unicode-range 分片字族
│   ├── licenses/       # 各字体授权文本（随包分发依据）
│   └── README.md       # 字族清单、来源与再分发合规说明
├── scripts/
│   ├── client.template.js     # 客户端逻辑源码（含生成标记）
│   ├── fonts.registry.json    # 内嵌字族注册表
│   ├── build-client.mjs       # 模板 + 字体 → 生成 lib/client.js
│   ├── fetch-gfonts-family.mjs
│   └── inspect-woff2.py
└── README.md
```

## License

MIT
