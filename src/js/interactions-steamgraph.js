// Independent filter state for the steamgraph
const sgFilters = filters.map(f => ({ ...f, isActive: f.id === "points" }));

/*************************************/
/*  Create and populate the filters  */
/*************************************/
const populateSgFilters = (data) => {

  d3.select("#filters-sg")
    .selectAll(".filter")
    .data(sgFilters)
    .join("button")
      .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
      .text(d => d.label)
      .on("click", (_, d) => {

        if (!d.isActive) {

          sgFilters.forEach(f => { f.isActive = f.id === d.id; });

          d3.select("#filters-sg").selectAll(".filter")
            .classed("active", f => f.id === d.id);

          updateSteamGraph(d.id, data);

        }

      });

};

/****************************/
/*  Update the steam graph  */
/****************************/
const updateSteamGraph = (filterId, data) => {

  const pivotedData = buildPivotedData(data, statFieldMap[filterId]);

  const stackGenerator = d3
    .stack()
    .keys(formatsInfo.map(f => f.id))
    .order(d3.stackOrderDescending)
    .offset(d3.stackOffsetSilhouette);

  const annotatedData = stackGenerator(pivotedData);

  const years = [...new Set(data.map(d => +d.season.split("-")[0]))].sort((a, b) => a - b);
  const xScale = d3.scaleBand().domain(years).range([0, innerWidth]).padding(0);

  const minDomain = d3.min(annotatedData, s => d3.min(s, d => d[0]));
  const maxDomain = d3.max(annotatedData, s => d3.max(s, d => d[1]));

  const yScale = d3
    .scaleLinear()
    .domain([minDomain, maxDomain])
    .range([innerHeight, 0])
    .nice();

  const areaGenerator = d3
    .area()
    .x(d => xScale(d.data.year) + xScale.bandwidth() / 2)
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]))
    .curve(d3.curveCatmullRom);

  const label = filters.find(f => f.id === filterId).label;

  d3.select("#stream-graph .sg-y-axis")
    .transition().duration(500)
    .call(d3.axisLeft(yScale));

  d3.select("#stream-graph .sg-y-axis-label")
    .text(label);

  d3.select("#stream-graph .areas-container").selectAll("path")
    .data(annotatedData)
    .transition().duration(500)
      .attr("d", areaGenerator);

};
