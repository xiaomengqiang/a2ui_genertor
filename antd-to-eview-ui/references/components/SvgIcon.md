# SvgIcon 图标展示

> 分类：废弃

此组件展示了svg-icons组件对外提供的所有icon图标集合，已废弃，推荐使用Icon组件获取图标

## 接口定义

```typescript
import type { MouseEvent, ReactNode } from 'react';

interface SvgIcon {


  /**
   * Elements passed into the SVG Icon.
   */
  children: ReactNode; // eslint-disable-line react/require-default-props
  /**
   * This is the fill color of the svg icon.
   * If not specified; this component will default
   * to AUI 2.0's color
   */
  color: string; // eslint-disable-line react/require-default-props
  /**
   * This is the icon color when the mouse hovers over the icon.
   */
  hoverColor: string; // eslint-disable-line react/require-default-props
  /** @ignore */
  onMouseEnter: (e: MouseEvent) => unknown;

  /** @ignore */
  onMouseLeave: (e: MouseEvent) => unknown;

  /**
   * Override the inline-styles of the root element.
   */
  style: object;

  /**
   * Allows you to redefine what the coordinates
   * without units mean inside an svg element. For example;
   * if the SVG element is 500 (width) by 200 (height); and you
   * pass viewBox="0 0 50 20"; this means that the coordinates inside
   * the svg will go from the top left corner (0;0) to bottom right (50;20)
   * and each unit will be worth 10px.
   */
  viewBox: string;

  classNameRect: string;

}
```

## 使用示例

### 基本属性设置

## en-US



```jsx
import React from 'react';
import * as actionIcons from 'eview-ui/svg-icons/actions';
import * as infos from 'eview-ui/svg-icons/infos';

/**
 * eview-ui library comes with` SVG` icon, the icon default style (color and design) from AUI 2.0.
 * eview-ui library, all the icons in` AUI 2.0` are all made `SVG` shared to the department to improve ** performance ** and ** development efficiency **.
 * Each block in the sample, above is the icon, the following is the path of the icon, such as the edit icon (the first one): the direct use of the following way:
 <pre>
 import EditIcon from 'eview-ui/svg-icons/actions/Edit'
 // some other code of yourself.
 &lt;EditIcon color="#77787B" hoverColor="#0077ee" style={{ width: '32px', height: '32px' }} /&gt;
 </pre>
 * Color, size can be set by themselves
 */
const typeNameMap = {
  Actions: 'actions',
  Align: 'align',
  Common: 'common',
  Informations: 'infos',
  Objects: 'objects',
  Others: 'others',
};
const genIcons = (icons, typeName) => {
  const keys = Object.keys(icons);
  const allIcons = keys.map((key, idx) => {
    const IconCom = icons[key];
    const svg_block = {
      'height': '50px',
      'width': '280px',
      'border': '1px dashed #a8a8a8',
      'padding': '10px',
      'margin': '10px',
      'display': 'inline-block'
    }
    return (
      <div key={`${key}_${idx}_p0`} style={svg_block}>
        <div key={`${key}_${idx}_p1`} style={{ textAlign: 'center'}}>
          <IconCom
            key={`${key}_${idx}_p3`}
            color="#77787B"
            hoverColor="#0077ee"
            style={{ width: '24px', height: '24px' }}
          />
        </div>
        <div key={`${key}_${idx}_p2`} style={{textAlign: 'center', color: '#77787b', fontSize: '12px'}}
        >{`eview-ui/svg-icons/${typeNameMap[typeName]}/${key}`}</div>
      </div>
    );
  });
  return (
    <div key={`${typeName}_p0`} >
      <div key={`${typeName}_p1`} >{`Icons/${typeName}`}</div>
      {allIcons}
    </div>
  );
};

const SvgIconsList = () => {
  const icons = [];
  icons.push(genIcons(actionIcons, 'Actions'));
  icons.push(genIcons(infos, 'Informations'));
  return (
    <div>
      {icons}
    </div>
  );
};

export default SvgIconsList;


ReactDOM.render(<SvgIconsList />, mountNode);

```

```jsx
import React from 'react';
import * as actionIcons from 'eview-ui/svg-icons/actions';
import * as infos from 'eview-ui/svg-icons/infos';

/**
 * eview-ui library comes with` SVG` icon, the icon default style (color and design) from AUI 2.0.
 * eview-ui library, all the icons in` AUI 2.0` are all made `SVG` shared to the department to improve ** performance ** and ** development efficiency **.
 * Each block in the sample, above is the icon, the following is the path of the icon, such as the edit icon (the first one): the direct use of the following way:
 <pre>
 import EditIcon from 'eview-ui/svg-icons/actions/Edit'
 // some other code of yourself.
 &lt;EditIcon color="#77787B" hoverColor="#0077ee" style={{ width: '32px', height: '32px' }} /&gt;
 </pre>
 * Color, size can be set by themselves
 */
const typeNameMap = {
  Actions: 'actions',
  Align: 'align',
  Common: 'common',
  Informations: 'infos',
  Objects: 'objects',
  Others: 'others',
};
const genIcons = (icons, typeName) => {
  const keys = Object.keys(icons);
  const allIcons = keys.map((key, idx) => {
    const IconCom = icons[key];
    const svg_block = {
      'height': '50px',
      'width': '280px',
      'border': '1px dashed #a8a8a8',
      'padding': '10px',
      'margin': '10px',
      'display': 'inline-block'
    }
    return (
      <div key={`${key}_${idx}_p0`} style={svg_block}>
        <div key={`${key}_${idx}_p1`} style={{ textAlign: 'center'}}>
          <IconCom
            key={`${key}_${idx}_p3`}
            color="#77787B"
            hoverColor="#0077ee"
            style={{ width: '24px', height: '24px' }}
          />
        </div>
        <div key={`${key}_${idx}_p2`} style={{textAlign: 'center', color: '#77787b', fontSize: '12px'}}
        >{`eview-ui/svg-icons/${typeNameMap[typeName]}/${key}`}</div>
      </div>
    );
  });
  return (
    <div key={`${typeName}_p0`} >
      <div key={`${typeName}_p1`} >{`Icons/${typeName}`}</div>
      {allIcons}
    </div>
  );
};

const SvgIconsList = () => {
  const icons = [];
  icons.push(genIcons(actionIcons, 'Actions'));
  icons.push(genIcons(infos, 'Informations'));
  return (
    <div>
      {icons}
    </div>
  );
};

export default SvgIconsList;


ReactDOM.render(<SvgIconsList />, mountNode);

```

