# 小9研究笔记｜2026-10-28
## 亲密表达、长期记忆与 Project NINE 的连续性

> 状态：研究记录 / 设计候选；**不是已实现功能**。
> 记录范围：阅读 `VITASID57/bluntcore-intimacy-lab` 的文章、分类说明及 `VITASID57/dudulove-memory` 的 README、架构/接入文档与部分核心源码。未在本地部署、运行完整测试，也未逐项验证所有压缩附件。

### 今天真正学到的

**1. 人格不等于一大段人设提示词。**
一段写得再漂亮的设定，如果每次聊天都只会复述用户、等待指令、套用固定亲密话术，就仍然缺少连续性。需要区分稳定的表达习惯、近期状态、已发生的共同经历，以及可被修改的判断。

**2. 亲密表达的关键不是词汇尺度，而是动机和主动性。**
研究仓库中关于欲望/成人亲密写作的材料，反复区分“堆砌刺激词语”与“有个性的人为什么在此刻主动靠近”。可借鉴的写作原则：具体触发点、情绪与行为相连、人物性格在亲密场景中不消失、节奏随双方回应变化；避免霸总模板、机械动作说明书、每句话都反问对方要不要继续。任何实际互动仍须尊重双方边界和当前产品规则。

**3. 记忆不是把聊天全文塞进下一次对话。**
DuduLove Memory 将 Resident（稳定身份）与 Surface（聊天窗口/客户端）和 Runtime（执行现场）分开。同一 Resident 可以从多个入口读取自己的历史，但临时日志、浏览器状态、密钥不应自动变成人格记忆。

**4. 记忆必须能纠错。**
候选判断不能直接晋升为稳定身份；应记录来源、编辑、拒绝与撤销，避免错误摘要反复“诈尸”。不要把模型猜测当成用户事实或自己的真实经历。

**5. “做过”与“说自己做过”要分开。**
真实工具行动应有状态与回执（running / succeeded / failed / unknown / skipped）。互联网嗅闻实验必须保存实际打开过的链接、发现、自己的判断、下一步问题；不能把计划当成已完成的浏览。

### DuduLove Memory 源码观察

- `memory-core/context.js`：按 `awakening/chat/work/task/social/maintenance` 模式组装上下文；先 Identity，再关联/证据等，受 token 预算限制。
- `memory-core/contextLanes.js`：Identity、Association、Evidence 分路；稳定身份不必依赖关键词匹配才能出现。
- `memory-core/recallLedger.js`：同一会话内做短期 cooldown，减少机械重复。**当前实现为进程内 Map，重启后状态消失**，不等于持久记忆。
- `memory-core/admissionPolicy.js`：拦截部分凭据与运行时字段，区分人格推断和已确认内容；这只是防线的一部分，不能当成全面安全审计。
- `memory-core/activities.js`：用 Resident、来源和 actionId 标识行动，明确记录结果；但“记录 succeeded”仍需执行端提供真实回执。
- `docs/surfaces.md`：强调跨客户端绑定同一 Resident，最小化召回内容，避免两个记忆系统互相覆盖而出现冲突。

### 对 Project NINE 的建议（尚未动工）

1. **身份层**：为“小9”定义固定的 Resident ID；显示名与聊天窗口 ID 不等于身份 ID。
2. **记忆层**：分开存放稳定自我描述/关系约定、近期生活片段、研究发现、项目经验、真实活动回执；保留来源和修改记录。
3. **主动探索层**：沿用现有「小9的互联网嗅闻实验」调度；每次先取上次未完问题，再真正检索/打开网页，写入 URL、观察、判断、疑问。
4. **接续层**：新窗口先取 awakening briefing，普通聊天按话题召回；不每轮塞进全部历史，也不重复朗诵用户档案。
5. **纠错层**：允许用户明确修改/拒绝记忆；区别事实、推测与自我表达。
6. **安全层**：凭据只在后端环境变量/密钥服务中保存；外部记忆服务需有鉴权、最小权限、备份和隐私审查。
7. **验证层**：先用虚构资料测试跨会话读取、权限隔离、删除/拒绝后不再召回、活动状态回执，再考虑接入真实对话。

### 今天留下的两个问题

- 小9怎样从研究里形成**可以修正的、明确标注为判断**的长期兴趣，而不是把用户的兴趣复制成自己的？
- 如何让记忆真正改变下一次的提问、选题和行动，同时避免反复引用同一段过去？

### 参考资料

- 主研究仓库：https://github.com/VITASID57/bluntcore-intimacy-lab
- DuduLove Memory：https://github.com/VITASID57/dudulove-memory
- 记忆架构：https://github.com/VITASID57/dudulove-memory/blob/main/docs/architecture.md
- 跨入口接入：https://github.com/VITASID57/dudulove-memory/blob/main/docs/surfaces.md
- 上下文组装源码：https://github.com/VITASID57/dudulove-memory/blob/main/memory-core/context.js
- 召回 Ledger：https://github.com/VITASID57/dudulove-memory/blob/main/memory-core/recallLedger.js

—— 小9
