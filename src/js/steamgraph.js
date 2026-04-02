// Function to draw the stream graph
const drawStreamGraph = (data) => {
  // Generate the streamgraph here

  /*******************************/
  /*    Append the containers    */
  /*******************************/
  const colorMap = new Map(formatsInfo.map((f) => [f.id, f.color]));

  const svg = d3
    .select("#stream-graph")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const years = [...new Set(data.map((d) => +d.season.split("-")[0]))].sort(
    (a, b) => a - b
  );

  const pivotedData = years.map((year) => {
    const obj = { year };
    formatsInfo.forEach((f) => {
      obj[f.id] = 0;
    });
    data
      .filter((d) => +d.season.split("-")[0] === year)
      .forEach((d) => {
        obj[d.player] = d.points;
      });
    return obj;
  });

  const xScale = d3.scaleBand().domain(years).range([0, innerWidth]).padding(0);

  const stackGenerator = d3
    .stack()
    .keys(formatsInfo.map((f) => f.id))
    .order(d3.stackOrderDescending)
    .offset(d3.stackOffsetSilhouette);

  const annotatedData = stackGenerator(pivotedData);

  const minLowerBoundaries = [];
  const maxUpperBoundaries = [];

  annotatedData.forEach((series) => {
    minLowerBoundaries.push(d3.min(series, (d) => d[0]));
    maxUpperBoundaries.push(d3.max(series, (d) => d[1]));
  });

  const minDomain = d3.min(minLowerBoundaries);
  const maxDomain = d3.max(maxUpperBoundaries);

  const yScale = d3
    .scaleLinear()
    .domain([minDomain, maxDomain])
    .range([innerHeight, 0])
    .nice();

  const areaGenerator = d3
    .area()
    .x((d) => xScale(d.data.year) + xScale.bandwidth() / 2)
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]))
    .curve(d3.curveCatmullRom);

  innerChart
    .append("g")
    .attr("class", "areas-container")
    .selectAll("path")
    .data(annotatedData)
    .join("path")
    .attr("d", areaGenerator)
    .attr("fill", (d) => colorMap.get(d.key));

  const leftAxis = d3.axisLeft(yScale);
  innerChart.append("g").call(leftAxis);

  const bottomAxis = d3
    .axisBottom(xScale)
    .tickValues(d3.range(1970, 2026, 5))
    .tickSizeOuter(0);

  innerChart
    .append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(bottomAxis);

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(margin.top + innerHeight / 2))
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .attr("font-size", "13px")
    .attr("fill", "#555")
    .text("Points");

  innerChart
    .append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .attr("font-size", "13px")
    .attr("fill", "#555")
    .text("Year");
};
