// index.js
// 获取应用实例
const app = getApp()
const { createElement, Chart, Interval, Axis, Legend } = require('@antv/f2');

Page({
  data: {
    motto: 'Hello World',
    onRenderChart() {
      const data = [
        { genre: "Sports", sold: 275 },
        { genre: 'Strategy', sold: 115 },
        { genre: 'Action', sold: 120 },
        { genre: 'Shooter', sold: 350 },
        { genre: 'Other', sold: 150 },
      ]

      return createElement(Chart, {
        data: data,
        children: [
          createElement(Legend),
          createElement(Axis, { field: 'genre' }),
          createElement(Axis, { field: 'sold' }),
          createElement(Interval, {
            x: 'genre',
            y: 'sold',
            color: 'genre'
          })
        ]
      })
    }
  },
})
