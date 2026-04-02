// Draws a color legend below the given container element.
// containerId: the CSS selector / id of the chart container div (e.g. "#line-chart")
const drawLegend = (containerId) => {
  const cols = 5;
  const itemWidth = 170;
  const itemHeight = 24;
  const swatchSize = 12;
  const swatchGap = 8;   // gap between swatch and label
  const rowGap = 6;
  const padX = margin.left;
  const padY = 12;

  const rows = Math.ceil(formatsInfo.length / cols);
  const legendWidth = width;
  const legendHeight = rows * (itemHeight + rowGap) + padY * 2;

  const svg = d3.select(containerId)
    .append("svg")
    .attr("viewBox", `0 0 ${legendWidth} ${legendHeight}`)
    .attr("class", "legend-svg");

  const g = svg.append("g")
    .attr("transform", `translate(${padX}, ${padY})`);

  const items = g.selectAll(".legend-item")
    .data(formatsInfo)
    .join("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      return `translate(${col * itemWidth}, ${row * (itemHeight + rowGap)})`;
    });

  items.append("rect")
    .attr("width", swatchSize)
    .attr("height", swatchSize)
    .attr("y", (itemHeight - swatchSize) / 2)
    .attr("rx", 2)
    .attr("fill", d => d.color);

  items.append("text")
    .attr("x", swatchSize + swatchGap)
    .attr("y", itemHeight / 2)
    .attr("dominant-baseline", "middle")
    .attr("font-family", "Roboto, sans-serif")
    .attr("font-size", "13px")
    .attr("fill", "#333")
    .text(d => d.label);
};
