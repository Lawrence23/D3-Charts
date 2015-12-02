
var SegmentMargin = [30, 10, 10, 30],
    SegmentWidth = 960 - SegmentMargin[1] - SegmentMargin[3],
    SegmentHeight = 930 - SegmentMargin[0] - SegmentMargin[2];

var format = d3.format(",.0f");

var SegmentX = d3.scale.linear().range([0, SegmentWidth]),

    SegmentY = d3.scale.ordinal().rangeRoundBands([0, SegmentHeight], .1),

    SegmentxAxis = d3.svg.axis().scale(SegmentX).orient("top").tickSize(-SegmentHeight),
    
    SegmentyAxis = d3.svg.axis().scale(SegmentY).orient("left").tickSize(0);  

var color = d3.scale.category20c();

var svg = d3.select("#segment").append("svg")
    .attr("width", SegmentWidth + SegmentMargin[1] + SegmentMargin[3] +SegmentMargin[0] + SegmentMargin[2] + 100)
    .attr("height", SegmentHeight + SegmentMargin[0] + SegmentMargin[2])
    .append("g")
    .attr("transform", "translate(" + (SegmentMargin[3]+50) + "," + SegmentMargin[0] + ")");

var segTooltip = d3.select("#stacked")            
    .append('div')                             
    .attr('class', 'segTooltip');                

segTooltip.append('div')                        
    .attr('class', 'state');  

segTooltip.append('div')                        
    .attr('class', 'value');

d3.json("assets/json/segment.json", function(data) {

    data.sort(function(a, b) { return b.value - a.value; });

    // Set the scale domain.
    SegmentX.domain([0, d3.max(data, function(d) { return d.value; })]);
    SegmentY.domain(data.map(function(d) { return d.name; }));

    var bar = svg.selectAll("g.bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(0," + SegmentY(d.name) + ")"; });

    var rects = bar.append("rect")
        .attr("width", 0)
        .attr("height", SegmentY.rangeBand());
    
    rects.on('mouseover', function(d) {
        segTooltip.select('.state').html("State: " + d.name);
        segTooltip.select('.value').html("Population: " + d.value.toLocaleString());  
        segTooltip.style('display', 'block');
        segTooltip.style('background-color', color(d.value));
    });

    rects.on('mouseout', function() {
        segTooltip.style('display', 'none');
    });

    rects.on('mousemove', function(d) {
        segTooltip.style('top', (d3.event.pageY - 50) + 'px')
        .style('left', (d3.event.pageX - 50) + 'px');
    }); 
    
    rects.transition()
        .delay(function (d, i) { return i*100; })
        .attr("width", function(d) { return SegmentX(d.value); })
        .attr("fill", function(d){ return color(d.value); });

    bar.append("text")
        .attr("class", "value")
        .attr("x", function(d) { return SegmentX(d.value); })
        .attr("y", SegmentY.rangeBand() / 2)
        .attr("dx", 50)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function(d) { return format(d.value); });

    svg.append("g")
        .attr("class", "x axis")
        .call(SegmentxAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(SegmentyAxis);
});   