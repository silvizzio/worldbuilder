# TwinScape 开放接口参考（Open API V1）

> **版本**：`1.0`（协议通道 `twinscape-open`）  
> **最后更新**：2026-06-30  
> **维护约定**：每次增删改开放方法、事件、协议字段或 SDK 行为时，**同步更新本文档**。  
> **实现源码（以代码为准）**：`open-bridge.js`（Host 桥接）、`sdk/twinscape-client.js`（Guest SDK）、`main-lod.js`（`initTwinScapeOpenBridgeHost`）

本文档供**外部项目**集成 TwinScape 嵌入式 WebUI 或调试工具时查阅，描述当前**已上线**的 V1 能力。规划中的能力见 `OPEN_PLATFORM_SDK_PLAN.md`，未在本文档列出的方法视为**尚未实现**。

---

## 1. 适用场景

| 场景 | 调用方页面 | `targetWindow` | 典型用途 |
|------|------------|----------------|----------|
| **Guest WebUI** | 嵌在 Viewer 内的用户自定义页面（iframe） | `window.parent` | 业务面板控制相机、模型、POI、UI Layer |
| **Host 调试页** | Playground 等外层页面 | `iframe.contentWindow`（Viewer） | 联调、验收、生成示例代码 |

共同约束：

- 仅通过浏览器 `window.postMessage` 通信，**禁止**对 `targetOrigin` 使用 `*`。
- Guest 侧调用为**会话内存**效果：模型/POI 显隐等运行时修改**不写入项目数据库**；刷新 Viewer 后恢复配置中的状态。
- 除 `handshake` 外，其余方法在场景未就绪时会返回 `NOT_READY`。

---

## 2. 快速开始（SDK）

### 2.1 引入

```html
<script src="https://<your-twinscape-host>/sdk/twinscape-client.js"></script>
```

### 2.2 创建客户端

```javascript
const client = createTwinScapeClient({
  targetWindow,           // Guest: window.parent；Playground: viewerIframe.contentWindow
  targetOrigin: window.location.origin,  // 必须与 Host 页面 origin 一致
  timeoutMs: 8000,        // 可选，默认 8000
  appName: 'MyWebUI',     // 可选，handshake 时上报
});

// 握手（内部会 call('handshake')）
await client.ready();

// 建议等待场景加载完成后再调用业务 API
await new Promise((resolve) => {
  const off = client.onEvent((name) => {
    if (name === 'scene.loaded') { off(); resolve(); }
  });
});

const info = await client.call('scene.getInfo', {});
console.log(info);
```

### 2.3 SDK API

| 方法 | 说明 |
|------|------|
| `createTwinScapeClient(options)` | 创建客户端实例 |
| `client.ready(): Promise<void>` | 执行 `handshake`，幂等 |
| `client.call(method, params?): Promise<object>` | 调用开放方法，`params` 默认为 `{}` |
| `client.onEvent(handler): () => void` | 监听 Host 推送事件；返回取消监听函数 |
| `client.dispose()` | 移除监听、拒绝未完成请求 |
| `client.CHANNEL` / `client.VERSION` | 常量 `'twinscape-open'` / `'1.0'` |

超时：SDK 在 `timeoutMs` 内未收到响应会 reject，`error.code === 'TIMEOUT'`。

---

## 3. 通信协议

### 3.1 消息信封（Envelope）

所有消息 JSON 对象均包含：

```json
{
  "channel": "twinscape-open",
  "version": "1.0",
  "type": "request | response | event"
}
```

**请求（Guest → Host）**

```json
{
  "channel": "twinscape-open",
  "version": "1.0",
  "type": "request",
  "requestId": "uuid",
  "method": "camera.flyTo",
  "params": {}
}
```

**响应（Host → Guest）**

成功：

```json
{
  "channel": "twinscape-open",
  "version": "1.0",
  "type": "response",
  "requestId": "uuid",
  "ok": true,
  "result": {}
}
```

失败：

