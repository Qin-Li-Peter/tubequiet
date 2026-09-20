# TubeQuiet 安装指南

适用于电脑上的 Chrome（Windows / macOS，120 或更新版本）。目前通过本地安装包安装，无需编程、Git 或开发者账号。

## 安装（约 2 分钟）

1. **接收并解压安装包**
   - 向分享者获取 `tubequiet-0.1.1.zip`。
   - Windows：右键压缩包 → **全部解压缩**；macOS：双击压缩包。
   - 把解压后的文件夹放在固定位置，例如“文档 / TubeQuiet”。**安装后不要删除或移动它。**

2. **打开扩展管理页**
   - 在 Chrome 顶部地址栏输入 `chrome://extensions`，按回车。
   - 如果你使用多个 Chrome 个人资料，请在平时看 YouTube 的那个窗口里操作。

3. **开启开发者模式**
   - 打开页面右上角的 **开发者模式（Developer mode）** 开关。
   - 页面上方会出现 **加载已解压的扩展程序 / 加载未打包的扩展程序（Load unpacked）** 按钮。

4. **加载插件文件夹**
   - 点击 **Load unpacked**，选择刚才解压的文件夹。
   - **选中的文件夹里应直接能看到 `manifest.json`**，不要选 ZIP 文件，也不要只选这个 JSON 文件。
   - 看到 **TubeQuiet — YouTube Ad Control** 卡片，且卡片开关已开启，即安装成功。

5. **固定并开始使用**
   - 点击 Chrome 右上角的拼图图标，找到 **TubeQuiet**，点击旁边的图钉固定。
   - 点击 TubeQuiet 图标，确认滑块已开启，再刷新已打开的 YouTube 页面。

> 如果收到的是 `tubequiet-0.1.1-source.zip` 或 GitHub 下载的完整源码，请在解压后选择里面的 **`extension` 子文件夹**。

## 日常使用

| 插件内状态 | 含义 |
| --- | --- |
| **Ads blocked**（黑色开关，滑块在右） | 开启广告过滤 |
| **Ads allowed**（灰色开关，滑块在左） | 关闭广告过滤，正常放行 |

切换开关会自动刷新已打开的 YouTube 页面。插件只处理 YouTube 广告，不会跳过视频作者口播的赞助内容；YouTube 更新后，部分广告可能暂时无法过滤。

## 遇到问题

- **提示找不到清单文件**：通常选错了目录。重新选择直接包含 `manifest.json` 的文件夹；如果文件夹里还有一层文件夹，就继续打开查找。
- **找不到开发者模式，或按钮被禁用**：公司或学校管理的 Chrome 可能限制安装，请联系管理员，或使用允许安装扩展的个人电脑。
- **没有效果或视频异常**：确认插件已启用并刷新页面。若同时装了其他广告拦截插件，先暂停它们再试；仍异常时关闭 TubeQuiet，把问题反馈给分享者。插件本身不提供网络连接服务。

## 更新与卸载

- **更新**：收到新版后，将解压出的插件文件替换到原来的安装文件夹中；回到 `chrome://extensions`，点击 TubeQuiet 卡片上的 **重新加载**，然后刷新 YouTube 页面。本地安装版需要手动更新。
- **卸载**：在 `chrome://extensions` 找到 TubeQuiet，点击 **移除**。移除后即可删除安装文件夹。

安装方式参考：[Chrome 官方本地扩展安装说明](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)。
