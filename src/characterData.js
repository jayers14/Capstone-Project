// Character data structure
const characterTemplate = {
    name: "",  
    race: "",  // Character's race (Human, Twi'lek, etc.)
    class: "", // Character's class (Jedi, Scoundrel, etc.)
    background: "", // Character’s background (Bounty Hunter, Outlaw, etc.)
    abilityScores: {
      strength: 8,
      dexterity: 8,
      constitution: 8,
      intelligence: 8,
      wisdom: 8,
      charisma: 8
    },
    skills: [], //List of chosen skills
    feats:[], // chosen feats
  };
  
  // Export the character template for use in other files
  export default characterTemplate;
  