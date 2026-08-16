# A2UI JSON Protocol

## 1. Global Structure

The JSON is a single object containing three top-level keys: `state`, `rootId`, and `elements`.

| Key | Type | Purpose |
| :--- | :--- | :--- |
| `state` | Object | Defines dynamic data for two-way bindings. |
| `rootId` | String | The ID of the outermost container element. |
| `elements` | Array | A flat list of elements defining the complete UI. |

**A2UI JSON CRITICAL CONSTRAINT:**
  - Output sequence MUST strictly be: `state` -> `rootId` -> `elements`.
  - MUST load and validate the output `JSON` against the `SCHEMA` defined in **A2UI STRUCTURE SCHEMA**.

## 2. Elements Array Structure

`elements` is defined as a **flat list** with ID references, supporting both HTML5 tags + A2UI Components from **A2UI Components Catalog** + Tailwind classes:

```json
"elements": [
  { "id": "mainCardContainer", "component": "div", "props": { "className": "flex flex-col gap-4 p-6 bg-white rounded-xl shadow-sm" }, "children": ["mainCardTitle", "mainCardBtn"] },
  { "id": "mainCardTitle", "component": "span", "props": { "className": "text-lg font-bold text-slate-800", "value": "春游江南极易遇雨，务必携带伞具" } },
  { "id": "mainCardBtn", "component": "Button", "props": { "className": "w-full", "color": "primary", "value": "确认出行" } }
]
```

**UI COMPOSITION STRATEGY:**
  - **Natural Mix:** Build the UI using standard HTML5 tags and A2UI components. Apply Tailwind CSS via `className` to BOTH.
  - **Ant Design Alignment:** Follow **Ant Design APIs**. Pure JSON only: NO JavaScript functions (e.g., JSX `render`).

**ELEMENTS CRITICAL CONSTRAINTS:**
  - **Parent First:** Parent components MUST be output before their children.
  - **Flat Array:** DO NOT nest element objects. Reference component by ID in `children`.
  - **Unique IDs:** Every element MUST possess a globally unique `id`. Never omit `id`.
  - **ID Naming Convention:** MUST follow `[Zone][Module][Type]` three-segment camelCase pattern.
    - **Bad:** `btn1`, `actionBtnItem`(missing zone), `div3`(no semantics).
    - **Good:** `headerNavBtn`, `sidebarSearchInput`, `mainMetricCard`, `mainTableIdCell`.
  - **No Missing Elements:** Every ID referenced in `children` MUST be defined in the `elements` array.
  - **Complete Rendering:** Fully resolve the UI tree to all absolute bottom leaf nodes.  

## 3. Data Binding

Data assignment is categorized into **Static Literals** and **Dynamic Pointers**. 

1. Static Literals: Fixed UI text. Do not reference `state`.
  - **`{"value": "Confirm your itinerary"}`** - Hardcoded strings.

2. Dynamic Pointers: Use `path` object pointing to state data for two-way binding. Follow JSON Pointers (RFC 6901).
  - **`{"value": { "path": "/emailValue" }}`** - Binds to `state` data.
  - **`{"children": { "path": "/employeeList", "componentId": "listItem" }}`** - Loops an array in `state`, rendering `componentId` per item.
  - **`{"value": { "path": "profile/name" }}`** - Binds to a local field inside a loop. Omit the leading slash for relative paths.
  - **`{"content": { "componentId": "tabItemContent" }}`** -  Map slot properties to specific child element IDs.

**DATA BINDING CRITICAL CONSTRAINTS:** 
  - **Children Rule:** The `children` array MUST ONLY contain element `id` references. NEVER raw text strings.
  - **Text Assignment:** HTML5 element raw text MUST be assigned via `props` (e.g., for a `span`, use `props: { "value": "Next" }`).
  - **Mixed Siblings (Text + Elements):** ONLY when raw text and elements share the same parent, you MUST wrap the text in a `<span>` to generate an ID reference.
    - **Bad:** `<a>Text<icon/></a>`  (Invalid: Raw text cannot generate an ID for `children`)
    - **Good:** `<a><span>Text</span><icon/></a>`(Valid: Wrapping with `span` generates an ID for `children`)
    - **Pure Text Rule:** DO NOT wrap text if the parent contains ONLY text. Use `props: { "value": "..." }` instead.
  - **Dynamic Pointers:** Form inputs (`value`) and loops MUST use `path` binding (e.g., `{ "path": "/UserList" }`).
  - **Semantic Keys:** Data keys in `state` must have clear semantic meaning (Good: `hotelName`, Bad: `val1`).
  - **State Referential Integrity:** Every referenced `path` MUST exist in the `state` object.

