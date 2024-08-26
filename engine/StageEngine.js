class StageEngine {
  constructor(
    turnCount,
    criteria,
    parameters,
    supportBonus,
    pItems,
    skillCards
  ) {
    this.turnCount = turnCount;
    this.turnTypes = this.generateTurnTypes(turnCount, criteria);
    this.typeMultipliers = this.calculateTypeMultipliers(
      criteria,
      parameters,
      supportBonus
    );
    this.pItems = pItems;
    this.skillCards = skillCards;
    console.log(this.turnTypes, this.typeMultipliers);
  }

  generateTurnTypes(turnCount, criteria) {
    const TURN_TYPE_COUNTS = {
      8: [4, 2, 2],
      10: [5, 3, 2],
      12: [5, 4, 3],
    };

    const VALID_FIRST_TURNS = {
      8: [0],
      10: [0, 1],
      12: [0, 1],
    };

    const sortedTypes = Object.keys(criteria).sort(
      (a, b) => criteria[b] - criteria[a]
    );
    const typeCounts = TURN_TYPE_COUNTS[turnCount];
    while (true) {
      const randomTurns = Array.from(
        [0, 1, 2].map((t) => `${t}`.repeat(typeCounts[t] - 1)).join("")
      )
        .map((t) => parseInt(t, 10))
        .sort(() => 0.5 - Math.random());
      if (VALID_FIRST_TURNS[turnCount].includes(randomTurns[0])) {
        return randomTurns.concat([2, 1, 0]).map((t) => sortedTypes[t]);
      }
    }
  }

  calculateTypeMultipliers(criteria, parameters, supportBonus) {
    const BASE_TYPE_MULTIPLIER_CONSTANTS = [700, 400, 250];

    const sortedTypes = Object.keys(criteria).sort(
      (a, b) => criteria[b] - criteria[a]
    );
    return Object.keys(criteria).reduce((acc, cur) => {
      const isOverThreshold = parameters[cur] > criteria[cur] * 22.8;
      const coefficient = isOverThreshold
        ? 0.674 - (0.003 * criteria[cur]) / 100
        : 1;
      const constant =
        BASE_TYPE_MULTIPLIER_CONSTANTS[sortedTypes.indexOf(cur)] +
        (isOverThreshold ? 7.5 * criteria[cur] : 0);
      acc[cur] = Math.ceil(
        (parameters[cur] * coefficient + constant) * (1 + supportBonus)
      );
      return acc;
    }, {});
  }

  start() {
    this.deckCards = this.skillCards
      .slice()
      .sort((card) => (card.forceInitialHand ? 1 : 0.5 - Math.random()));
    this.handCards = [];
    this.discardedCards = [];
    this.removedCards = [];
    this.score = 0;
    this.turnsElapsed = 0;
    this.turnsRemaining = this.turnCount;
    this.activeEffects = [];

    this.pItems.forEach((pItem) => {
      this.setEffects(pItem.effects);
    });

    console.log(this.deckCards, this.activeEffects);
  }

  startTurn() {}

  drawCard() {
    if (!this.deckCards.length) {
      this.recycleDiscards();
    }
    this.handCards.push(this.deckCards.pop());
  }

  recycleDiscards() {
    this.deckCards = this.discardedCards
      .slice()
      .sort(() => 0.5 - Math.random());
    this.discardedCards = [];
  }

  setEffects(effects) {
    for (let effect of effects) {
      this.activeEffects.push(effect);
    }
  }

  applyEffects(effects) {
    let skipNextEffect = false;
    for (let effect of effects) {
      if (skipNextEffect) {
        skipNextEffect = false;
        continue;
      }
      if (effect.phase) {
        this.activeEffects.push(effect);
        continue;
      }
      if (effect.conditions) {
        for (let condition of effect.conditions) {
          if (!this.evaluateCondition(condition)) {
            if (!effect.actions) {
              skipNextEffect = true;
            }
            continue;
          }
        }
      }
      if (effect.actions) {
        for (let action of effect.actions) {
          this.performAction(action);
        }
      }
    }
  }

  evaluateCondition() {}

  performAction() {}
}

export default StageEngine;
