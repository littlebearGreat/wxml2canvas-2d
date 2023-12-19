/**
 * wxml 元素工具类
 *
 * 实例化：
 * ```javascript
 * const element = new Element(nodesRef);
 * ```
 */
class Element {
  constructor(nodesRef) {
    Object.assign(this, nodesRef);
  }

  /**
   * 设置 wxml 元素的边框路径
   * @param {Path2D} path2D 元素的边框路径
   */
  setPath2D(path2D) {
    this.path2D = path2D;
  }

  /** 获取 wxml 元素的内容盒子大小数据 */
  getBoxSize() {
    if (this.__content) return this.__content;
    const { width: borderWidth } = this.getBorder();
    const padLeft = parseFloat(this['padding-left']);
    const padTop = parseFloat(this['padding-top']);
    const padRight = parseFloat(this['padding-right']);
    const padBottom = parseFloat(this['padding-bottom']);
    let offsetLeft = this.left + padLeft;
    let offsetTop = this.top + padTop;
    let offsetRight = this.right - padRight;
    let offsetBottom = this.bottom - padBottom;
    let offsetWidth = this.width - padLeft - padRight;
    let offsetHeight = this.height - padTop - padBottom;
    if (borderWidth > 0) {
      offsetLeft += borderWidth;
      offsetTop += borderWidth;
      offsetRight -= borderWidth;
      offsetBottom -= borderWidth;
      offsetWidth -= 2 * borderWidth;
      offsetHeight -= 2 * borderWidth;
    }
    Object.assign(this, {
      __content: {
        left: offsetLeft,
        top: offsetTop,
        right: offsetRight,
        bottom: offsetBottom,
        width: offsetWidth,
        height: offsetHeight,
      },
    });
    return this.__content;
  }

  /** 获取 wxml 元素的边框数据 */
  getBorder() {
    if (this.__border) return this.__border;
    let borderWidth = 0;
    let borderStyle = '';
    let borderColor = '';
    if (this.border) {
      [borderWidth, borderStyle, ...borderColor] = this.border.split(' ');
      if (borderStyle === 'none') {
        borderWidth = 0;
      } else {
        borderWidth = parseFloat(borderWidth);
      }
      borderColor = borderColor.join(' ');
    }
    Object.assign(this, {
      __border: {
        width: borderWidth,
        style: borderStyle,
        color: borderColor,
      },
    });
    return this.__border;
  }

  /** 获取 wxml 元素的背景色数据 */
  getBackgroundColor() {
    if (this.__backgroundColor) return this.__backgroundColor;
    let rColor = 0;
    let gColor = 0;
    let bColor = 0;
    let alpha = 0;

    [rColor, gColor, bColor, alpha] = this['background-color'].split(', ');
    rColor = +rColor.slice(rColor.indexOf('(') + 1);
    gColor = +gColor;
    if (!alpha) {
      alpha = 1;
      bColor = +bColor.slice(0, -1);
    } else {
      bColor = +bColor;
      alpha = +alpha.slice(0, -1);
    }
    Object.assign(this, {
      __backgroundColor: {
        rColor,
        gColor,
        bColor,
        alpha,
      },
    });
    return this.__backgroundColor;
  }

  /** 获取 wxml 元素的阴影数据 */
  getBoxShadow() {
    if (this.__boxShadow) return this.__boxShadow;
    let color = '';
    let blur = 0;
    let offsetX = 0;
    let offsetY = 0;
    if (this['box-shadow'] !== 'none') {
      let tempStr;
      [tempStr, offsetY, blur] = this['box-shadow'].split('px ');
      const tempIdx = tempStr.lastIndexOf(' ');
      color = tempStr.slice(0, tempIdx);
      offsetX = tempStr.slice(tempIdx + 1);
    }
    Object.assign(this, {
      __boxShadow: {
        blur,
        color,
        offsetX,
        offsetY,
      },
    });
    return this.__boxShadow;
  }

