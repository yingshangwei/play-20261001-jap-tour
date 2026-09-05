---
status: Active
owner: jap-tour
last_verified: 2026-09-05
---

# 旅程动画：自绘路线与真实地图

本次目标是看懂每天几点出发、乘什么交通、到哪里、停留多久，不是替代实时导航。采用默认自绘路线带、可切换真实地图定位、保留逐段 Google Maps 导航的组合。两套关西配置与开发示例共享实现，行程本身不变。

## 为什么不把 Google 细路线画到现有底图

- [Routes API 政策](https://developers.google.com/maps/documentation/routes/policies)：路线结果若展示在地图上，应使用 Google Map；不能直接复制到 Leaflet / OpenStreetMap。
- [公共交通路线](https://developers.google.com/maps/documentation/routes/transit-route)：TRANSIT 不支持中间途经点。一天多站、步行与铁路混合，应逐段请求，不是一次全天请求。
- [Embed API 用量与计费](https://developers.google.com/maps/documentation/embed/usage-and-billing)：嵌入目前免费但需要 API key；iframe 不是可自由控制角色动画的地图画布。
- [Routes API 用量与计费](https://developers.google.com/maps/documentation/routes/usage-and-billing)：进一步接 Google JS 地图与路线服务需要 Cloud / API / billing 配置，本次不新增。

自绘线只表达顺序，明确不按地理比例，不代表道路、轨道、真实速度。真实地图只展示起终点位置，不画假线路。若以后要逐街道、逐轨道播放，需要有授权的路线几何及交通子段数据；不能用驾车路由模拟铁路。

## 原实现的体验问题

暂停和调速触发地图图层重建，角色回到起点；3.2 秒切段与 1.5 秒位移使用不同计时器。每次镜头缩放和角色运动同时发生，长说明和照片又挤在可滚动侧栏，手机上的控制按钮离画面很远。

新设计与验证记录见 [播放器设计](../development/journey-player.md)、[执行记录](../exec_plan/journey-player.md)。
