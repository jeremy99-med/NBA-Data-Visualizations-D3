// Function to draw the line graph
const drawLineGraph = (data) => {
  // Group by player and compute cumulative points per season
  const playerMap = d3.group(data, d => d.player);

  const playerData = Array.from(playerMap, ([player, seasons]) => {
    const sorted = seasons
      .map(d => ({ ...d, year: +d.season.split("-")[0] }))
      .sort((a, b) => a.year - b.year);

    let cumulative = 0;
    const cumulativeSeasons = sorted.map(d => {
      cumulative += d.points;
      return { year: d.year, cumPoints: cumulative };
    });

    return { player, seasons: cumulativeSeasons };
  });

  // Scales
  const allYears = playerData.flatMap(d => d.seasons.map(s => s.year));
  const allCumPoints = playerData.flatMap(d => d.seasons.map(s => s.cumPoints));

  const xScale = d3.scaleLinear()
    .domain(d3.extent(allYears))
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(allCumPoints)])
    .range([innerHeight, 0])
    .nice();

  // Color lookup (trim to handle any whitespace in formatsInfo ids)
  const colorMap = new Map(formatsInfo.map(d => [d.id.trim(), d.color]));

  // SVG setup
  const svg = d3.select("#line-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // X axis
  svg.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

  // Y axis
  svg.append("g")
    .call(d3.axisLeft(yScale).tickFormat(d => d3.format(",")(d)));

  // Y axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -margin.left + 15)
    .attr("text-anchor", "middle")
    .attr("font-size", "13px")
    .attr("fill", "#555")
    .text("Cumulative Points");

  // Line generator
  const line = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.cumPoints));

  // Draw lines
  const lines = svg.selectAll(".player-line")
    .data(playerData)
    .join("path")
    .attr("class", "player-line")
    .attr("d", d => line(d.seasons))
    .attr("fill", "none")
    .attr("stroke", d => colorMap.get(d.player.trim()) || "#ccc")
    .attr("stroke-width", 2)
    .attr("cursor", "pointer");

};