  /** 获取 wxml 元素的边缘圆角数据 */
  getBorderRadius() {
    if (this.__borderRadius) return this.__borderRadius;
    let [leftTop, topLeft] = this['border-top-left-radius'].split(' ');
    let [rightTop, topRight] = this['border-top-right-radius'].split(' ');
    let [leftBottom, bottomLeft] = this['border-bottom-left-radius'].split(' ');
    let [rightBottom, bottomRight] = this['border-bottom-right-radius'].split(' ');

    if (/%/.test(topLeft ?? leftTop)) {
      topLeft = this.height * (parseFloat(topLeft ?? leftTop, '%') / 100);
    } else {
      topLeft = parseFloat(topLeft ?? leftTop);
    }
    if (/%/.test(leftTop)) {
      leftTop = this.width * (parseFloat(leftTop, '%') / 100);
    } else {
      leftTop = parseFloat(leftTop);
    }

    if (/%/.test(topRight ?? rightTop)) {
      topRight = this.height * (parseFloat(topRight ?? rightTop, '%') / 100);
    } else {
      topRight = parseFloat(topRight ?? rightTop);
    }
    if (/%/.test(rightTop)) {
      rightTop = this.width * (parseFloat(rightTop, '%') / 100);
    } else {
      rightTop = parseFloat(rightTop);
    }

    if (/%/.test(bottomLeft ?? leftBottom)) {
      bottomLeft = this.height * (parseFloat(bottomLeft ?? leftBottom, '%') / 100);
    } else {
      bottomLeft = parseFloat(bottomLeft ?? leftBottom);
    }
    if (/%/.test(leftBottom)) {
      leftBottom = this.width * (parseFloat(leftBottom, '%') / 100);
    } else {
      leftBottom = parseFloat(leftBottom);
    }

    if (/%/.test(bottomRight ?? rightBottom)) {
      bottomRight = this.height * (parseFloat(bottomRight ?? rightBottom, '%') / 100);
    } else {
      bottomRight = parseFloat(bottomRight ?? rightBottom);
    }
    if (/%/.test(rightBottom)) {
      rightBottom = this.width * (parseFloat(rightBottom, '%') / 100);
    } else {
      rightBottom = parseFloat(rightBottom);
    }

    // 各个圆角的缩放比例
    let rScale;
    if (
      (leftTop + rightTop) > this.width
        || (leftBottom + rightBottom) > this.width
        || (topLeft + bottomLeft) > this.height
        || (topRight + bottomRight) > this.height
    ) {
      // 由各边长度以及对应的圆角半径决定
      rScale = Math.min(
        this.height / (topLeft + bottomLeft),
        this.height / (topRight + bottomRight),
        this.width / (leftTop + rightTop),
        this.width / (leftBottom + rightBottom),
      );
      leftTop *= rScale;
      rightTop *= rScale;
      leftBottom *= rScale;
      rightBottom *= rScale;
      topLeft *= rScale;
      topRight *= rScale;
      bottomLeft *= rScale;
      bottomRight *= rScale;
    }
    Object.assign(this, {
      __borderRadius: {
        leftTop,
        rightTop,
        leftBottom,
        rightBottom,
        topLeft,
        topRight,
        bottomLeft,
        bottomRight,
      },
    });
    return this.__borderRadius;
  }
}

// 节点通用属性名
Element.COMMON_PROPERTIES = [];
// 节点通用样式名
Element.COMMON_COMPUTED_STYLE = [
  'background-color', 'border-radius', 'background-image',
  'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
  'border', 'box-shadow', 'opacity',
  'border-top-left-radius', 'border-top-right-radius',
  'border-bottom-right-radius', 'border-bottom-left-radius',
];
// 文字节点特殊属性名
Element.TEXT_PROPERTIES = [];
// 文字节点特殊样式名
Element.TEXT_COMPUTED_STYLE = [
  'font-family', 'font-size', 'font-weight', 'text-align',
  'line-height', 'text-overflow', 'color',
  // 'letter-spacing', 'word-spacing',
];
// 图片节点特殊属性名
Element.IMAGE_PROPERTIES = [
  'src', 'mode',
];
// 图片节点特殊样式名
Element.IMAGE_COMPUTED_STYLE = [];

/**
 * 获取 WXML 节点信息对象
 * @param {String} selector 选择器
 * @param {Object} fields 节点信息字段
 * @param {PageObject} page 页面实例对象
 * @returns {Promise<object>} 节点信息
 */
Element.getNodesRef = (selector, fields, page) => new Promise((resolve) => {
  const query = page.createSelectorQuery();
  query.selectAll(selector).fields(fields).exec((res) => {
    resolve(res);
  });
});

export default Element;
