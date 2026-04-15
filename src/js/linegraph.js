// Build per-player cumulative data for a given stat field
const buildPlayerData = (data, statField) => {
  const playerMap = d3.group(data, d => d.player);
  return Array.from(playerMap, ([player, seasons]) => {
    const sorted = seasons
      .map(d => ({ ...d, year: +d.season.split("-")[0] }))
      .sort((a, b) => a.year - b.year);

    let cumulative = 0;
    const cumulativeSeasons = sorted.map((d, i) => {
      cumulative += d[statField] || 0;
      return { careerYear: i + 1, cumStat: cumulative };
    });

    return { player, seasons: cumulativeSeasons };
  });
};

// Function to draw the line graph
const drawLineGraph = (data) => {
  const playerData = buildPlayerData(data, "points");

  // Scales
  const allYears = playerData.flatMap(d => d.seasons.map(s => s.careerYear));
  const allCumStats = playerData.flatMap(d => d.seasons.map(s => s.cumStat));

  const xScale = d3.scaleLinear()
    .domain(d3.extent(allYears))
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(allCumStats)])
    .range([innerHeight, 0])
    .nice();

  // Color lookup
  const colorMap = new Map(formatsInfo.map(d => [d.id.trim(), d.color]));

  // SVG setup
  const innerChart = d3.select("#line-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
    .attr("class", "lg-inner-chart")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // X axis
  innerChart.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

  // X axis label
  innerChart.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .attr("font-size", "13px")
    .attr("fill", "#555")
    .text("Years in NBA");

  // Y axis
  innerChart.append("g")
    .attr("class", "lg-y-axis")
    .call(d3.axisLeft(yScale).tickFormat(d => d3.format(",")(d)));

  // Y axis label
  innerChart.append("text")
    .attr("class", "lg-y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -margin.left + 15)
    .attr("text-anchor", "middle")
    .attr("font-size", "13px")
    .attr("fill", "#555")
    .text("Cumulative Points");

  // Line generator
  const line = d3.line()
    .x(d => xScale(d.careerYear))
    .y(d => yScale(d.cumStat));

  // Draw lines
  innerChart.selectAll(".player-line")
    .data(playerData)
    .join("path")
    .attr("class", "player-line")
    .attr("d", d => line(d.seasons))
    .attr("fill", "none")
    .attr("stroke", d => colorMap.get(d.player.trim()) || "#ccc")
    .attr("stroke-width", 2)
    .attr("cursor", "pointer");
};
