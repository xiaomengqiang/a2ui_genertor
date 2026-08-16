# A2UI JSON Examples

## Example 1: Card with Status & Progress

```json
{
  "state": {
    "title": "今日任务",
    "description": "完成项目报告并提交",
    "status": "进行中",
    "progress": 65
  },
  "rootId": "mainCardContainer",
  "elements": [
    { "id": "mainCardContainer", "component": "div", "props": { "className": "p-4 bg-surface-container-highest rounded-container shadow-card" }, "children": ["mainCardHeader", "mainCardBody", "mainCardFooter"] },
    { "id": "mainCardHeader", "component": "div", "props": { "className": "flex justify-between items-center mb-3" }, "children": ["mainCardTitle", "mainCardTag"] },
    { "id": "mainCardTitle", "component": "span", "props": { "value": { "path": "/title" }, "className": "text-lg font-bold text-on-surface" } },
    { "id": "mainCardTag", "component": "Tag", "props": { "value": { "path": "/status" }, "color": "info" } },
    { "id": "mainCardBody", "component": "div", "props": { "className": "mb-3" }, "children": ["mainCardDesc"] },
    { "id": "mainCardDesc", "component": "span", "props": { "value": { "path": "/description" }, "className": "text-sm text-on-surface-variant" } },
    { "id": "mainCardFooter", "component": "div", "props": { "className": "flex items-center gap-2" }, "children": ["mainCardProgress", "mainCardProgressText"] },
    { "id": "mainCardProgress", "component": "Progress", "props": { "percent": { "path": "/progress" }, "showInfo": false } },
    { "id": "mainCardProgressText", "component": "span", "props": { "value": { "path": "/progress" }, "className": "text-xs text-on-surface-variant ml-auto" } }
  ]
}
```

## Example 2: List with Loop

```json
{
  "state": {
    "news": [
      { "id": 1, "imgSrc": "https://fpoimg.com/200x200?gradient=00C6FF,0072FF&text_color=ffffff&text=NEWS", "title": "产品更新", "desc": "新版本功能介绍", "time": "10:30" },
      { "id": 2, "imgSrc": "https://fpoimg.com/200x200?gradient=11998E,38EF7D&text_color=ffffff&text=NEWS", "title": "活动通知", "desc": "本周活动预告", "time": "09:15" },
      { "id": 3, "imgSrc": "https://fpoimg.com/200x200?gradient=B224EF,7579FF&text_color=ffffff&text=NEWS", "title": "数据统计", "desc": "上月数据报告", "time": "昨天" }
    ]
  },
  "rootId": "mainListContainer",
  "elements": [
    { "id": "mainListContainer", "component": "div", "props": { "className": "flex flex-col gap-3 p-4" }, "children": ["mainListLoop"] },
    { "id": "mainListLoop", "component": "div", "props": { "className": "flex flex-col" }, "children": { "path": "/news", "componentId": "mainListItem" } },
    { "id": "mainListItem", "component": "div", "props": { "className": "flex gap-3 p-3 bg-surface-container-highest rounded-container shadow-sm" }, "children": ["mainListItemImg", "mainListItemContent"] },
    { "id": "mainListItemImg", "component": "div", "props": { "className": "w-16 h-16 shrink-0 rounded-base overflow-hidden" }, "children": ["mainListItemImage"] },
    { "id": "mainListItemImage", "component": "img", "props": { "src": { "path": "imgSrc" }, "className": "w-full h-full object-cover" } },
    { "id": "mainListItemContent", "component": "div", "props": { "className": "flex-1 min-w-0 flex flex-col justify-center" }, "children": ["mainListItemTitle", "mainListItemDesc", "mainListItemTime"] },
    { "id": "mainListItemTitle", "component": "span", "props": { "value": { "path": "title" }, "className": "text-sm font-semibold text-on-surface" } },
    { "id": "mainListItemDesc", "component": "span", "props": { "value": { "path": "desc" }, "className": "text-xs text-on-surface-variant mt-1" } },
    { "id": "mainListItemTime", "component": "span", "props": { "value": { "path": "time" }, "className": "text-xs text-content-placeholder mt-2" } }
  ]
}
```