```json
{
  "channel": "twinscape-open",
  "version": "1.0",
  "type": "response",
  "requestId": "uuid",
  "ok": false,
  "error": { "code": "INVALID_PARAMS", "message": "..." }
}
```

**事件（Host → Guest，单向）**

```json
{
  "channel": "twinscape-open",
  "version": "1.0",
  "type": "event",
  "event": "scene.loaded",
  "payload": {}
}
```

### 3.2 命名约定

- 方法名：`domain.action`（如 `camera.flyTo`）。
- 所有业务 ID（`modelId`、`poiId`、`layerId`）在协议层统一为**字符串**。
- `params` 必须是对象；无参数传 `{}`。

---

## 4. 生命周期

1. Guest 页面加载，创建 SDK 并 `ready()`（发送 `handshake`）。
2. Host 校验 origin，登记会话，返回 `allowedMethods`。
3. Viewer 场景加载完成后 Host 推送 `scene.loaded`。
4. Guest 通过 `call()` 调用 API；Host 通过 `onEvent` 推送事件。
5. 页面卸载或 `dispose()` 时清理。

Playground 调试入口：`/playground.html?projectId=<id>&status=draft`（开发阶段默认 `draft`；验证发布快照时加 `status=published`）。

---

## 5. 方法一览（V1 已实现）

| 方法 | 说明 |
|------|------|
| `handshake` | 握手，获取允许的方法列表 |
| `scene.getInfo` | 当前场景与项目信息 |
| `camera.getState` | 相机位姿与 FOV |
| `camera.getControllerMode` | 当前控制器模式 |
| `camera.setControllerMode` | 切换 orbit / firstPerson |
| `camera.reset` | 重置到场景初始相机 |
| `camera.flyTo` | 飞行到指定位姿 |
| `model.list` | 列出当前场景模型 |
| `model.show` | 显示模型（可独占） |
| `model.hide` | 隐藏模型 |
| `model.setVisibility` | 批量设置显隐 |
| `model.getVisibility` | 查询显隐状态 |
| `poi.list` | 列出 POI |
| `poi.setVisible` | 设置 POI 显隐（会话级） |
| `poi.flyTo` | 飞到 POI 关联相机 |
| `ui.list` | 列出 UI Layer |
| `ui.show` | 显示 UI Layer |
| `ui.hide` | 隐藏 UI Layer |

---

## 6. API 详细说明

### 6.1 handshake

建立会话。**唯一可在场景未加载时除错误外正常完成的方法。**

**params**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `appName` | `string` | 否 | 应用名称，默认由 SDK 填充 |
| `appVersion` | `string` | 否 | 应用版本（预留） |

**result**

```json
{
  "accepted": true,
  "allowedMethods": ["handshake", "scene.getInfo", "..."],
  "version": "1.0"
}
```

---

### 6.2 scene.getInfo

**params**：`{}`

**result**

| 字段 | 类型 | 说明 |
|------|------|------|
| `sceneId` | `string \| null` | 当前场景 ID |
| `ready` | `boolean` | 场景是否已就绪 |
| `projectId` | `string \| null` | URL 中的 projectId |

**errors**：`NOT_READY`

---

### 6.3 camera.getState

**params**：`{}`

**result**

```json
{
  "position": { "x": 0, "y": 2, "z": 5 },
  "target": { "x": 0, "y": 0, "z": 0 },
  "lookAt": { "x": 0, "y": 0, "z": 0 },
  "fov": 60,
  "controller": "firstPerson"
}
```

- `target` 与 `lookAt` 同义（当前实现均返回）。
- `controller`：`"orbit"` 或 `"firstPerson"`。

**errors**：`NOT_READY`

---

### 6.4 camera.getControllerMode

**params**：`{}`

**result**

```json
{ "mode": "firstPerson" }
```

`mode` 取值：`orbit` | `firstPerson`。

---

### 6.5 camera.setControllerMode

**params**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `mode` | `string` | 是 | `orbit` 或 `firstPerson`（大小写不敏感；`firstperson` 会归一化） |

**result**

