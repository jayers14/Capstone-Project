export function getPointBuyCost(score) {
    if (score < 8 || score > 15) return Infinity;
  
    const costTable = {
      8: 0,
      9: 1,
      10: 2,
      11: 3,
      12: 4,
      13: 5,
      14: 7,
      15: 9
    };
  
    return costTable[score];
  }
  
  export function getTotalPointBuy(character) {
    const { abilityScores } = character;
    return Object.values(abilityScores).reduce((total, score) => {
      return total + getPointBuyCost(score);
    }, 0);
  }  