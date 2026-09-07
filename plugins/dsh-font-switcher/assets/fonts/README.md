# dsh-font-switcher — 内嵌离线字体（Offline Bundled Fonts）

本目录承载插件随包分发的字体资源，**全部为 WOFF2 全量字形（未子集化）**，
构建时以 data-URI 形式内嵌进 `lib/client.js`（见 `scripts/build-client.mjs` 与
`scripts/fonts.registry.json`），因此断网、未安装任何系统字体时仍可切换生效。

## 目录

| 路径 | 内容 |
| --- | --- |
| `woff2/<slug>/` | 单文件字族（含可变字体），每款 1 个文件或按字重拆分 |
| `chunks/<slug>/` | Google Fonts unicode-range 分片字族（`<slug>.json` + 分片 woff2） |
| `licenses/` | 各字体授权文本/通知（随包再分发依据，勿删） |

## 字族清单与来源

### 界面/正文字族（OFL 与免费商用）
| slug | 字族名 | 形态 | 许可 |
| --- | --- | --- | --- |
| `noto-sans-sc` | Noto Sans SC（思源黑体） | 可变 100–900 | OFL-1.1 |
| `noto-serif-sc` | Noto Serif SC（思源宋体） | 可变 400–700（分片） | OFL-1.1 |
| `lxgw-wenkai` | LXGW WenKai（霞鹜文楷） | Regular 400 | OFL-1.1（RFN） |
| `harmonyos-sans-sc` | HarmonyOS Sans SC（华为） | 400/500/700 | 见 `licenses/HarmonyOS-Sans-SC-LICENSE.txt`，明确允许随软件 bundle/redistribute |
| `misans` | MiSans（小米，官方 MiSansVF） | 可变 150–700 | 见 `licenses/MiSans-License-Notice.txt` + `MiSans-License-Agreement.pdf`；免费商用、允许嵌入，须显著注明 |
| `oppo-sans` | OPPO Sans 4.0 | 可变 100–700 | 见 `licenses/OPPO-Sans-4.0-License-Notice.txt`；免费商用（含商业用途） |

### 等宽/代码字族（均 OFL-1.1）
| slug | 字族名 | 形态 |
| --- | --- | --- |
| `cascadia-code` | Cascadia Code | 可变 200–700 |
| `jetbrains-mono` | JetBrains Mono | 可变 100–800 |
| `fira-code` | Fira Code | 可变 400–700（分片） |
| `source-code-pro` | Source Code Pro | 可变 200–900 |
| `ibm-plex-mono` | IBM Plex Mono | 400/500/600/700 |

## 再分发与版权注意事项

- **未随包提供**（许可证不允许/存疑）：苹方、微软雅黑、宋体/楷体/仿宋等系统专有
  字体；阿里巴巴普惠体 3.0（官方《法律声明》无嵌入/再分发授权且含兜底禁止条款，
  取得书面授权前不打包）。这些字体若在系统里安装仍可作为“（系统）”预设选用。
- HarmonyOS Sans SC 的许可要求：软件内显著声明 + 保留版权声明与本协议文本。
- MiSans 的许可要求：显著注明使用了 MiSans 字体；保留本目录许可文本。
- OPPO Sans 条款含“不向他方提供其他下载渠道”，本插件整体分发属合理嵌入式使用，
  但请保留许可文本并按官方条款使用。
- 字体格式由官方 TTF/OTF 无损转换为 WOFF2（字形轮廓未做任何修改/子集化）。

## 重新构建

```bash
# 改动 scripts/client.template.js 或 fonts.registry.json 后：
node scripts/build-client.mjs      # 重新生成 lib/client.js（含全部字体 base64）
node --check lib/client.js
```