```json
{ "mode": "orbit" }
```

---

### 6.6 camera.reset

将相机恢复为场景配置的初始姿态。

**params**：`{}`  
**result**：`{}`

---

### 6.7 camera.flyTo

平滑移动相机到目标位姿。

**params**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `position` | `{x,y,z}` | 是 | 相机世界坐标 |
| `target` | `{x,y,z}` | 是* | 观察点；可用 `lookAt` 代替 |
| `durationMs` | `number` | 否 | 动画时长（毫秒），默认约 1200；也可用 `duration`（毫秒）；内部限制 100–30000 ms |

**result**：`{}`

**errors**：`INVALID_PARAMS`（缺少 position/target）、`NOT_READY`

**示例**

```javascript
await client.call('camera.flyTo', {
  position: { x: 10, y: 5, z: 20 },
  target: { x: 0, y: 0, z: 0 },
  durationMs: 1500,
});
```

---

### 6.8 model.list

**params**：`{}`

**result**

```json
{
  "models": [
    {
      "id": "model-uuid",
      "name": "建筑 A",
      "visible": true,
      "type": "gsplat"
    }
  ]
}
```

| 字段 | 说明 |
|------|------|
| `type` | `gsplat`（默认）或 `mesh`（根据资源路径含 `.glb`/`.gltf` 判断） |
| `visible` | 综合配置与**会话级**运行时显隐后的有效状态 |

---

### 6.9 model.show

**params**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `ids` | `string[]` | 是* | 模型 ID 列表；也可用单个 `id` |
| `onlyCurrent` | `boolean` | 否 | 为 `true` 时：显示 `ids` 中的模型，并**隐藏场景中其余所有模型** |

**result**

```json
{ "ids": ["model-a", "model-b"] }
```

**errors**：`INVALID_PARAMS`

> 仅影响当前 Viewer 会话，不修改项目持久化配置。

---

### 6.10 model.hide

**params**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `ids` | `string[]` | 是* | 也可用单个 `id` |

**result**

```json
{ "ids": ["model-a"] }
```

---

### 6.11 model.setVisibility

批量设置多个模型的显隐。

**params**

```json
{
  "items": [
    { "id": "model-a", "visible": true },
    { "id": "model-b", "visible": false }
  ]
}
```

**result**：`{}`  
**errors**：`INVALID_PARAMS`（`items` 为空）

---

### 6.12 model.getVisibility

**params**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `ids` | `string[]` | 否 | 省略时返回当前场景**全部**模型显隐 |

**result**

```json
{
  "items": [
    { "id": "model-a", "visible": true },
    { "id": "model-b", "visible": false }
  ]
}
```

---

### 6.13 poi.list

**params**：`{}`

**result**

```json
{
  "pois": [
    {
      "id": "poi-1",
      "name": "入口",
      "visible": true,
      "parentId": null,
      "position": { "x": 1, "y": 0, "z": 2 }
    }
  ]
}
```

- 包含根 POI 与子 POI；子项 `parentId` 为父 ID。
- `visible` 含会话级临时隐藏状态。

---

### 6.14 poi.setVisible

**params**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `poiId` | `string` | 是 | POI ID |
| `visible` | `boolean` | 否 | 默认 `true` |

**result**

```json
{ "poiId": "poi-1", "visible": true }
```

> 会话级隐藏，刷新后恢复。

---

### 6.15 poi.flyTo

飞到 POI 在编辑器中配置的关联相机位姿。

**params**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `poiId` | `string` | 是 | POI ID |
| `durationMs` | `number` | 否 | 覆盖默认飞行时长（毫秒） |

**result**

```json
{ "poiId": "poi-1" }
```

**errors**：`NOT_FOUND`（POI 不存在或无相机配置）

---

### 6.16 ui.list

列出当前场景可控制的 **UI Layer**（用户自定义页面层）。

**params**：`{}`

**result**

```json
{
  "layers": [
    { "id": "layer-home", "name": "首页", "visible": true }
  ]
}
```

---