## Example 3: Tabs with Loop + Slot

```json
{
  "state": {
    "activeTab": "tab1",
    "rbacConfig": [
      { "key": "tab1", "name": "用户管理", "icon": "user", "content": "这是用户管理面板" },
      { "key": "tab2", "name": "角色管理", "icon": "team", "content": "这是角色管理面板" },
      { "key": "tab3", "name": "权限管理", "icon": "safety", "content": "这是权限管理面板" }
    ]
  },
  "rootId": "mainTabsContainer",
  "elements": [
    { "id": "mainTabsContainer", "component": "Tabs", "props": { "activeKey": { "path": "/activeTab" } }, "children": { "path": "/rbacConfig", "componentId": "mainTabsItem" } },
    { "id": "mainTabsItem", "component": "TabItem", "props": { "key": { "path": "key" }, "label": { "path": "name" }, "icon": { "path": "icon" }, "content": { "componentId": "mainTabsContent" } } },
    { "id": "mainTabsContent", "component": "div", "props": { "className": "p-4", "value": { "path": "content" } } }
  ]
}
```

## Example 4: Form with Multiple Input Types

```json
{
  "state": { "username": "", "country": "", "hobbies": [], "notification": true, "birthday": "" },
  "rootId": "mainFormContainer",
  "elements": [
    { "id": "mainFormContainer", "component": "div", "props": { "className": "p-inset max-w-lg mx-auto bg-surface-container-highest rounded-container shadow-card" }, "children": ["mainFormTitle", "mainFormContent", "mainFormBtn"] },
    { "id": "mainFormTitle", "component": "h2", "props": { "value": "用户信息收集", "className": "text-xl font-bold text-on-surface mb-6" } },
    { "id": "mainFormContent", "component": "div", "props": { "className": "flex flex-col gap-5" }, "children": ["mainFormUsernameField", "mainFormBirthdayField", "mainFormCountryField", "mainFormHobbiesField", "mainFormNotificationField"] },
    { "id": "mainFormUsernameField", "component": "div", "props": { "className": "flex flex-col gap-2" }, "children": ["mainFormUsernameLabel", "mainFormUsernameInput"] },
    { "id": "mainFormUsernameLabel", "component": "span", "props": { "value": "用户名", "className": "text-sm font-medium text-on-surface" } },
    { "id": "mainFormUsernameInput", "component": "Input", "props": { "value": { "path": "/username" }, "placeholder": "请输入用户名", "prefix": "user", "className": "w-full" } },
    { "id": "mainFormBirthdayField", "component": "div", "props": { "className": "flex flex-col gap-2" }, "children": ["mainFormBirthdayLabel", "mainFormBirthdayPicker"] },
    { "id": "mainFormBirthdayLabel", "component": "span", "props": { "value": "生日", "className": "text-sm font-medium text-on-surface" } },
    { "id": "mainFormBirthdayPicker", "component": "DatePicker", "props": { "value": { "path": "/birthday" }, "placeholder": "选择日期", "picker": "date", "className": "w-full" } },
    { "id": "mainFormCountryField", "component": "div", "props": { "className": "flex flex-col gap-2" }, "children": ["mainFormCountryLabel", "mainFormCountrySelect"] },
    { "id": "mainFormCountryLabel", "component": "span", "props": { "value": "国家", "className": "text-sm font-medium text-on-surface" } },
    { "id": "mainFormCountrySelect", "component": "Select", "props": { "value": { "path": "/country" }, "placeholder": "请选择国家", "options": [{ "label": "中国", "value": "cn" }, { "label": "美国", "value": "us" }, { "label": "日本", "value": "jp" }, { "label": "英国", "value": "uk" }], "className": "w-full" } },
    { "id": "mainFormHobbiesField", "component": "div", "props": { "className": "flex flex-col gap-2" }, "children": ["mainFormHobbiesLabel", "mainFormHobbiesCheckbox"] },
    { "id": "mainFormHobbiesLabel", "component": "span", "props": { "value": "爱好", "className": "text-sm font-medium text-on-surface" } },
    { "id": "mainFormHobbiesCheckbox", "component": "CheckboxGroup", "props": { "value": { "path": "/hobbies" }, "options": [{ "label": "阅读", "value": "reading" }, { "label": "运动", "value": "sports" }, { "label": "音乐", "value": "music" }, { "label": "旅行", "value": "travel" }] } },
    { "id": "mainFormNotificationField", "component": "div", "props": { "className": "flex items-center justify-between" }, "children": ["mainFormNotificationLabel", "mainFormNotificationSwitch"] },
    { "id": "mainFormNotificationLabel", "component": "span", "props": { "value": "接收通知", "className": "text-sm font-medium text-on-surface" } },
    { "id": "mainFormNotificationSwitch", "component": "Switch", "props": { "value": { "path": "/notification" }, "checkedChildren": "开", "unCheckedChildren": "关" } },
    { "id": "mainFormBtn", "component": "Button", "props": { "value": "提交", "color": "primary", "className": "w-full mt-6" } }
  ]
}
```

