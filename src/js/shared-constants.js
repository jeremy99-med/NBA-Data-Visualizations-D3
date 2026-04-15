const margin = {top: 50, right: 30, bottom: 50, left: 70};
const width = 900;
const height = 500;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

/***********************/
/*       Colors        */
/***********************/
const formatsInfo = [
  {id: "Lebron James", label: "Lebron James", color: "#3366CC"},
  {id: "Michael Jordan", label: "Michael Jordan", color: "#CC3333"},
  {id: "Magic Johnson", label: "Magic Johnson", color: "#993399"},
  {id: "Larry Bird", label: "Larry Bird", color: "#339933"},
  {id: "Shaquille O'Neal", label: "Shaquille O'Neal", color: "#FF9900"},
  {id: "Tim Duncan", label: "Tim Duncan", color: "#7F8C8D"},
  {id: "Kevin Garnett", label: "Kevin Garnett", color: "#003366"},
  {id: "Hakeem Olajuwon ", label: "Hakeem Olajuwon", color: "#009999"},
  {id: "Steph Curry", label: "Steph Curry", color: "#FFCC00"},
  {id: "James Harden", label: "James Harden", color: "#CC6600"},
  {id: "Blake Griffin", label: "Blake Griffin", color: "#CC3399"},
  {id: "Gary Payton", label: "Gary Payton", color: "#00CC66"},
  {id: "George Gervin", label: "George Gervin", color: "#6633CC"},
  {id: "Pete Maravich", label: "Pete Maravich", color: "#99CC00"},
  {id: "Ben Wallace", label: "Ben Wallace", color: "#FF6666"},
];

/***********************/
/*    Stat Field Map   */
/***********************/
const statFieldMap = {
  "points":   "points",
  "rebounds": "rebounds",
  "assists":  "assists",
  "steals":   "steals",
  "blocks":   "blocks",
  "g":        "games",
  "3P":       "threepointers"
};

/***********************/
/*       Filters       */
/***********************/
const filters = [
  { id: "points", label: "Points", isActive: true },
  { id: "rebounds", label: "Rebounds", isActive: false },
  { id: "assists", label: "Assists", isActive: false },
  { id: "steals", label: "Steals", isActive: false },
  { id: "blocks", label: "Blocks", isActive: false },
  { id: "g" , label: "Games Played", isActive: false },
  { id: "3P", label: "3-Pointers Made", isActive: false }
];

