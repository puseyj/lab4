const h=500
const w=500

const margin = ({top: h/20, right: w/20, bottom: h/20, left: w/20})
const height =h - margin.top- margin.bottom;
const width = w - margin.right- margin.left;



const tooltip = d3.select("tooltip")
    .style("display","none")
    .style('opacity',0)
    .style("width",width/20+"px")
    .style("height",height/20+'px')									
    .style("font", height/50+"px")	
    .append("text")
    .text("hello")
    

const deriveRadius = population => Math.sqrt(population/Math.PI)/1000

const filterPop = datum=> datum.sort(function(a, b) {return d3.descending(a.Population, b.Population)});

const svgNorm = d3.select(".norm_graph").append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



const plotCircle_norm = wh2014 => {
    
    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(wh2014,function(d) {
            return d.Income;
        }))
        .range([0,width])

    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(wh2014,function(d) {
            return d.LifeExpectancy;
        }).reverse())
        .range([0,height])

    const rScale =d3
        .scaleLinear()
        .domain(d3.extent(wh2014,function(d) {
            return d.Population;
        }))
        .range([width/125, 4*width/100])
        

    const colorScale = d3.scaleOrdinal()
        .domain([function(d) {
        d.Region
        }])
        .range(d3.schemeTableau10)
    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5,"s");

    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(7);

    const elems = svgNorm.selectAll()
        .data(wh2014)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${ xScale(d.Income)},${yScale(d.LifeExpectancy)})`)

    const circles = elems
        .append('circle')
        .attr('r', d => rScale(d.Population))
        .style("opacity", .65)
        .style("stroke",'black' )
        .style("fill", function(d){
            return colorScale(d.Region)})
        .on("mouseenter", (event, d) => {
            const pos = d3.pointer(event, window);
            d3.select(".tooltip")

            .style("left",pos[0]+'px')
            .style("top",pos[1]+'px')
            .style("display","block")
            .html("Country: "+d.Country + "<br/>" +"Life Expectancy: "+ d.LifeExpectancy + "<br/>" +"Income: " + d3.format(",")(d.Income) + "<br/>" + "Population: " + d3.format(",")(d.Population) + "<br/>" +"Region: " + d.Region)

            })

        .on("mouseleave", (event, d) => {
            d3.select(".tooltip")
            .style("display","none")
            });

    svgNorm.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(${0}, ${height})`)
        .call(xAxis);
    
    svgNorm.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${0},${0})`)
        .call(yAxis);


    svgNorm.append("text")
        .attr('x', 1/2*margin.left)
        .attr('y', 1/3*margin.top)
        .attr('writing-mode','vertical-lr')
        .attr('font-size', height/40)
        .text("Life Expectancy")

    svgNorm.append("text")
        .attr('x',width-2*margin.right)
        .attr('y', height-1/2*margin.bottom)
        .attr('font-size', height/40)
        .text("Income")
    

    const legend = svgNorm.selectAll()
        
        .data(new Set(d3.map(wh2014,function(d){
            return d.Region
        })))
        .enter()
        .append("g")
        .attr("transform", function(d,i){
        return `translate(${6/10*width}, ${3/4*height+i*(height/40+2)})`;
        })
    const rectangles = legend
        .append("rect")
        .attr('class','bar')
        .attr('width', width/40)
        .attr('height', height/40)
        .style("fill", function(d,i){
            return colorScale(d)
        })
        
    const text = legend
        .append("text")
        .attr("dy",height/40-2)
        .attr("dx",width/40+2)
        .attr('font-size', height/40-2)
        .text(function(d){
            return d

        })
        
}

d3.csv('wealth-health-2014.csv', d3.autoType)
    .then(d => {
        filterPop(d)
        plotCircle_norm(filterPop(d))  
})
