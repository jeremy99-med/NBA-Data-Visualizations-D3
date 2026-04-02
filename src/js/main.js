loadData().then(data => {
  console.log("data", data);
  drawLineGraph(data);
  drawLegend("#line-chart");
  drawStreamGraph(data);
  drawLegend("#stream-graph");
});
