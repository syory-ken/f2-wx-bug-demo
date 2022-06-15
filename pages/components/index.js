const { Canvas } = require('@antv/f2');

function wrapEvent(e) {
  if (!e) return;

  if (!e.preventDefault) {
    e.preventDefault = function () {};
  }

  return e;
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    onRender: {
      type: null,
      value: function value() {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},
  ready: function ready() {
    var _this = this;

    var query = wx.createSelectorQuery().in(this);
    query.select('.f2-canvas').fields({
      node: true,
      size: true
    }).exec(function (res) {
      var _res$ = res[0],
          node = _res$.node,
          width = _res$.width,
          height = _res$.height;
      var context = node.getContext('2d');
      var pixelRatio = wx.getSystemInfoSync().pixelRatio; // 高清设置

      node.width = width * pixelRatio;
      node.height = height * pixelRatio;

      var children = _this.data.onRender(_this.data);

      var canvas = new Canvas({
        pixelRatio: pixelRatio,
        width: width,
        height: height,
        context: context,
        children: children
      });
      canvas.render();
      _this.canvas = canvas;
      _this.canvasEl = canvas.canvas.get('el');
    });
  },
  observers: {
    // 处理 update
    '**': function _() {
      var canvas = this.canvas,
          data = this.data;
      if (!canvas) return;
      var children = data.onRender(data);
      canvas.update({
        children: children
      });
    }
  },
  lifetimes: {
    detached: function detached() {
      var canvas = this.canvas;
      if (!canvas) return;
      canvas.destroy();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    click: function click(e) {
      var canvasEl = this.canvasEl;

      if (!canvasEl) {
        return;
      }

      var event = wrapEvent(e); // 包装成 touch 对象

      // 问题：小程序 e.detail 对象返回的是距离顶部 x,y 距离，f2内 isInBBox 判断的则是相对距离。
      // event.touches = [e.detail];
      // 修改建议，将 x，y 均减去距离顶部距离，这样就能和 f2 内 x，y 对齐
      event.touches = [{
        x: e.detail.x - e.target.offsetLeft,
        y: e.detail.y - e.target.offsetTop
      }];

      canvasEl.dispatchEvent('click', event);
    },
    touchStart: function touchStart(e) {
      var canvasEl = this.canvasEl;

      if (!canvasEl) {
        return;
      }

      canvasEl.dispatchEvent('touchstart', wrapEvent(e));
    },
    touchMove: function touchMove(e) {
      var canvasEl = this.canvasEl;

      if (!canvasEl) {
        return;
      }

      canvasEl.dispatchEvent('touchmove', wrapEvent(e));
    },
    touchEnd: function touchEnd(e) {
      var canvasEl = this.canvasEl;

      if (!canvasEl) {
        return;
      }

      canvasEl.dispatchEvent('touchend', wrapEvent(e));
    }
  }
});