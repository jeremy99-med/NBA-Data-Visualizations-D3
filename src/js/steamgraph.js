// Build pivoted data for a given stat field
const buildPivotedData = (data, statField) => {
  const years = [...new Set(data.map(d => +d.season.split("-")[0]))].sort((a, b) => a - b);
  return years.map(year => {
    const obj = { year };
    formatsInfo.forEach(f => { obj[f.id] = 0; });
    data
      .filter(d => +d.season.split("-")[0] === year)
      .forEach(d => { obj[d.player] = d[statField] || 0; });
    return obj;
  });
};

// Function to draw the stream graph
const drawStreamGraph = (data) => {
  const colorMap = new Map(formatsInfo.map(f => [f.id, f.color]));

  const svg = d3
    .select("#stream-graph")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const innerChart = svg
    .append("g")
    .attr("class", "sg-inner-chart")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const years = [...new Set(data.map(d => +d.season.split("-")[0]))].sort((a, b) => a - b);
  const pivotedData = buildPivotedData(data, "points");

  const xScale = d3.scaleBand().domain(years).range([0, innerWidth]).padding(0);

  const stackGenerator = d3
    .stack()
    .keys(formatsInfo.map(f => f.id))
    .order(d3.stackOrderDescending)
    .offset(d3.stackOffsetSilhouette);

  const annotatedData = stackGenerator(pivotedData);

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

  innerChart
    .append("g")
    .attr("class", "areas-container")
    .selectAll("path")
    .data(annotatedData)
    .join("path")
    .attr("d", areaGenerator)
    .attr("fill", d => colorMap.get(d.key));

  innerChart.append("g")
    .attr("class", "sg-y-axis")
    .call(d3.axisLeft(yScale));

  innerChart
    .append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(
      d3.axisBottom(xScale)
        .tickValues(d3.range(1970, 2026, 5))
        .tickSizeOuter(0)
    );

  innerChart.append("text")
    .attr("class", "sg-y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -margin.left + 15)
    .attr("text-anchor", "middle")
    .attr("font-size", "13px")
    .attr("fill", "#555")
    .text("Points");

  innerChart.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .attr("font-size", "13px")
    .attr("fill", "#555")
    .text("Year");

  // --- Tooltip ---
  const sgTooltip = innerChart
    .append("g")
    .attr("class", "sg-tooltip")
    .style("display", "none");

  sgTooltip
    .append("line")
    .attr("y1", 0)
    .attr("y2", innerHeight)
    .attr("stroke", "#494e4f")
    .attr("stroke-width", 1.5)
    .attr("stroke-dasharray", "6 4");

  const sgTooltipBox = sgTooltip.append("g").attr("class", "sg-tooltip-box");

  const sgTooltipBg = sgTooltipBox
    .append("rect")
    .attr("rx", 4)
    .attr("fill", "white")
    .attr("fill-opacity", 0.92)
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1);

  const sgTooltipContent = sgTooltipBox
    .append("text")
    .style("font-size", "12px")
    .style("font-family", "Roboto, sans-serif")
    .style("fill", "#494e4f");

  // Transparent overlay captures mouse events across the entire chart area
  innerChart
    .append("rect")
    .attr("class", "sg-mouse-overlay")
    .attr("width", innerWidth)
    .attr("height", innerHeight)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("mousemove", (e) => {
      const [mouseX] = d3.pointer(e);

      // Find the nearest year using the band scale step
      const idx = Math.max(0, Math.min(Math.floor(mouseX / xScale.step()), years.length - 1));
      const year = years[idx];
      const xPos = xScale(year) + xScale.bandwidth() / 2;

      // Get the currently active stat
      const activeFilter = sgFilters.find(f => f.isActive);
      const statField = statFieldMap[activeFilter.id];

      // Look up each player's value for this year, sorted descending
      const yearRows = data.filter(d => +d.season.split("-")[0] === year);
      const entries = formatsInfo
        .map(f => {
          const row = yearRows.find(d => d.player === f.id);
          return { name: f.label, value: row ? (row[statField] || 0) : 0, color: f.color };
        })
        .filter(e => e.value > 0)
        .sort((a, b) => b.value - a.value);

      // Position the vertical line
      sgTooltip.style("display", null).attr("transform", `translate(${xPos}, 0)`);

      // Rebuild tooltip text
      sgTooltipContent.selectAll("*").remove();
      sgTooltipContent
        .append("tspan")
        .attr("x", 10)
        .attr("y", 20)
        .style("font-weight", 700)
        .style("font-size", "13px")
        .text(year);

      entries.forEach(entry => {
        sgTooltipContent
          .append("tspan")
          .attr("x", 10)
          .attr("dy", 17)
          .text(`${entry.name}: ${d3.format(",.0f")(entry.value)}`);
      });

      // Size the background rect to fit the content
      const boxW = 195;
      const boxH = 20 + entries.length * 17 + 10;
      sgTooltipBg.attr("width", boxW).attr("height", boxH);

      // Flip the box to the left when near the right edge
      const flip = xPos + boxW + 15 > innerWidth;
      sgTooltipBox.attr("transform", `translate(${flip ? -(boxW + 10) : 10}, 0)`);
    })
    .on("mouseleave", () => {
      sgTooltip.style("display", "none");
    });
};