## 4. Loop Generation

**Syntax:** `{"children": { "path": "/employeeList", "componentId": "card_employee" }}`
  - `path`: Points to the data array in `state`.
  - `componentId`: The template component ID for each array item.

**LOOP CRITICAL CONSTRAINTS:**
  - **No Forced Loops:** ONLY use loops for list data with identical structures.
  - **Handle Irregular Information:** For uneven or irregular information structures, DO NOT force a loop. Unroll components sequentially using Static Literals instead.
                                                                                                          
**Anti-Forced Loop Example:**
  - Context: Travel Itinerary (Day 1: Morning, Afternoon. Day 2: Morning, Noon, Afternoon).
  - **Bad:** Forcing this uneven data into a nested `state` array just to loop it.
  - **Good:** Rendering Day 1 and Day 2 explicitly as sequential UI components in the `elements` array without loops.

## 5. Slot Syntax & Component Composition 

The same loop pattern applies to: `Tab/TabItem`, `Steps/StepItem`, `Table/TableRow`, `Collapse/CollapseItem`, `Timeline/TimelineItem`.

**Identical Structures Composition Syntax:** `"component": "Steps", "children": { "path": "/stateArray", "componentId": "StepItem_id" }`
- `path`: Points to the data array in `state`.
- `componentId`: Cross-reference ID of the `StepItem` template.

**Irregular Structures Composition Syntax:** `"component": "Tabs", "children": ["tabItem_user", "tabItem_product", "tabItem_server"]`
- Child items require distinct, non-uniform internal structures or completely independent logic.

**Slot Syntax:** `"props": { "key": { "path": "id" }, "label": { "path": "name" }, "content": { "componentId": "div_id" } }`
- `key` / `label` / `icon`: Relative data bindings mapped directly from the current array item.
- `content`: Slot binding. MUST use `{ "componentId": "elementId" }` to reference the complex structural node (e.g., a `div` containing the actual tab body).

------

# A2UI STRUCTURE SCHEMA
```json
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "Surface Schema",
    "description": "A JSON payload for dynamically constructing a UI surface.",
    "type": "object",
    "required": [
        "state",
        "elements",
        "rootId"
    ],
    "additionalProperties": false,
    "properties": {
        "state": {
            "description": "The data store for the surface.",
            "type": "object",
            "additionalProperties": true
        },
        "rootId": {
            "description": "The ID of the root element.",
            "type": "string"
        },
        "elements": {
            "description": "A flat list of all elements.",
            "type": "array",
            "minItems": 1,
            "items": {
                "type": "object",
                "description": "An element node. The 'component' field accepts an A2UI component name (see references/component/) or an HTML5 tag (e.g. div, span, img). See references/component_catalog.md for the full component list.",
                "required": [
                    "id",
                    "component"
                ],
                "properties": {
                    "id": {
                        "type": "string",
                        "description": "A unique identifier for this component within the surface."
                    },
                    "component": {
                        "type": "string",
                        "description": "The component type name — an A2UI component (see references/component/) or an HTML5 tag. See references/component_catalog.md for all A2UI components."
                    },
                    "props": {
                        "type": "object",
                        "description": "Component-specific properties. For A2UI components, see references/component/{ComponentName}.md; HTML5 tags support className, value, src, children, href, etc.",
                        "additionalProperties": true
                    },
                    "children": {
                        "oneOf": [
                            {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                },
                                "description": "A static list of child component IDs."
                            },
                            {
                                "type": "object",
                                "description": "A template for generating a dynamic list of children from a data model list.",
                                "required": [
                                    "componentId",
                                    "path"
                                ],
                                "additionalProperties": false,
                                "properties": {
                                    "componentId": {
                                        "type": "string",
                                        "description": "The ID of the component to use as a template for each list item."
                                    },
                                    "path": {
                                        "type": "string",
                                        "description": "The JSON Pointer path to the list in the data model, e.g. '/listData'."
                                    }
                                }
                            }
                        ],
                        "description": "Defines the children of this component. Use an array of IDs for a fixed set of children, or a template object to generate children from a data list. Children must be referenced by ID, not defined inline."
                    }
                }
            }
        }
    }
}
```

