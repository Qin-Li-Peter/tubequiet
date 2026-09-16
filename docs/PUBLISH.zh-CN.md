# TubeQuiet 上架清单

核对日期：2026-09-17。当前是开发版本，未提交商店、未支付费用。

## 你需要提供或亲自完成

1. 发布使用的 Google 账号：注册 Chrome Web Store 开发者，开启两步验证；注册有一次性费用，以后台显示为准。付款、接受协议以及身份验证由你完成。
2. 对外开发者名称、公开客服邮箱；根据后台提示完成邮箱、身份、地址或经营者身份等验证。不要把身份证件/密码发到聊天里。
3. 一个公开可访问的隐私政策 URL。`store/PRIVACY.md` 已备好草稿，补齐名称和邮箱后托管。私有 GitHub 仓库链接不能作为公众可读的隐私页面。
4. 发布范围和地区：公开、非公开链接或受限测试；这些发布方式也有审核。建议先受限测试。
5. 至少一张真实产品截图，1280×800 或 640×400，最多五张。先完成测试，使用不暴露账号身份/历史的画面；不能把设计稿当实测截图。

## 已准备的材料

- `dist/tubequiet-0.1.0.zip`：上传商店的插件包；不要上传 source.zip。
- `dist/tubequiet-0.1.0-source.zip`：完整对应源码。
- 128px PNG 图标、440×280 小宣传图（store/assets）；图标原稿也已提供。
- 英文名称、短描述、详细介绍、单一用途、三项权限解释、审核测试步骤：`store/LISTING.md`。
- 本地隐私页面、公开隐私政策草稿、GPL 授权与上游说明。

## 发布步骤

先阅读 `VALIDATION.md`，补完未验证的场景；执行 npm test、npm run check、npm run package。进入开发者后台，新建项目并上传 ZIP；填写商店介绍、隐私声明、各权限用途、分发地区和可见性；上传图标、宣传图及真实截图，填写公开隐私政策 URL 和联系信息；按真实代码行为勾选数据处理声明；提交审核。审核通过不等于永久兼容 YouTube，后续要维护规则并通过商店发布新版。

源码参考 uBlock，项目使用 GPL-3.0-or-later。私有开发仓库可以保留；向用户分发时须保留许可证、归属信息及对应源码/修改再分发权利。当前 ZIP 已含可读运行源码；同时保留 source.zip 供获取。

## 官方依据

- 注册和费用：https://developer.chrome.com/docs/webstore/register
- 两步验证：https://developer.chrome.com/docs/webstore/program-policies/two-step-verification
- 图标、截图、宣传图：https://developer.chrome.com/docs/webstore/images
- 上传与审核：https://developer.chrome.com/docs/webstore/publish
- 发布可见性：https://developer.chrome.com/docs/webstore/cws-dashboard-distribution
- 隐私披露：https://developer.chrome.com/docs/webstore/program-policies/user-data-faq
- MV3 禁止远程执行代码：https://developer.chrome.com/docs/webstore/program-policies/mv3-requirements
- GPL 常见问题：https://www.gnu.org/licenses/gpl-faq.en.html
