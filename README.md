# NBA Data Visualizations

A small D3-based web project that visualizes NBA season scoring data for several all-time great players.

## Visualizations

Both charts satisfy the expressiveness principle and leverage effective visual channels to make comparisons clear. They use position and color as primary channels, which are highly effective for encoding quantitative values and player identity.

- **Season Point Totals by Player (Line Chart)**
  - Mark: a line for each player.
  - Channels: x-position encodes years in the league, y-position encodes cumulative points, color encodes player identity.
  - Each line shows a player's cumulative point total over their NBA career.
  - Steeper lines indicate seasons of heavier scoring, while flatter segments suggest lower scoring or fewer games played.

- **Relative Scoring Share Over Time (Streamgraph)**
  - Mark: an area band for each player.
  - Channels: x-position encodes year, vertical band height encodes the player's points share, color encodes player identity.
  - The streamgraph displays each player's seasonal point totals as stacked flowing bands.
  - The width of each band shows how a player's scoring compares to the group in a given year.
  - This view makes it easy to see which players dominated particular eras.

## How to Run

The visualization is a static website located in the `src/` folder.

### Option 1: Open directly in a browser

1. Open `src/index.html` in your browser.

> Note: Some browsers block local CSV loading from `file://` URLs. If the page does not render correctly, use a local server.

### Option 2: Run a local server

From the project root (`NBA-Data-Visualizations-D3`), run one of these commands:

- With Python 3:
  ```bash
  python -m http.server 8000
  ```

- With Node.js and `http-server` (if installed):
  ```bash
  npx http-server . -p 8000
  ```

Then open the browser at:

```text
http://localhost:8000/src/index.html
```

## Project Structure

- `src/index.html` - main HTML page and visualization container.
- `src/css/` - stylesheet files for layout and visualization styling.
- `src/data/data.csv` - NBA season totals used by the charts.
- `src/js/` - D3 scripts for loading the data and drawing the charts.
  - `load-data.js` loads and parses the CSV file.
  - `linegraph.js` draws the cumulative points line chart.
  - `steamgraph.js` draws the streamgraph of seasonal scoring.
  - `draw-legend.js` draws legends for the charts.
  - `main.js` coordinates data loading and chart rendering.

## Data Source

The data is sourced from Basketball Reference and includes season totals for the players listed in the app.
