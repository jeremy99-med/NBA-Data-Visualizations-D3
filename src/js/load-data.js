// Load and parse NBA season data
const loadData = () => {
  return d3.csv("./data/data.csv", d => {
    return {
      player: d.Player,
      season: d.Season,
      points: +d.PTS,
      assists: +d.AST,
      rebounds: +d.TRB,
      games: +d.G,
      threepointers: +d["3P"]
    };
  });
};
