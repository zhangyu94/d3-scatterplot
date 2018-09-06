//last modified 2018.9.5 16:59
//dependency:
//d3.js version 5.7.0

(function (root, factory) {
    const libName = "scatterplot"
    if (typeof define === "function" && define.amd) {
        // AMD 
        define(libName, ["d3"], factory);
    } else if (typeof exports === "object") {
        // Node, CommonJS
        module.exports = factory(require("d3"))
    } else {
        // Browser globals (root is window)
        // register scatterplot to d3
        root.d3 = root.d3 || {};
        root.d3[libName] = factory(root.d3)
    }
})(this, function (d3) {
    let scatterplot = function () {
        let width = 400,
            height = 400,
            margin = {
                top: 50,
                right: 50,
                bottom: 50,
                left: 50
            },
            duration = 500,
            yTickNum = null,
            xTickNum = null,
            xLabel = "x",
            yLabel = "y",
            xValueMapper = d => d.x,
            yValueMapper = d => d.y,
            colorValueMapper = d => d.label,
            rMapper = _ => 3,
            strokeMapper = _ => "black",
            drawLegend = false,
            enableBrush = true

        function chart(selection) {
            selection.each(function (data) {
                const innerWidth = width - margin.left - margin.right
                const innerHeight = height - margin.top - margin.bottom

                let x = d3.scaleLinear()
                    .range([0, innerWidth])
                x.domain(d3.extent(data, xValueMapper)).nice()
                let y = d3.scaleLinear()
                    .range([innerHeight, 0])
                y.domain(d3.extent(data, yValueMapper)).nice()

                const colorValues = [...new Set(data.map(ele => colorValueMapper(ele)))].sort((ele1, ele2) => ele1 - ele2)
                
                let color = (function (colorValues) {
                    /*
                    const nColors = Math.min(20, colorValues.length);
                    const scaler = d3.scaleLinear()
                        .domain([1, nColors + 1])
                        .range([0, 1]);
                    let colors = []
                    //let colors = ['grey']
                    for (let i = 1; i <= nColors; ++i) colors.push(d3.interpolateRainbow(scaler(i)))
                    */
                    let colors = d3.schemeCategory10
                    return d3.scaleOrdinal(colors).domain(colorValues)
                })(colorValues)
                
                let svg = d3.select(this)
                    .attr("width", width)
                    .attr("height", height)

                // enter, update for g
                let g = svg.selectAll(".container")
                    .data([null])
                    .enter().append("g")
                    .attr("class", "container")
                svg.selectAll(".container").transition()
                    .duration(duration)
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                g = svg.selectAll(".container")

                // draw x axis
                let xAxis = d3.axisBottom(x)
                if (xTickNum !== null)
                    xAxis.ticks(xTickNum)
                let updateXAxisG = g.selectAll(".x.axis")
                    .data([null])
                let enterXAxisG = updateXAxisG.enter()
                    .append("g")
                    .attr("class", "x axis")
                g.selectAll(".x.axis").transition()
                    .duration(duration)
                    .attr("transform", "translate(0," + innerHeight + ")")
                    .call(xAxis)
                enterXAxisG.selectAll(".x.label")
                    .data([null])
                    .enter()
                    .append("text")
                    .attr("class", "x label")
                    .attr("dy", "2.5em")
                    .attr("dx", "0em")
                    .attr("x", innerWidth)
                    .attr("fill", "black")
                    .style("font", "10px sans-serif")
                g.selectAll(".x.axis").selectAll("text")
                    .text(xLabel)

                // draw y axis
                let yAxis = d3.axisLeft(y)
                if (yTickNum !== null)
                    yAxis.ticks(yTickNum)
                let updateYAxisG = g.selectAll(".y.axis")
                    .data([null])
                let enterYAxisG = updateYAxisG.enter()
                    .append("g")
                    .attr("class", "y axis")
                g.selectAll(".y.axis").transition()
                    .duration(duration)
                    .call(yAxis)
                enterYAxisG.selectAll(".y.label")
                    .data([null])
                    .enter()
                    .append("text")
                    .attr("class", "y label")
                    .attr("transform", "rotate(-90)")
                    .attr("dy", "-3.5em")
                    .attr("fill", "black")
                    .style("font", "10px sans-serif")
                g.selectAll(".y.axis").selectAll("text")
                    .text(yLabel)

                // draw dots
                let dots = g.selectAll(".dot")
                    .data(data)
                dots.enter().append("circle")
                    .attr("class", "dot")
                dots.exit().remove()
                g.selectAll(".dot").transition()
                    .duration(duration)
                    .attr("r", rMapper)
                    .attr("cx", d => x(xValueMapper(d)))
                    .attr("cy", d => y(yValueMapper(d)))
                    .style("stroke", strokeMapper)
                    .style("stroke-width", "2px")
                    .style("fill", d => color(colorValueMapper(d)));

                if (drawLegend) {
                    let legend = svg.selectAll(".legend")
                        .data(color.domain())
                    let legendG = legend.enter().append("g")
                        .attr("class", "legend")
                    legendG.append("rect")
                        .attr("width", 18)
                        .attr("height", 18)
                    legendG.append("text")
                        .attr("y", 9)
                        .attr("dy", ".35em")
                        .style("text-anchor", "end")
                    legend.exit().remove()
                        
                    legend = svg.selectAll('.legend')
                        .attr("transform", (_, i) => "translate(0," + i * 20 + ")")
                    legend.select("rect")
                        .attr("x", width - margin.left)
                        .style("fill", color);
                    legend.select("text")
                        .attr("x", width - 6 - margin.left)
                        .text(d => d);
                }

                if (enableBrush) {
                    let zoom = function () {
                        let t = g.transition().duration(750);
                        //let t = scatter.transition().duration(750);
                        svg.select(".x.axis").transition(t).call(xAxis);
                        svg.select(".y.axis").transition(t).call(yAxis);
                        g.selectAll(".dot").transition(t)
                            //scatter.selectAll(".dot").transition(t)
                            .attr("cx", d => x(xValueMapper(d)))
                            .attr("cy", d => y(yValueMapper(d)));
                    }

                    let brushEnded = function () {
                        if (d3.event.sourceEvent.type === "end")
                            return

                        let extent = d3.event.selection
                        if (!extent) {
                            x.domain(d3.extent(data, xValueMapper)).nice();
                            y.domain(d3.extent(data, yValueMapper)).nice();
                        } else {
                            x.domain([extent[0][0], extent[1][0]].map(x.invert, x));
                            y.domain([extent[1][1], extent[0][1]].map(y.invert, y));
                            g.select(".brush").call(brush.move, null);
                        }
                        zoom()
                    }

                    let brush = d3.brush()
                        .extent([
                            [0, 0],
                            [innerWidth, innerHeight]
                        ])
                        .on("end", brushEnded)
                    g.selectAll(".brush")
                        .data([null])
                        .enter().append("g")
                        .attr("class", "brush")
                    g.select(".brush").call(brush)
                }
            })
        }

        chart.width = function (value) {
            if (!arguments.length) return width
            console.assert(typeof (value) === "number", "invalid width", value)
            width = value
            return chart
        }

        chart.height = function (value) {
            if (!arguments.length) return height
            console.assert(typeof (value) === "number", "invalid height", value)
            height = value
            return chart
        }

        chart.margin = function (value) {
            if (!arguments.length) return margin
            console.assert(typeof (value) === "object", "invalid margin", value)
            if (typeof (value.top) === "number")
                margin.top = value.top
            if (typeof (value.right) === "number")
                margin.right = value.right
            if (typeof (value.bottom) === "number")
                margin.bottom = value.bottom
            if (typeof (value.left) === "number")
                margin.left = value.left
            return chart
        }

        chart.duration = function (value) {
            if (!arguments.length) return duration
            console.assert(typeof (value) === "number", "invalid duration", value)
            duration = value
            return chart
        }

        chart.yTickNum = function (value) {
            if (!arguments.length) return yTickNum
            console.assert(typeof (value) === "number", "invalid yTickNum", value)
            yTickNum = value
            return chart
        }

        chart.xTickNum = function (value) {
            if (!arguments.length) return xTickNum
            console.assert(typeof (value) === "number", "invalid xTickNum", value)
            xTickNum = value
            return chart
        }

        chart.xLabel = function (value) {
            if (!arguments.length) return xLabel
            console.assert(typeof (value) === "string", "invalid xLabel", value)
            xLabel = value
            return chart
        }

        chart.yLabel = function (value) {
            if (!arguments.length) return yLabel
            console.assert(typeof (value) === "string", "invalid yLabel", value)
            yLabel = value
            return chart
        }

        chart.drawLegend = function (value) {
            if (!arguments.length) return drawLegend
            console.assert(typeof (value) === "boolean", "invalid drawLegend", value)
            drawLegend = value
            return chart
        }

        chart.enableBrush = function (value) {
            if (!arguments.length) return enableBrush
            console.assert(typeof (value) === "boolean", "invalid enableBrush", value)
            enableBrush = value
            return chart
        }

        chart.xValueMapper = function (value) {
            if (!arguments.length) return xValueMapper
            console.assert(typeof (value) === "function", "invalid xValueMapper", value)
            xValueMapper = value
            return chart
        }

        chart.yValueMapper = function (value) {
            if (!arguments.length) return yValueMapper
            console.assert(typeof (value) === "function", "invalid yValueMapper", value)
            yValueMapper = value
            return chart
        }

        chart.colorValueMapper = function (value) {
            if (!arguments.length) return colorValueMapper
            console.assert(typeof (value) === "function", "invalid colorValueMapper", value)
            colorValueMapper = value
            return chart
        }

        chart.rMapper = function (value) {
            if (!arguments.length) return rMapper
            console.assert(typeof (value) === "function", "invalid rMapper", value)
            rMapper = value
            return chart
        }

        chart.strokeMapper = function (value) {
            if (!arguments.length) return strokeMapper
            console.assert(typeof (value) === "function", "invalid strokeMapper", value)
            strokeMapper = value
            return chart
        }

        

        return chart
    }
    return scatterplot
})