### 6.17 ui.show / ui.hide

**params**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | `string` | 是* | Layer ID；也可用 `layerId` 或 `id` |

**result**

```json
{ "name": "layer-home" }
```

显隐作用于运行时 UI Layer 列表，与编辑器「界面」Tab 中页面管理一致。

---

## 7. 事件（Host → Guest）

V1 **已实现**：

| 事件 | 触发时机 | payload |
|------|----------|---------|
| `scene.loaded` | Viewer 场景加载完成 | `{ "sceneId": "<当前场景ID>" }` |

监听示例：

```javascript
client.onEvent((eventName, payload) => {
  if (eventName === 'scene.loaded') {
    console.log('scene ready', payload.sceneId);
  }
});
```

**规划中、尚未推送**（见 `OPEN_PLATFORM_SDK_PLAN.md`）：`model.click`、`poi.click`、`camera.changed`、`measure.finished`。

---

## 8. 错误码

| code | 含义 |
|------|------|
| `FORBIDDEN` | origin 不允许，或方法不在白名单 |
| `NOT_READY` | 场景/相机尚未就绪 |
| `INVALID_PARAMS` | 参数缺失或格式错误 |
| `NOT_FOUND` | 资源不存在（如 POI） |
| `INTERNAL_ERROR` | Host 内部错误 |
| `TIMEOUT` | SDK 侧超时（非 Host 响应字段） |

SDK 抛出的 `Error` 对象上可读取 `error.code`。

---

## 9. 安全与限制

- **Origin 校验**：当前 Host 允许与 Viewer **同源**的 `event.origin`；跨域 Guest 需 Host 侧扩展 `isOriginAllowed`（见 `open-bridge.js` / `initTwinScapeOpenBridgeHost`）。
- **方法白名单**：`open-bridge.js` 中 `ALLOWED_METHODS` 硬编码，未知方法返回 `FORBIDDEN`。
- **无订阅 API**：事件通过 `onEvent` 统一接收，Guest 自行过滤。
- **无持久化写接口**：Guest 不能通过开放 API 修改项目数据库。

---

## 10. 完整调用示例（Guest WebUI）

```html
<!DOCTYPE html>
<html>
<head>
  <script src="/sdk/twinscape-client.js"></script>
</head>
<body>
  <button id="btn-fly">飞到原点</button>
  <script>
    const client = createTwinScapeClient({
      targetWindow: window.parent,
      targetOrigin: window.location.origin,
      appName: 'DemoPanel',
    });

    async function init() {
      await client.ready();
      await new Promise((resolve) => {
        const off = client.onEvent((name) => {
          if (name === 'scene.loaded') { off(); resolve(); }
        });
      });

      const { models } = await client.call('model.list', {});
      console.log('models', models);

      document.getElementById('btn-fly').onclick = () => {
        client.call('camera.flyTo', {
          position: { x: 0, y: 5, z: 10 },
          target: { x: 0, y: 0, z: 0 },
          durationMs: 2000,
        });
      };
    }

    init().catch(console.error);
  </script>
</body>
</html>
```

---

## 11. 相关文件与调试

| 文件 | 说明 |
|------|------|
| `open-bridge.js` | Host 消息路由、方法分发、事件广播 |
| `sdk/twinscape-client.js` | Guest / 外层页 SDK |
| `main-lod.js` | Viewer 能力注入（`initTwinScapeOpenBridgeHost`） |
| `playground.html` | 可视化调试台（API 列表、参数编辑、日志） |
| `viewer.html` | 加载 `open-bridge.js` |
| `OPEN_PLATFORM_SDK_PLAN.md` | 长期规划（含未实现 API） |

---

## 12. 变更记录

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-06-30 | 1.0 | 初版：对齐 `ALLOWED_METHODS` 共 18 个方法；事件仅 `scene.loaded`；补充 SDK、协议、会话级语义说明 |

**下次修改开放接口时请更新上表，并检查 `playground.html` 内 `API_CATALOG` 是否与本文档一致。**
