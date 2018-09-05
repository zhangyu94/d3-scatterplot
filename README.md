# d3-scatterplot

a reusable D3.js scatterplot plugin that supports easy customization

this plugin is implemented as a closure that supports [method chaining](https://en.wikipedia.org/wiki/Method_chaining)

[why implement the plugin as a closure (by Mike Bostock)](https://bost.ocks.org/mike/chart/)

## Dependency

- D3.js (5.x version)

## Installing

first, download [d3.scatterplot.js](libs/d3.scatterplot.js) in the libs folder

d3.scatterplot.js can be loaded directly as

```html
<script src="pathToTheFile/d3.scatterplot.js"></script>
```

then use as

```js
let chart = d3.scatterplot()
```

or if you are using Node.js/CommonJS

```js
import scatterplot from "pathToTheFile/d3.scatterplot.js"
```

## Usage example

```js
let data = [{x: 10, y: 10}, {x: 20, y: 15}, {x: 30, y: 0}]

let chart = d3.scatterplot()

let svg = d3.select('body').append('svg')
    .datum(data)
    .call(chart)
```

## How to customize

```js
// create a scatterplot closure
let chart = d3.scatterplot()

// set width
chart.width(800)

// get width
let width = chart.width() /* width = 800 */

// other attributes in the API can be get/set similarly
```

## API Reference

- width: [Number]
    - get/set the width of the whole chart
    - default = 400
- height: [Number]
    - get/set the height of the whole chart
    - default = 400
- margin: [{left: Number, right: Number, top: Number, bottom: Number}]
    - get/set the margin  
    - default = {left: 50, right: 50, top: 50, bottom: 50})
- duration: [Number]
    - get/set the transition duration (ms)
    - default = 500
- xLabel: [String]
    - get/set the x axis label
    - default = "x"
- yLabel: [String]
    - get/set the y axis label
    - default = "y"
- xValueMapper: [Function]
    - get/set the access method to x value
    - default = d => d.x
- yValueMapper: [Function]
    - get/set the access method to y value
    - default = d => d.y
- colorValueMapper: [Function]
    - get/set the access method to the value that has a one-to-one mapping with the filling color
    - default = d => d.label
- rValueMapper: [Function]
    - get/set the access method to point radius
    - default = _ => 3
    - by default radius = 3 for all the points
- strokeValueMapper: [Function]
    - get/set the access method to point stroke color
    - default = _ => "black"
    - by default stroke_color = "black" for all the points
- enableBrush: [Boolean]
    - get/set whether brushing should be enabled
    - default = true
- drawLegend: [Boolean]
    - get/set whether legend should be drawn
    - default = false
