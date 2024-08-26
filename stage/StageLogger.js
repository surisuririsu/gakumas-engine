import { DEBUG, GRAPHED_FIELDS } from "./constants";

export default class StageLogger {
  constructor() {
    this.disabled = false;
    this.clear();
  }

  disable() {
    this.disabled = true;
  }

  enable() {
    this.disabled = false;
  }

  log(logType, data) {
    if (this.disabled) return;
    this.logs.push({ logType, data });
  }

  debug(...args) {
    if (!DEBUG || this.disabled) return;
    console.log(...args);
  }

  pushGraphData(state) {
    if (this.disabled) return;
    for (let field of GRAPHED_FIELDS) {
      this.graphData[field].push(state[field]);
    }
  }

  clear() {
    this.logs = [];
    this.graphData = GRAPHED_FIELDS.reduce((acc, cur) => {
      acc[cur] = [];
      return acc;
    }, {});
  }
}
