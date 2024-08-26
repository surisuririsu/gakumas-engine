import { PItems, SkillCards } from "gakumas-data";
import StageEngine from "./engine/StageEngine.js";

const P_ITEMS = [112, 101, 73, 71].map(PItems.getById);
const SKILL_CARDS = [309, 311, 36, 35, 164, 145, 260, 35, 111, 85, 162].map(
  SkillCards.getById
);

const stageEngine = new StageEngine(
  10,
  { vocal: 15, dance: 45, visual: 40 },
  { vocal: 1180, dance: 870, visual: 929, stamina: 39 },
  0.0156,
  P_ITEMS,
  SKILL_CARDS
);

stageEngine.start();
