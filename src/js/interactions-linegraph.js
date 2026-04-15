/*************************************/
/*  Create and populate the filters  */
/*************************************/
const populateFilters = (data) => {

  d3.select("#filters-lg")
    .selectAll(".filter")
    .data(filters)
    .join("button")
      .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
      .text(d => d.label)
      .on("click", (_, d) => {

        if (!d.isActive) {

          filters.forEach(f => { f.isActive = f.id === d.id; });

          d3.select("#filters-lg").selectAll(".filter")
            .classed("active", f => f.id === d.id);

          updateLineGraph(d.id, data);

        }

      });

};

/****************************/
/*   Update the line graph  */
/****************************/
const updateLineGraph = (filterId, data) => {

  const playerData = buildPlayerData(data, statFieldMap[filterId]);

  const allYears    = playerData.flatMap(d => d.seasons.map(s => s.careerYear));
  const allCumStats = playerData.flatMap(d => d.seasons.map(s => s.cumStat));

  const xScale = d3.scaleLinear()
    .domain(d3.extent(allYears))
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(allCumStats)])
    .range([innerHeight, 0])
    .nice();

  const line = d3.line()
    .x(d => xScale(d.careerYear))
    .y(d => yScale(d.cumStat));

  const label = filters.find(f => f.id === filterId).label;

  d3.select("#line-chart .lg-y-axis")
    .transition().duration(500)
    .call(d3.axisLeft(yScale).tickFormat(d => d3.format(",")(d)));

  d3.select("#line-chart .lg-y-axis-label")
    .text("Cumulative " + label);

  d3.select("#line-chart .lg-inner-chart").selectAll(".player-line")
    .data(playerData)
    .transition().duration(500)
      .attr("d", d => line(d.seasons));

};

/****************************/
/*    Linegraph Tooltip     */
/****************************/
const tooltipWidth = 130;
const tooltipHeight = 30;

const createTooltip = () => {

  const innerChart = d3.select(".lg-inner-chart");

  const tooltip = innerChart
    .append("g")
    .attr("class", "lg-tooltip")
    .style("opacity", 0)
    .style("pointer-events", "none");

  tooltip
    .append("rect")
    .attr("width", tooltipWidth)
    .attr("height", tooltipHeight)
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("fill", "#2c2c3e")
    .attr("fill-opacity", 0.85);

  tooltip
    .append("text")
    .attr("x", tooltipWidth / 2)
    .attr("y", tooltipHeight / 2 + 1)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("fill", "white")
    .style("font-weight", 700)
    .style("font-size", "12px");

};

const handleMouseEvents = () => {

  const innerChart = d3.select(".lg-inner-chart");

  innerChart.selectAll(".player-line")
    .on("mouseenter", (event, d) => {

      d3.select(".lg-tooltip text").text(d.player);

      const [mx, my] = d3.pointer(event, innerChart.node());
      const tx = Math.min(mx - tooltipWidth / 2, innerWidth - tooltipWidth);
      const ty = Math.max(my - tooltipHeight - 8, 0);

      d3.select(".lg-tooltip")
        .attr("transform", `translate(${tx}, ${ty})`)
        .transition().duration(200)
        .style("opacity", 1);

    })
    .on("mouseleave", () => {

      d3.select(".lg-tooltip")
        .transition().duration(200)
        .style("opacity", 0);

    });

};
