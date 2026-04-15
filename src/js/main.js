loadData().then(data => {
  console.log("data", data);
  drawLineGraph(data);
  createTooltip();
  handleMouseEvents();
  populateFilters(data);
  drawLegend("#line-chart");
  drawStreamGraph(data);
  populateSgFilters(data);
  drawLegend("#stream-graph");
});
