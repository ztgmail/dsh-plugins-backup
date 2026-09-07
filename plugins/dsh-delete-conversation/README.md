# dsh-delete-conversation

> DeepSeek Harness 界面插件：在**会话头部**增加「删除会话」操作——把当前会话**从会话列表中移除**，但**保留本地历史文件**（非破坏性）。运行中的会话不允许删除（按钮禁用）。

## 功能

| 能力 | 说明 |
| --- | --- |
| **头部删除入口** | 打开任意会话后，标题栏右侧出现「删除会话」按钮（hover 变红） |
| **二次确认** | 点击后弹出确认卡片，明确说明"仅从列表移除、文件保留、可重新导入" |
| **运行保护** | 会话正在运行时按钮置灰禁用（`运行中：完成后才能移除该会话`） |
| **失败提示** | 移除失败时在弹层内显示错误原因 |
| **复用官方能力** | 底层调用 DSH 内置 workspace 归档机制（`workspaces.archiveSession`），无需自定义删文件逻辑，安全可靠 |

## 安装（开发调试，desktop profile）

```bash
# 方式一：file:（复制进 profile）
dsh plugin --profile desktop add file:D:/DSH/dsh-delete-conversation

# 方式二：直接手动
# 1) 把本目录复制到 ~/.dsh/profiles/desktop/node_modules/dsh-delete-conversation
# 2) 在 ~/.dsh/profiles/desktop/package.json 的 dependencies 与 dsh.profile.bundles 中登记该包
# 3) 重启 DSH Desktop
```

> 客户端为纯 web 平台注入，重启后生效；浏览器端 bundle 由宿主在启动时按
> `package.json` 的 `exports["./client"]` 加载。

## 原理

- **客户端**（`lib/client.js`）：注册到官方槽位 `conversation.session.header.actions`
  （`kind: list`、`scope: session`，自带 `sessionId` / `useSession` 等标准 props）；
  读取当前会话 `running` 状态决定是否禁用；确认后调用注入的
  `workspaces.archiveSession(sessionId)`。
- **服务端/宿主**：`workspaces` 模型由 DSH 内置 workspace 控制器提供，归档后会话
  从列表消失、数据保留，宿主侧会自动处理"当前会话被归档"的切换。

## 目录结构

```
dsh-delete-conversation/
├── package.json        # 包清单 + dsh.client 注入配置
├── dsh.plugin.json     # 插件元数据清单
├── cordis.patch.yml    # bundle 组合补丁（loader 条目）
├── lib/
│   ├── index.js        # 节点端：no-op（无需宿主服务）
│   └── client.js       # 浏览器端：头部「删除会话」动作
└── README.md
```

## License

MIT
