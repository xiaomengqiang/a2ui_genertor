# Shared Definitions

以下类型被多个组件复用，属性引用这些名称时参照此定义：

## DataBinding
> JSON Pointer state reference
- `path`: string — A JSON Pointer path to a value in the state

## Action
> Declarative event action. When the event fires, the declared action mutates state.
- `action`: "setState" — The action to perform when the event fires.
- `args`: { `path`: string, `value`: any }
  - `path`: string — JSON Pointer path to the state key to update.
  - `value`: any — The value to write into the state path.

## SlotNode
> Slot binding: Reference to a specific child node.
- `componentId`: string — Unique ID for cross-referencing.

## StaticChildren
> A static list of child component IDs. Every id in this array must be unique and must not be reused by any other parent node. Create a separate child node for each rendered position.
类型: string[] 
- Each item is the unique identifier for a child component node. Do not reuse the same component id in multiple parents or multiple children positions.

## TemplateChildren
> A template for generating a dynamic list of child components from a data model list. The `componentId` is the component node to use as a template. Do not reuse this template component id as a static child or as another parent's template; create a dedicated template node for this parent instance.
- `componentId`: string — The unique identifier for a template component node. It must be dedicated to this parent instance and must not be reused elsewhere.
- `path`: string — The path to the list of component property objects in the data model.
