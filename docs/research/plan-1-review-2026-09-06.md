---
status: Active
owner: jap-tour
last_verified: 2026-09-06
sources:
  - guides/kansai-2026/configurations/plan-1/refinements.ts
  - guides/kansai-2026/configurations/plan-1/visits.ts
---

# 配置 1 · 景点与交通复盘

## 文档入口

- [研究索引](index.md)
- [旅行约束](../requirements/kansai-2026/constraints.md)
- [执行记录](../exec_plan/plan-1-practical-ui.md)

## 范围与结论

用户选择只调整 `kansai-2026` 的内容，界面两套共用。日期仍是 2026-09-29 至 10-07，45 个地面交通段及所有必去项目不变；没有新增景点。配置 2 保留原数据，不能把本报告视为配置 2 已完成复核。

| 日期 | 修正 | 取舍 |
| --- | --- | --- |
| 10.01 | 补充四天王寺冬季时段、慶泽园检修提醒；后三站标可选 | 保留晚出发，累了在庭园后回店 |
| 10.02 | 布引成人往返含花园 ¥2,500，取消旧足汤推荐；缆车异常不硬走山路 | 北野只走街景，保护午餐时间 |
| 10.03 | 京都交箱晚到则改后续 JR，不承诺 10:00 到店却 10:05 完成交接 | 压缩河岸，保留轻装游览与餐前休息 |
| 10.04 | 运河约 70 分钟后还有约 20 分钟到南禅寺；宇治先午餐再看庭园 | 南禅寺只留约 30 分钟，不进付费殿堂；平等院凤凰堂内部不排队 |
| 10.05 | 原 09:52 是八瀬支线，改为鞍马方向 10:00→贵船口 10:28 | 出发仍 09:00，巴士留缓冲，三社后缩短闲坐，不增加早起 |
| 10.06 | 午餐前置到东大寺片区 12:05，水谷茶屋改茶歇；春日一般参拜 15:35–16:20 | 不追 16:00 结束的特别参拜；维持近铁 17:12 目标 |

哲学之道的 70 分钟包含在地图的下一段“慢行＋接驳”里，不同时算一次节点停留、再算一次移动。平等院与东大寺点位先抵达片区用餐、再参观；餐厅尚未确定，不冒充已经选定店址。

## 官方核对

- [叡山平日表](https://eizandensha.co.jp/information/?di=20)：2026/8/22 改正，第 2 页 09:52 列开往八瀬比叡山口；第 3 页 10:00→贵船口 10:28。仅核实这段铁路，不是完整酒店到神社联程。
- [京都巴士去程](https://www.kyotobus.jp/route/timetable/schedule.html?stop_id=6293_1)、[返程](https://www.kyotobus.jp/route/timetable/schedule.html?stop_id=6292_1)：9 月增发仅到 9/27。当前平日检索结果有 15:37 回程及 17:35 末班，但未确认 10/5 适用；10:32 去程不作为保证班次。
- [JR 2026 调图](https://www.westjr.co.jp/press/article/2025/12/12/items/251212_00_press_daiyakaisei2026.pdf)：3/14 起宫古路快速及区间快速增停稻荷，不能再写“快速全部不停稻荷”。
- [哲学之道](https://ja.kyoto.travel/tourism/single01.php?category_id=8&tourism_id=2684)终点不是南禅寺；[南禅院整修](https://www.nanzenji.or.jp/information/20260108)不代表南禅寺全部关闭。
- [平等院参拜](https://www.byodoin.or.jp/guide/)庭园博物馆 ¥700，无单独低价庭园票；[凤凰堂内部调整](https://www.byodoin.or.jp/news/1/202479/)覆盖旅行日，减员与部分场次取消。
- [城阳市烟火公告](https://www.city.joyo.kyoto.jp/joint/0000012600.html)：19:00 起约 40 分钟；无当日票，限量预售，恶劣天气取消原则不退款。16:00 到场是规划目标，不是官方截止。
- [布引](https://www.kobeherb.com/infomation/hours_fare/)、[四天王寺](https://www.shitennoji.or.jp/admission.html)、[慶泽园](https://www.keitakuen-garden.jp/en/info)、[检修公告](https://www.keitakuen-garden.jp/en/news/smk57ch9f)、[天龙寺](https://www.tenryuji.com/en/visit/index.html)、[贵船](https://kifunejinja.jp/en/info/)、[东大寺](https://www.todaiji.or.jp/information/haikan/)、[春日大社](https://www.kasugataisha.or.jp/en/about_en/basic/)分别支持界面中的开放、价格和休馆提醒；逐点来源与核查日期保存在 `visits.ts`。

## 聚合查询与未核边界

通过本地只读 Yahoo 换乘 CLI，按旅行日、日本时间查询。有效结果包括：9/30 大阪难波 06:46→西九条 06:54 / JR 07:05→环球城 07:11；10/4 蹴上 12:00→六地藏 12:18 / JR 12:29→宇治 12:37，宇治 15:26→长池 15:37；长池 20:50→京都 21:23，后续 21:18→21:53、21:49→22:25；10/6 稻荷 10:32→奈良 11:40，另有 10:39 快速→11:21；近铁奈良 17:12→大阪难波 17:49；10/7 南海难波 08:00→KIX 08:39，08:02 空港急行→08:49。

这些是聚合结果，不是运营商对未来运行的保证。烟火错过目标班次，回店可能超过 22:00。全部 45 段并未逐段核实时刻；酒店地址、步行、奈良巴士、市区拥堵、完整首末班链仍需确认。UI 为未重核的铁路保留“待确认”，不因仍存在旧来源链接就标新近验证成功。

此前通过 `lark-cli` 只读读取用户飞书文档（revision 2457）；其 11 月行程和酒店不适用于本次日期，仅参考片区顺序。Google 少量评论样本与已登录小红书仅用于拥挤、台阶和体力判断，不新增公开评分、完整评论、照片或收费 API 数据。

## 尚需旅行前确认

1. 33 路 10/5 实际时刻、所有早出 / 晚归完整衔接及临时改线。
2. 两端酒店实际入口、前台收寄行李与寄送截止时间。
3. 烟火及 USJ 票券；三人正餐可订席位；午餐具体店址。
4. 慶泽园检修结束、贵船山区天气与道路、布引缆车运行。

所有“步行公里数”是路线与体力预算估计，不是地图 API 精确测距。