## Example 5: Full HTML5 Page with Loop + Dynamic Binding

```json
{
  "state": {
    "pageTitle": "应用演示",
    "heroTitle": "欢迎回来",
    "heroDesc": "响应式页面演示。",
    "features": [
      { "icon": "smartphone", "label": "全响应式" },
      { "icon": "flash", "label": "极速加载" },
      { "icon": "sparkles", "label": "原生质感" },
      { "icon": "lock", "label": "安全稳定" }
    ],
    "actionText": "立即开始体验"
  },
  "rootId": "mainAppContainer",
  "elements": [
    { "id": "mainAppContainer", "component": "div", "props": { "className": "flex flex-col min-h-screen bg-surface-container-lowest" }, "children": ["headerAppTitle", "mainContentArea"] },
    { "id": "headerAppTitle", "component": "h1", "props": { "className": "bg-surface-container-highest p-4 text-center font-bold border-b border-divider", "value": { "path": "/pageTitle" } } },
    { "id": "mainContentArea", "component": "div", "props": { "className": "flex-1 p-inset" }, "children": ["mainHeroCard", "mainFeatureList", "mainActionBtn"] },
    { "id": "mainHeroCard", "component": "div", "props": { "className": "bg-primary text-on-primary p-6 rounded-container mb-4" }, "children": ["mainHeroTitle", "mainHeroDesc"] },
    { "id": "mainHeroTitle", "component": "h2", "props": { "className": "text-xl font-bold", "value": { "path": "/heroTitle" } } },
    { "id": "mainHeroDesc", "component": "p", "props": { "className": "text-sm opacity-80", "value": { "path": "/heroDesc" } } },
    { "id": "mainFeatureList", "component": "div", "props": { "className": "flex flex-col gap-2 mb-4" }, "children": { "path": "/features", "componentId": "mainFeatureRow" } },
    { "id": "mainFeatureRow", "component": "div", "props": { "className": "bg-surface-container-highest p-3 rounded-container flex items-center gap-3 shadow-sm" }, "children": ["mainFeatureIcon", "mainFeatureLabel"] },
    { "id": "mainFeatureIcon", "component": "Icon", "props": { "name": { "path": "icon" }, "className": "w-3.5 h-3.5" } },
    { "id": "mainFeatureLabel", "component": "span", "props": { "className": "text-sm text-on-surface", "value": { "path": "label" } } },
    { "id": "mainActionBtn", "component": "Button", "props": { "className": "w-full p-4 rounded-container font-bold", "color": "primary", "value": { "path": "/actionText" } } }
  ]
}
```
