import React, { useState, useEffect } from "react";
import { getTotalPointBuy } from "./utils/pointbuy";
import FeatListModal from "./FeatListModal";
import { featDescriptions } from "./featDescriptions";
import LanguageListModal from "./LanguageListModal";

const defaultCharacter = {
  name: "",
  race: "",
  class: "",
  background: "",
  abilityScores: {
    strength: 8,
    dexterity: 8,
    constitution: 8,
    intelligence: 8,
    wisdom: 8,
    charisma: 8,
  },
  skills: [],
  feats: [],
  weapons: [],
  equipment: "",
  classFeatures: [],
  powers: [],
  hp: 0,
  maxHp: 0,
  tempHp: 0,
  ac: 10,
  speed: 0,
  initiative: 0,
  inspiration: false,
  experience: 0,
  level: 1,
};

function calculateProficiencyBonus(level) {
  return Math.ceil(level / 4) + 1;
}

function getAbilityModifier(score) {
  return Math.floor((score - 10) / 2);
}

function CharacterForm() {
  //Initialize character state
  const [character, setCharacter] = useState(() => {
    const saved = localStorage.getItem("character");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultCharacter,
        ...parsed,
        abilityScores: {
          ...defaultCharacter.abilityScores,
          ...parsed.abilityScores,
        },
        weapons: parsed.weapons || [],
        equipment: parsed.equipment || "",
      };
    }
    return defaultCharacter;
  });  

  // Initialize statGenerationMode state from localStorage
  const [statGenerationMode, setStatGenerationMode] = useState(() => {
    const savedMode = localStorage.getItem("statGenerationMode");
    return savedMode ? savedMode : "point-buy";
  });

  //Initialize states from localStorage
  const [level, setLevel] = useState(() => {
    const savedCharacter = JSON.parse(localStorage.getItem("character"));
    return savedCharacter?.level || 1;
  });
  const [experiencePoints, setExperiencePoints] = useState(() => {
    const savedCharacter = JSON.parse(localStorage.getItem("character"));
    return savedCharacter?.experiencePoints || 0;
  });

  useEffect(() => {
    localStorage.setItem("statGenerationMode", statGenerationMode);
  }, [statGenerationMode]);
  
  const [isFeatModalOpen, setIsFeatModalOpen] = useState(false);
  const [expandedFeatModal, setExpandedFeatModal] = useState(null);
  const [expandedFeatSheet, setExpandedFeatSheet] = useState(null);
  
  const savedCharacter = JSON.parse(localStorage.getItem("character")) || {};
  const [maxHP, setMaxHP] = useState(savedCharacter.maxHP || 0);
  const [currentHP, setCurrentHP] = useState(savedCharacter.currentHP || 0);
  const [tempHP, setTempHP] = useState(savedCharacter.tempHP || 0);

  const [showStatGeneration, setShowStatGeneration] = useState(false);

  const [expandedFeatures, setExpandedFeatures] = useState([]);
  const [expandedPowers, setExpandedPowers] = useState([]);

  const toggleFeatureExpansion = (index) => {
    setExpandedFeatures((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };
  
  const togglePowerExpansion = (index) => {
    setExpandedPowers((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };
  
  const moveItem = (array, setArray, fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= array.length) return;
    const newArr = [...array];
    const [movedItem] = newArr.splice(fromIndex, 1);
    newArr.splice(toIndex, 0, movedItem);
    setArray(newArr);
  };  

  const [armorClass, setArmorClass] = useState(() => {
    const savedCharacter = JSON.parse(localStorage.getItem("character"));
    return savedCharacter?.armorClass || 10;
  });
  
  const [speed, setSpeed] = useState(() => {
    const savedCharacter = JSON.parse(localStorage.getItem("character"));
    return savedCharacter?.speed || 0;
  });
  
  const [initiative, setInitiative] = useState(() => {
    const savedCharacter = JSON.parse(localStorage.getItem("character"));
    return savedCharacter?.initiative || 0;
  });  

  const maxPoints = 27;
  const usedPoints = getTotalPointBuy(character);
  const remainingPoints = maxPoints - usedPoints;
  const standardArray = [15, 14, 13, 12, 10, 8];

  const [savingThrowProficiencies, setSavingThrowProficiencies] = useState(() => {
    const savedCharacter = JSON.parse(localStorage.getItem("character"));
    return savedCharacter?.savingThrowProficiencies || [];
  });  

  const handleSavingThrowProficiencyChange = (event) => {
    const { value, checked } = event.target;
    setSavingThrowProficiencies((prev) => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter((stat) => stat !== value);
      }
    });
  };  

  const [inspiration, setInspiration] = useState(() => {
    const savedCharacter = JSON.parse(localStorage.getItem("character"));
    return savedCharacter?.inspiration || false;
  });

  const [alignment, setAlignment] = useState(() => {
    const savedCharacter = JSON.parse(localStorage.getItem("character"));
    return savedCharacter?.alignment || "";
  });  

  const [languages, setLanguages] = useState(() => {
    const savedCharacter = JSON.parse(localStorage.getItem("character"));
    return savedCharacter?.languages || [];
  });  

  const [classFeatures, setClassFeatures] = useState(() => savedCharacter.classFeatures || []);
  const [powers, setPowers] = useState(() => savedCharacter.powers || []);

  const wisdomModifier = getAbilityModifier(character.abilityScores.wisdom);
  const proficiencyBonus = calculateProficiencyBonus(character.level);
  const isProficientInPerception = character.skills.includes("Perception");
  const passivePerception = 10 + wisdomModifier + (isProficientInPerception ? proficiencyBonus : 0);

  const skillOptions = [
    "Acrobatics",
    "Athletics",
    "Animal Handling",
    "Deception",
    "Insight",
    "Intimidation",
    "Investigation",
    "Lore",
    "Medicine",
    "Perception",
    "Performance",
    "Persuasion",
    "Piloting",
    "Stealth",
    "Survival",
    "Technology",
  ];

  const abilityMap = {
    Acrobatics: "dexterity",
    Athletics: "strength",
    "Animal Handling": "wisdom",
    Deception: "charisma",
    Insight: "wisdom",
    Intimidation: "charisma",
    Investigation: "intelligence",
    Lore: "intelligence",
    Medicine: "wisdom",
    Perception: "wisdom",
    Performance: "charisma",
    Persuasion: "charisma",
    Piloting: "dexterity",
    Stealth: "dexterity",
    Survival: "wisdom",
    Technology: "intelligence",
  };  

  const featOptions = Object.keys(featDescriptions);

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [expandedLanguage, setExpandedLanguage] = useState(null);

  const languageOptions = [
    "Binary",
    "Bith",
    "Bothese",
    "Catherese",
    "Cerean",
    "Cheunh",
    "Devaronese",
    "Dosh",
    "Durese",
    "Ewokese",
    "Galactic Basic",
    "Gamorrese",
    "Gungan",
    "Huttese",
    "Ithorese",
    "Jawaese",
    "Kel Dor",
    "Mon Cal",
    "Nautila",
    "Rodese",
    "Shyriiwook",
    "Sith",
    "Sriluurian",
    "Togruti",
    "Tusken",
    "Twi’leki",
    "Zabraki"
  ];  
  
  const languageDescriptions = {
    "Binary": "A machine language used by droids and computers. Typically sounds like beeps and whistles.",
    "Bith": "The native tongue of the Bith species, known for its precision and use in scientific discourse.",
    "Bothese": "Spoken by the Bothans, this language is sharp and quick, reflecting their cunning nature.",
    "Catherese": "A growling, guttural language spoken by the Cathar, often punctuated by roars.",
    "Cerean": "The refined language of the Cereans, featuring long vowel sounds and formal structure.",
    "Cheunh": "The complex and structured language of the Chiss, used mainly in military and diplomatic contexts.",
    "Devaronese": "A smooth, flowing language spoken by the Devaronians, known for its persuasive tone.",
    "Dosh": "A harsh and aggressive language spoken by Trandoshans, full of hissing and growls.",
    "Durese": "A trade language used across the galaxy, particularly among starship crews and spacers.",
    "Ewokese": "A tribal, high-pitched language spoken by the Ewoks, full of chirps and exclamations.",
    "Galactic Basic": "The most commonly spoken language in the galaxy, used by the majority of sentient species.",
    "Gamorrese": "The grunting and snarling tongue of the Gamorreans, difficult for non-Gamorreans to understand.",
    "Gungan": "A melodic and informal dialect spoken by the Gungans of Naboo, known for its distinct grammar.",
    "Huttese": "A common trade and criminal underworld language, often spoken by smugglers and gangsters.",
    "Ithorese": "A resonant language spoken by the Ithorians, often requiring two mouths to properly articulate.",
    "Jawaese": "The fast-paced chatter of the Jawas, filled with exclamations and nasal tones.",
    "Kel Dor": "The breathy, filtered language of the Kel Dor, often muffled by their breathing masks.",
    "Mon Cal": "A fluid and formal language used by the Mon Calamari, suitable for both diplomacy and science.",
    "Nautila": "A sonar-like, aquatic language used by the Nautolans, usually spoken underwater.",
    "Rodese": "The raspy, quick language of the Rodians, often accompanied by expressive body language.",
    "Shyriiwook": "A roaring and growling language spoken by Wookiees. Understandable to some, but unpronounceable by most non-Wookiees.",
    "Sith": "An ancient and powerful language associated with dark rituals and the Sith Order.",
    "Sriluurian": "A clicking, guttural language spoken by the Weequay people of Sriluur.",
    "Togruti": "A graceful and rhythmic language, often accompanied by subtle body gestures and head-tail movements.",
    "Tusken": "A harsh, whispered language spoken by the Sand People of Tatooine, rarely understood by outsiders.",
    "Twi’leki": "A language that blends spoken word with subtle movements of the lekku (head-tails).",
    "Zabraki": "A firm, direct language used by Zabraks, known for its brevity and impact in communication."
  };
    

  // Function to Save Character as JSON File
  const handleSaveAsJson = () => {
    if (statGenerationMode === 'point-buy') {
      const usedPoints = getTotalPointBuy(character);
      if (usedPoints > 27) {
        alert("You have exceeded the 27-point limit. Please adjust your ability scores before saving.");
        return; // prevent saving
      }
    }
    
    const characterData = {
      ...character,
      statGenerationMode,
      level,
      experiencePoints,
      maxHP,
      currentHP,
      tempHP,
      armorClass,
      speed,
      initiative,
      savingThrowProficiencies,
      inspiration,
      alignment,
      languages,
      classFeatures,
      powers,
    };
    
    const characterJson = JSON.stringify(characterData, null, 2);
     
    const blob = new Blob([characterJson], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    const fallbackName = character.name.trim() !== ""
      ? character.name
      : `Untitled - ${character.class || "Unknown Class"}`;
    link.download = `${fallbackName}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to Load Character from JSON File
  const handleLoadFromJson = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedCharacter = JSON.parse(e.target.result);
  
        setCharacter(loadedCharacter);
        setStatGenerationMode(loadedCharacter.statGenerationMode || "point-buy");
        setLevel(loadedCharacter.level || 1);
        setExperiencePoints(loadedCharacter.experiencePoints || 0);
        setMaxHP(loadedCharacter.maxHP || 0);
        setCurrentHP(loadedCharacter.currentHP || 0);
        setTempHP(loadedCharacter.tempHP || 0);
        setArmorClass(loadedCharacter.armorClass || 10);
        setSpeed(loadedCharacter.speed || 0);
        setInitiative(loadedCharacter.initiative || 0);
        setSavingThrowProficiencies(loadedCharacter.savingThrowProficiencies ?? []);
        setInspiration(loadedCharacter.inspiration || false);
        setAlignment(loadedCharacter.alignment || "");
        setLanguages(loadedCharacter.languages || []);
        setClassFeatures(loadedCharacter.classFeatures || []);
        setPowers(loadedCharacter.powers || []);

      } catch (error) {
        alert("Invalid JSON file. Please upload a valid character file.");
      }
    };
    reader.readAsText(file);
  };
  
  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCharacter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle ability score changes
  const handleAbilityChange = (event) => {
    const { name, value } = event.target;
    let num = Number(value);

    const min = statGenerationMode === 'manual' ? 3 : 8;
    const max = statGenerationMode === 'manual' ? 18 : 15;
  
    if (num < min) num = min;
    if (num > max) num = max;
    
    setCharacter((prev) => ({
      ...prev,
      abilityScores: {
        ...prev.abilityScores,
        [name]: Number(value),
      },
    }));
  };

  // Handle skill selection
  const handleSkillChange = (event) => {
    const selectedSkills = Array.from(event.target.selectedOptions, (option) => option.value);
    setCharacter((prev) => ({
      ...prev,
      skills: selectedSkills,
    }));
  };

  const handleNewCharacter = () => {
    setCharacter(defaultCharacter);
    setStandardArrayAssignments({
      strength: '',
      dexterity: '',
      constitution: '',
      intelligence: '',
      wisdom: '',
      charisma: '',
    });
    setLevel(1);
    setExperiencePoints(0);
    setMaxHP(0);
    setCurrentHP(0);
    setTempHP(0);
    setArmorClass(10);
    setSpeed(0);
    setInitiative(0);
    setSavingThrowProficiencies([]);
    setInspiration(false);
    setAlignment('');
    setLanguages([]);
    setClassFeatures([]);
    setPowers([]);
  };  
  
  useEffect(() => {
    const characterData = {
      ...character,
      level,
      experiencePoints,
      maxHP,
      currentHP,
      tempHP,
      armorClass,
      speed,
      initiative,
      savingThrowProficiencies,
      inspiration,
      alignment,
      languages,
      classFeatures,
      powers,
    };
    localStorage.setItem("character", JSON.stringify(characterData));
  }, [character, level, experiencePoints, maxHP, currentHP, tempHP, armorClass, speed, initiative,savingThrowProficiencies, inspiration, alignment, languages, classFeatures, powers]);

  const [standardArrayAssignments, setStandardArrayAssignments] = useState({
    strength: '',
    dexterity: '',
    constitution: '',
    intelligence: '',
    wisdom: '',
    charisma: '',
  });
  
  const handleStandardArrayChange = (event) => {
    const { name, value } = event.target;
    setStandardArrayAssignments((prev) => {
      // Remove the value from any other stat it's assigned to
      const updatedAssignments = Object.fromEntries(
        Object.entries(prev).map(([stat, val]) => [stat, val === value ? '' : val])
      );
      // Assign the value to the selected stat
      updatedAssignments[name] = value;
      return updatedAssignments;
    });
  };   

  useEffect(() => {
    if (statGenerationMode === 'standard-array') {
      const assignedScores = Object.values(standardArrayAssignments).filter(Boolean);
      if (assignedScores.length === 6) {
        const newAbilityScores = {};
        for (const [stat, value] of Object.entries(standardArrayAssignments)) {
          newAbilityScores[stat] = parseInt(value, 10);
        }
        setCharacter((prev) => ({
          ...prev,
          abilityScores: newAbilityScores,
        }));
      }
    } else if (statGenerationMode === 'manual') {
      setCharacter((prev) => ({
        ...prev,
        abilityScores: {
          strength: 8,
          dexterity: 8,
          constitution: 8,
          intelligence: 8,
          wisdom: 8,
          charisma: 8,
        },
      }));
    }
  }, [statGenerationMode, standardArrayAssignments]);  

//  ---------------------------------------------------------------------------------------------------------------------------------------
//  ---------------------------------------------------------------------------------------------------------------------------------------
//  ---------------------------------------------------------------------------------------------------------------------------------------

  return (
    <div>
      <h2>SW5e Character Creator</h2>

      <form className ="character-grid">
        <div className="sheet-section character-info" style={{ gridArea: "info" }}>
          <label>
            Name:
            <input type="text" name="name" value={character.name} onChange={handleChange} />
          </label>

          <label>
            Race:
            <input type="text" name="race" value={character.race} onChange={handleChange} />
          </label>

          <label>
            Class:
            <input type="text" name="class" value={character.class} onChange={handleChange} />
          </label>

          <label>
            Background:
            <input type="text" name="background" value={character.background} onChange={handleChange} />
          </label>

          <label>
            Alignment:
            <select value={alignment} onChange={(e) => setAlignment(e.target.value)}>
              <option value="">Select Alignment</option>
              <option value="Lawful Good">Lawful Light</option>
              <option value="Neutral Good">Neutral Light</option>
              <option value="Chaotic Good">Chaotic Light</option>
              <option value="Lawful Neutral">Lawful Balanced</option>
              <option value="True Neutral">Balanced Neutral</option>
              <option value="Chaotic Neutral">Chaotic Balanced</option>
              <option value="Lawful Evil">Lawful Dark</option>
              <option value="Neutral Evil">Neutral Dark</option>
              <option value="Chaotic Evil">Chaotic Dark</option>
            </select>
          </label>


          <div className="languages-column">
            <h3>Languages</h3>

            <ul className="language-sheet-list">
              {languages.length === 0 && <li>No languages selected</li>}
              {languages.map((lang, index) => (
                <li key={index} className="language-sheet-row">
                  <div className="language-sheet-header">
                    <span className="language-label">
                      {lang}
                      {languageDescriptions[lang] && (
                        <button
                          type="button"
                          className="icon-button"
                          onClick={() =>
                            setExpandedLanguage(expandedLanguage === lang ? null : lang)
                          }
                          aria-label={`View description for ${lang}`}
                        >
                          📄
                        </button>
                      )}
                    </span>
                  </div>

                  {expandedLanguage === lang && (
                    <div className="language-description">{languageDescriptions[lang]}</div>
                  )}
                </li>
              ))}
            </ul>

            <button type="button" onClick={() => setIsLanguageModalOpen(true)}>
              Browse Languages
            </button>
          </div>

        </div>
        
        <div className="sheet-section stats-hp-block" style={{ gridArea: "stats" }}>
          <div className="stats-row">
            <div className="form-group">
              <label>Level:</label>
              <select name="level" value={character.level} onChange={handleChange}>
                {Array.from({ length: 20 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Experience (XP):</label>
              <input
                type="number"
                name="experience"
                value={character.experience}
                onChange={handleChange}
                className="small-input"
              />
            </div>

            <div className="form-group inspiration-box">
              <label>Inspiration:</label>
              <input
                type="checkbox"
                name="inspiration"
                checked={character.inspiration}
                onChange={(e) =>
                  setCharacter({ ...character, inspiration: e.target.checked })
                }
              />
            </div>
          </div>

          <div className="stats-row">
            <div className="form-group">
              <label>Proficiency Bonus:</label>
              <div>+{proficiencyBonus}</div>
            </div>

            <div className="form-group">
              <label>Passive Perception:</label>
              <div>{passivePerception}</div>
            </div>
          </div>

          <div className="stats-row">
            <div className="form-group hp-group">
              <label>HP:</label>
              <div className="hp-inputs">
              <input
                type="number"
                name="hp"
                value={character.hp}
                onChange={handleChange}
                className="tiny-input"
              />
              <span> / </span>
              <input
                type="number"
                name="maxHp"
                value={character.maxHp}
                onChange={handleChange}
                className="tiny-input"
              />
              </div>
            </div>

            <div className="form-group">
              <label>Temporary HP:</label>
              <input
                type="number"
                name="tempHp"
                value={character.tempHp}
                onChange={handleChange}
                className="tiny-input"
              />
            </div>
          </div>

          <div className="stats-row">
            <div className="form-group">
              <label>Armor Class (AC):</label>
              <input
                type="number"
                name="ac"
                value={character.ac}
                onChange={handleChange}
                className="tiny-input"
              />
            </div>

            <div className="form-group">
              <label>Speed:</label>
              <input
                type="number"
                name="speed"
                value={character.speed}
                onChange={handleChange}
                className="tiny-input"
              />
            </div>

            <div className="form-group">
              <label>Initiative:</label>
              <input
                type="number"
                name="initiative"
                value={character.initiative}
                onChange={handleChange}
                className="tiny-input"
              />
            </div>
          </div>
        </div>


        <div className="sheet-section ability-scores-block" style={{ gridArea: "scores" }}>
          <h3>
            Ability Scores ({statGenerationMode === "point-buy"
              ? "Point Buy"
              : statGenerationMode === "standard-array"
              ? "Standard Array"
              : "Manual Entry"})

            <button
              type="button"
              className="stat-toggle-button"
              onClick={() => setShowStatGeneration(!showStatGeneration)}
              >
              {showStatGeneration ? '⏵' : '⏷'}
            </button>
          </h3>

          {showStatGeneration && (
            <>
              {statGenerationMode === "point-buy" && (
                <p className="points-remaining" style={{ color: remainingPoints < 0 ? "red" : "white" }}>
                  Points Remaining: {remainingPoints}
                </p>
              )}

              <label className="generation-mode-select">
                Stat Generation Method:
                <select value={statGenerationMode} onChange={(e) => setStatGenerationMode(e.target.value)}>
                  <option value="point-buy">Point Buy</option>
                  <option value="standard-array">Standard Array</option>
                  <option value="manual">Manual / Rolled</option>
                </select>
              </label>
            </>
          )}

          <div className="stats-grid">
            {Object.keys(character.abilityScores).map((stat) => (
              <label key={stat}>
                {stat.charAt(0).toUpperCase() + stat.slice(1)}:
                {statGenerationMode === 'standard-array' ? (
                  <select
                    name={stat}
                    value={standardArrayAssignments[stat]}
                    onChange={handleStandardArrayChange}
                  >
                    <option value="">Select</option>
                    {standardArray.map((score) => {
                      const isAssigned = Object.entries(standardArrayAssignments).some(
                        ([assignedStat, assignedValue]) =>
                          assignedStat !== stat && assignedValue === String(score)
                      );
                      return (
                        <option key={score} value={score} disabled={isAssigned}>
                          {score}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <>
                    <input
                      type="number"
                      name={stat}
                      value={character.abilityScores[stat]}
                      min={statGenerationMode === 'manual' ? 3 : 8}
                      max={statGenerationMode === 'manual' ? 18 : 15}
                      onChange={handleAbilityChange}
                      disabled={statGenerationMode === 'standard-array'}
                    />
                      <span className="modifier-display">
                        ({getAbilityModifier(character.abilityScores[stat]) >= 0 ? '+' : ''}
                        {getAbilityModifier(character.abilityScores[stat])})
                    </span>
                  </>
                )}
              </label>
            ))}
          </div>

            <div className="sheet-section saving-throws-block">
            <h3>Saving Throws</h3>
            <div className="saving-throw-grid">
              {Object.keys(character.abilityScores).map((stat) => {
                const mod = getAbilityModifier(character.abilityScores[stat]);
                const isProf = savingThrowProficiencies.includes(stat);
                const total = mod + (isProf ? proficiencyBonus : 0);
                return (
                  <div key={stat} className="saving-throw-row">
                    <label>
                      <input
                        type="checkbox"
                        checked={isProf}
                        onChange={(e) => handleSavingThrowProficiencyChange(e)}
                        value={stat}
                      />
                      {stat.charAt(0).toUpperCase() + stat.slice(1)}
                    </label>
                    <span className="saving-mod">{total >= 0 ? `+${total}` : total}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="sheet-section skills-column" style={{ gridArea: "skills" }}>
          <h3>Skills</h3>
          <div className="skills-list">
            {skillOptions.map((skill) => {
              const ability = abilityMap[skill];
              const modifier = getAbilityModifier(character.abilityScores[ability]);
              const total = modifier + (character.skills.includes(skill) ? proficiencyBonus : 0);
              const isProficient = character.skills.includes(skill);

              return (
                <div key={skill} className="skill-row">
                  <div className="skill-checkbox-modifier">
                    <input
                      type="checkbox"
                      checked={isProficient}
                      onChange={() => {
                        setCharacter((prev) => {
                          const updatedSkills = isProficient
                            ? prev.skills.filter((s) => s !== skill)
                            : [...prev.skills, skill];
                          return { ...prev, skills: updatedSkills };
                        });
                      }}
                    />
                    <span className="skill-modifier">{total >= 0 ? `+${total}` : total}</span>
                  </div>
                  <span className="skill-name">
                    {skill} ({ability.charAt(0).toUpperCase() + ability.slice(1)})
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="sheet-section feats-column" style={{ gridArea: "feats" }}>
          <h3>Feats</h3>

          <ul className="feat-sheet-list">
            {character.feats.length === 0 && <li>No feats selected</li>}
            {character.feats.map((feat, index) => (
              <li key={index} className="feat-sheet-row">
                <div className="feat-sheet-header">
                  <span className="feat-label">{feat}</span>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() =>
                      setExpandedFeatSheet(expandedFeatSheet === feat ? null : feat)
                    }
                    aria-label={`View description for ${feat}`}
                  >
                    📄
                  </button>
                </div>
                {expandedFeatSheet === feat && (
                  <div className="feat-description">{featDescriptions[feat]}</div>
                )}
              </li>
            ))}
          </ul>

          <button type="button" onClick={() => setIsFeatModalOpen(true)}>
            Browse Feats
          </button>
        </div>

        <div className="sheet-section equipment-block" style={{ gridArea: "equipment" }}>
          <h3>Weapons & Damage</h3>
          <div className="weapon-table">
            <div className="weapon-header">
              <span>Name</span>
              <span>Atk Bonus / DC</span>
              <span>Damage & Type</span>
              <span>Notes</span>
            </div>

            {character.weapons.map((weapon, index) => (
              <div key={index} className="weapon-row">
                <input
                  type="text"
                  value={weapon.name}
                  onChange={(e) => {
                    const updated = [...character.weapons];
                    updated[index].name = e.target.value;
                    setCharacter({ ...character, weapons: updated });
                  }}
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={weapon.attackBonus}
                  onChange={(e) => {
                    const updated = [...character.weapons];
                    updated[index].attackBonus = e.target.value;
                    setCharacter({ ...character, weapons: updated });
                  }}
                  placeholder="+X / DC Y"
                />
                <input
                  type="text"
                  value={weapon.damage}
                  onChange={(e) => {
                    const updated = [...character.weapons];
                    updated[index].damage = e.target.value;
                    setCharacter({ ...character, weapons: updated });
                  }}
                  placeholder="e.g. 2d8 kinetic"
                />
                <input
                  type="text"
                  value={weapon.notes}
                  onChange={(e) => {
                    const updated = [...character.weapons];
                    updated[index].notes = e.target.value;
                    setCharacter({ ...character, weapons: updated });
                  }}
                  placeholder="Notes"
                />
                <button type="button" className="delete-button" onClick={() => {
                  const updated = character.weapons.filter((_, i) => i !== index);
                  setCharacter({ ...character, weapons: updated });
                }}>❌</button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setCharacter({
                  ...character,
                  weapons: [...character.weapons, { name: "", attackBonus: "", damage: "", notes: "" }],
                })
              }
            >
              ➕ Add Weapon
            </button>
          </div>

          <h3>Equipment & Notes</h3>
          <textarea
            value={character.equipment}
            onChange={(e) => setCharacter({ ...character, equipment: e.target.value })}
            placeholder="List your armor, tools, consumables, etc."
            rows={4}
            className="equipment-textarea"
          />
        </div>

        <div className="features-powers-block">
          <div className="sheet-section features-column">
            <h3>Class Features</h3>
            {classFeatures.map((feature, index) => {
              const isExpanded = expandedFeatures.includes(index);
              const displayText = feature.split("\n")[0]; // First line as title

              return (
                <div key={index} className="feature-block">
                  <div className="feature-header">
                    <div className="feature-controls">
                      <button type="button" onClick={() => moveItem(classFeatures, setClassFeatures, index, index - 1)}>🔼</button>
                      <button type="button" onClick={() => moveItem(classFeatures, setClassFeatures, index, index + 1)}>🔽</button>
                      <button type="button" onClick={() => toggleFeatureExpansion(index)}>
                        {isExpanded ? "−" : "+"}
                      </button>
                    </div>
                    <span className="feature-title">{isExpanded ? "Expanded" : displayText || "Untitled"}</span>
                    <button className="delete-button" type="button" onClick={(e) => {
                      e.preventDefault();
                      const updated = [...classFeatures];
                      updated.splice(index, 1);
                      setClassFeatures(updated);
                    }}>❌</button>
                  </div>
                  {isExpanded && (
                    <textarea
                      value={feature}
                      onChange={(e) => {
                        const updated = [...classFeatures];
                        updated[index] = e.target.value;
                        setClassFeatures(updated);
                      }}
                      rows={5}
                      placeholder="Enter full feature description..."
                    />
                  )}
                </div>
              );
            })}
            <button type="button" onClick={() => setClassFeatures([...classFeatures, ""])}>Add Feature</button>
          </div>

          <div className="sheet-section powers-column" style={{ gridArea: "powers" }}>
            <h3>Powers</h3>
            {powers.map((power, index) => {
              const isExpanded = expandedPowers.includes(index);
              const displayText = power.split("\n")[0];

              return (
                <div key={index} className="feature-block">
                  <div className="feature-header">
                    <div className="feature-controls">
                      <button type="button" onClick={() => moveItem(powers, setPowers, index, index - 1)}>🔼</button>
                      <button type="button" onClick={() => moveItem(powers, setPowers, index, index + 1)}>🔽</button>
                      <button type="button" onClick={() => togglePowerExpansion(index)}>
                        {isExpanded ? "−" : "+"}
                      </button>
                    </div>
                    <span className="feature-title">{isExpanded ? "Expanded" : displayText || "Untitled"}</span>
                    <button className="delete-button" type="button" onClick={(e) => {
                      e.preventDefault();
                      const updated = [...powers];
                      updated.splice(index, 1);
                      setPowers(updated);
                    }}>❌</button>
                  </div>

                  {isExpanded && (
                    <textarea
                      value={power}
                      onChange={(e) => {
                        const updated = [...powers];
                        updated[index] = e.target.value;
                        setPowers(updated);
                      }}
                      rows={5}
                      placeholder="Enter full power description..."
                    />
                  )}
                </div>
              );
            })}
            <button type="button" onClick={() => setPowers([...powers, ""])}>Add Power</button>
          </div>
        </div>

        <div className="sheet-section button-block" style={{ gridArea: "buttons" }}>
          <button type="button" onClick={handleSaveAsJson}>Save as JSON</button>
          <input type="file" accept=".json" onChange={handleLoadFromJson} />
          <button type="button" onClick={handleNewCharacter}>New Character (Reset Form)</button>
        </div>

      </form>

      <FeatListModal
        isOpen={isFeatModalOpen}
        onClose={() => setIsFeatModalOpen(false)}
        featOptions={featOptions}
        character={character}
        setCharacter={setCharacter}
        expandedFeat={expandedFeatModal}
        setExpandedFeat={setExpandedFeatModal}
        featDescriptions={featDescriptions}
      />

      <LanguageListModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        languageOptions={languageOptions}
        selectedLanguages={languages}
        setSelectedLanguages={setLanguages}
        expandedLanguage={expandedLanguage}
        setExpandedLanguage={setExpandedLanguage}
        languageDescriptions={languageDescriptions}
      />

    </div>
  );
}

export default CharacterForm;