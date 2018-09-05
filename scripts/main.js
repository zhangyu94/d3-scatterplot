let main = function () {

	//let data = [{x: 10, y: 10}, {x: 20, y: 15}, {x: 30, y: 0}]
	
	let data = []
	for (let i = 0; i <= 50; ++i) {
		data.push({
			x: d3.randomUniform(0, 100)(), 
			y: d3.randomUniform(0, 100)(), 
			label: Math.round(d3.randomUniform(0, 3)())
		})
	}
	
	let chart = d3.scatterplot()
		.drawLegend(true)

	let svg = d3.select('body').append('svg')

	svg.datum(data)
		.call(chart)
}