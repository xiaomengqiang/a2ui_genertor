# Carousel 走马灯

> 分类：数据展示

The carousel is a slideshow for cycling through a series of content. [Under Devlopment]

## API

### 属性


| Property name    | Description                                                                                                             | Type   | Default      |
| --------------- | --------------- | ----- | ---------------------------------------------------------------------------------------------------------------------- |
| id               | 设置 Carousel 的 id                                                                                                     | string |              |
| className        | 通过添加类的方式控制整个 Carousel 的样式（控制最外层 div） 可控制：margin、padding                                      | string |              |
| style            | 通过添加 style 的方式控制整个 Carousel 的样式（控制最外层的 div） 可控制：margin、padding 例如：style={{margin：'0px'}} | object |              |
| autoplay         | 通过设置 autoplay 来控制 Carousel 是否自动播放                                                                          | bool   | false        |
| autoplayInterval | 通过设置 autoplayInterval 来控制自动播放的时间间隔                                                                      | number | 3000         |
| direction        | 通过设置 direction 决定轮播的方向，`top` `right` `bottom` `left`                                                        | string | `right`      |
| axis             | 通过设置 axis 决定轮播的水平垂直方向 `horizontal` `vertical`                                                            | string | 'horizontal' |
| transformTime    | 通过设置 transformTime 控制动画时间                                                                                     | number | 350          |

## 使用示例

### 基本使用

基本使用

```jsx
import Carousel from "eview-ui/Carousel";
import CarouselItem from "eview-ui/Carousel/CarouselItem";
import LabelField from "eview-ui/LabelField";
import pic1 from "@images/pic1";
import pic2 from "@images/pic2";
import pic3 from "@images/pic3";
import pic4 from "@images/pic4";
import pic5 from "@images/pic5";
export default class CarouselExample extends React.Component {
  render() {
    const divStyle = { margin: "20px 0px 50px 20px" };
    const labelStyle = {
      display: "block",
      fontSize: "14px",
      marginBottom: "10px",
      paddingLeft: "0px"
    };
    return (
      <div id="evu_Carousel_example">
        <div style={divStyle}>
          <LabelField style={labelStyle}>Basic Carousel</LabelField>
          <Carousel>
            <img src={pic1} />
            <img src={pic2} />
            <img src={pic3} />
            <img src={pic4} />
          </Carousel>
        </div>
        <div style={divStyle}>
          <LabelField style={labelStyle}>Autoplay Carousel</LabelField>
          <Carousel autoplay={true} autoplayInterval={3000} transformTime={600}>
            <img src={pic1} />
            <img src={pic2} />
            <img src={pic3} />
            <img src={pic4} />
          </Carousel>
        </div>

        <div style={divStyle}>
          <LabelField style={labelStyle}>Vertical Carousel</LabelField>
          <Carousel
            autoplay={true}
            autoplayInterval={3000}
            transformTime={600}
            axis={"vertical"}
          >
            <img src={pic2} />
            <img src={pic3} />
            <img src={pic4} />
          </Carousel>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<CarouselExample />, mountNode);
```

### 自定义内容

使用`Carousel.Item`，可以在其中自定义轮播图组件内容

```jsx
import Carousel from 'eview-ui/Carousel';
import pic1 from '@images/pic1';
import pic2 from '@images/pic2';
import pic3 from '@images/pic3';
import pic4 from '@images/pic4';
import pic5 from '@images/pic5';

export default class CarouselCaptionExample extends React.Component {
  render() {
    const divStyle = { margin: "20px 0px 50px 20px" };
    const captionStyle = { position: "absolute", bottom: "0", width: "100%", padding: "30px 0", color: "#fff" };
    const carouselStyle = { width: "500px", height:"300px" };
    return (
      <div id="evu_Carousel_example">
        <div style={divStyle}>
          <Carousel style = {carouselStyle}>
            <Carousel.Item>
              <img src={pic1} />
              <div style={captionStyle}>
                <h3>First slide label</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <img src={pic3} />
              <div style={captionStyle}>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <img src={pic2} />
              <div style={captionStyle}>
                <h3>Third slide label</h3>
                <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
              </div>
            </Carousel.Item>
            <img src={pic4}/>
            <img src={pic5} />

          </Carousel>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<CarouselCaptionExample />, mountNode,);

```

