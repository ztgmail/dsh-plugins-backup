# DSH 本地插件备份 (dsh-plugins-backup)

本仓库备份了本机（DSH Desktop）安装的全部插件源码与 profile 配置，用于重装/迁移。
来源：`C:\Users\Administrator\.dsh\profiles\{desktop,web}` + `D:\DSH\dsh-*` 本地项目（2026-09 备份）。

## 目录结构

```
profiles/
  desktop/package.json      # desktop profile 依赖 + bundles
  web/package.json          # web profile 依赖 + bundles
plugins/
  <package>/                # 每个插件的实际源码（已排除 node_modules/.git/venv）
```

## 插件清单

### desktop profile（共 16 个依赖，核心 dsh-base/dsh-web-app 除外）

| 包名 | 来源 |
|------|------|
| @dhicoc/dsh-reverse-skill | github:dhicoc/dsh-reverse-skill（87 个逆向 SKILL.md） |
| @linxin666/dsh-client-ui-task-board | npm 0.3.14 |
| @liustack/modlens | npm 3.25.4 |
| @openviking/dsh-memory-plugin | npm 0.3.0 |
| @wxg-prc-cpg/browser-skill-dsh-plugin | npm 0.2.0 |
| dsh-better-sidebar | npm 0.18.0 |
| dsh-builtin-browser | npm 0.1.21 |
| dsh-client-auto-continue | npm 0.11.4 |
| dsh-config-manager | npm 0.1.56 |
| dsh-context | npm 0.41.3 |
| dsh-delete-conversation | 本地 D:\DSH\dsh-delete-conversation |
| dsh-font-switcher | 本地 D:\DSH\dsh-font-switcher |
| dsh-pathlink | 本地 D:\DSH\dsh-pathlink |
| dsh-session-state | 本地 D:\DSH\dsh-session-state |
| dsh-web-search-aggregation | npm 0.1.10 |
| dshmarket | npm 1.41.0 |

### web profile（共 8 个依赖）

| 包名 | 来源 |
|------|------|
| @dhicoc/dsh-reverse-skill | github:dhicoc/dsh-reverse-skill#main |
| @linxin666/dsh-i18n | npm ^0.3.10 |
| @linxin666/dsh-usage | npm ^0.3.10 |
| @liustack/modlens | npm 3.17.2 |
| dsh-at-file | git+github.com/omdsh-dev/dsh-at-file#main |
| dsh-better-sidebar | github:omdsh-dev/DSH-better-sidebar#main |
| dsh-context-doctor | github:Zhenyu98/dsh-context-doctor#main |
| dsh-web | git+github.com/zhu1090093659/dsh-web-ui#main |

## 恢复方法

```powershell
# 方式一：用 reinstall.ps1 还原 profile 配置 + 重装依赖
.\reinstall.ps1            # 会执行 pnpm install（需网络）

# 方式二：手动（先复制 package.json 再装依赖）
Copy-Item profiles\desktop\package.json $env:USERPROFILE\.dsh\profiles\desktop\package.json
dsh plugin --profile desktop install
```

恢复后如 profile 的 `dsh.profile.bundles` 里缺插件入口，用以下命令逐个激活：
`dsh plugin --profile desktop add <包名>`（如 `github:dhicoc/dsh-reverse-skill`）。
本地 `file:` 项目需放回 `D:\DSH\<项目名>` 再 `dsh plugin --profile desktop install`。
