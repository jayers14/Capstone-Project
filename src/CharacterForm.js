import React, { useState, useEffect } from "react";
import { getTotalPointBuy } from "./utils/pointbuy";

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
    return saved ? JSON.parse(saved) : defaultCharacter;
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
  
  const savedCharacter = JSON.parse(localStorage.getItem("character")) || {};
  const [maxHP, setMaxHP] = useState(savedCharacter.maxHP || 0);
  const [currentHP, setCurrentHP] = useState(savedCharacter.currentHP || 0);
  const [tempHP, setTempHP] = useState(savedCharacter.tempHP || 0);

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

  const wisdomModifier = getAbilityModifier(character.abilityScores.wisdom);
  const proficiencyBonus = calculateProficiencyBonus(level);
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

  const featOptions = [
    "Force Sensitive",
    "Martial Adept",
    "Sharpshooter",
    "Tough",
    "Weapon Expert",
  ];

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
  
  // Function to Save Character as JSON File
  const handleSaveAsJson = () => {
    const usedPoints = getTotalPointBuy(character);
    if (usedPoints > 27) {
      alert("You have exceeded the 27-point limit. Please adjust your ability scores before saving.");
      return; // prevent saving
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

  // Handle feat selection
  const handleFeatChange = (event) => {
    const selectedFeats = Array.from(event.target.selectedOptions, (option) => option.value);
    setCharacter((prev) => ({
      ...prev,
      feats: selectedFeats,
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
    };
    localStorage.setItem("character", JSON.stringify(characterData));
  }, [character, level, experiencePoints, maxHP, currentHP, tempHP, armorClass, speed, initiative,savingThrowProficiencies, inspiration, alignment, languages]);    

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
  

  return (
    <div>
      <h3>Character Creator</h3>
      <form>
        <label>
          Name:
          <input type="text" name="name" value={character.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Race:
          <input type="text" name="race" value={character.race} onChange={handleChange} />
        </label>
        <br />
        <label>
          Class:
          <input type="text" name="class" value={character.class} onChange={handleChange} />
        </label>
        <br />

        <label>
          Level:
          <select
            name="level"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
          >
            {Array.from({ length: 20 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
        <br />

        <label>
          Background:
          <input type="text" name="background" value={character.background} onChange={handleChange} />
        </label>
        <br />

        <label>
          Alignment:
          <select value={alignment} onChange={(e) => setAlignment(e.target.value)}>
            <option value="">Select Alignment</option>
            <option value="Lawful Good">Lawful Good</option>
            <option value="Neutral Good">Neutral Good</option>
            <option value="Chaotic Good">Chaotic Good</option>
            <option value="Lawful Neutral">Lawful Neutral</option>
            <option value="True Neutral">True Neutral</option>
            <option value="Chaotic Neutral">Chaotic Neutral</option>
            <option value="Lawful Evil">Lawful Evil</option>
            <option value="Neutral Evil">Neutral Evil</option>
            <option value="Chaotic Evil">Chaotic Evil</option>
          </select>
        </label>
        <br />

        <label>
          Languages:
          <select multiple={true} value={languages} onChange={(e) => {
            const selectedLanguages = Array.from(e.target.selectedOptions, (option) => option.value);
            setLanguages(selectedLanguages);
          }}>
            {languageOptions.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </label>
        <br />

        <label>
          Experience Points:
          <input
            type="number"
            name="experiencePoints"
            value={experiencePoints}
            min="0"
            onChange={(e) => setExperiencePoints(Number(e.target.value))}
          />
        </label>
        <br />

        <label>
          Inspiration:
          <input
            type="checkbox"
            checked={inspiration}
            onChange={(e) => setInspiration(e.target.checked)}
          />
        </label>
        <br /><br></br>

        <label>
          HP:
          <input
            type="number"
            name="currentHP"
            value={currentHP}
            min="0"
            max={maxHP}
            onChange={(e) => {
              const value = Number(e.target.value);
              setCurrentHP(value > maxHP ? maxHP : value);
            }}
            style={{ width: '60px', marginRight: '5px' }}
          />
          /
          <input
            type="number"
            name="maxHP"
            value={maxHP}
            min="1"
            onChange={(e) => {
              const value = Number(e.target.value);
              setMaxHP(value);
              if (currentHP > value) {
                setCurrentHP(value);
              }
            }}
            style={{ width: '60px', marginLeft: '5px' }}
          />
        </label>

        <br />
        <label>
          Temporary HP:
          <input
            type="number"
            name="tempHP"
            value={tempHP}
            min="0"
            onChange={(e) => setTempHP(Number(e.target.value))}
          />
        </label>
        <br /><br></br>

        <label>
          Proficiency Bonus: {calculateProficiencyBonus(level)}
        </label>
        <br /><br></br>

        <label>
          Passive Perception: {passivePerception}
        </label>
        <br />

        <h3>
          Ability Scores ({statGenerationMode === "point-buy"
            ? "Point Buy"
            : statGenerationMode === "standard-array"
            ? "Standard Array"
            : "Manual Entry"})
        </h3>

        {statGenerationMode === "point-buy" && (
          <p style={{ color: remainingPoints < 0 ? "red" : "white" }}>
            Points Remaining: {remainingPoints}
          </p>
        )}

       <label>
          Stat Generation Method:
          <select value={statGenerationMode} onChange={(e) => setStatGenerationMode(e.target.value)}>
            <option value="point-buy">Point Buy</option>
            <option value="standard-array">Standard Array</option>
            <option value="manual">Manual / Rolled</option>
          </select>
        </label>

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
              <input
                type="number"
                name={stat}
                value={character.abilityScores[stat]}
                min={statGenerationMode === 'manual' ? 3 : 8}
                max={statGenerationMode === 'manual' ? 18 : 15}
                onChange={handleAbilityChange}
                disabled={statGenerationMode === 'standard-array'}
              />
            )}
          </label>
        ))}
        <br />

        <h3>Saving Throw Proficiencies</h3>
        {Object.keys(character.abilityScores).map((stat) => (
          <label key={stat}>
            <input
              type="checkbox"
              value={stat}
              checked={savingThrowProficiencies.includes(stat)}
              onChange={handleSavingThrowProficiencyChange}
            />
            {stat.charAt(0).toUpperCase() + stat.slice(1)}
          </label>
        ))}
        <br /><br></br>

        <h3>Saving Throw Modifiers</h3>
        <ul>
          {Object.keys(character.abilityScores).map((stat) => {
            const modifier = getAbilityModifier(character.abilityScores[stat]);
            const totalModifier = modifier + (savingThrowProficiencies.includes(stat) ? proficiencyBonus : 0);
            return (
              <li key={stat}>
                {stat.charAt(0).toUpperCase() + stat.slice(1)}: {totalModifier >= 0 ? '+' : ''}{totalModifier}
              </li>
            );
          })}
        </ul>

        <label>
          Armor Class (AC):
          <input
            type="number"
            name="armorClass"
            value={armorClass}
            min="0"
            onChange={(e) => setArmorClass(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Speed:
          <input
            type="number"
            name="speed"
            value={speed}
            min="0"
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Initiative:
          <input
            type="number"
            name="initiative"
            value={initiative}
            onChange={(e) => setInitiative(Number(e.target.value))}
          />
        </label>
        <br />

        <h3>Skills</h3>
        <label>
          Select Skills:
          <select multiple={true} value={character.skills} onChange={handleSkillChange}>
            {skillOptions.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </label>
        <br />

        <h3>Feats</h3>
        <label>
          Select Feats:
          <select multiple={true} value={character.feats} onChange={handleFeatChange}>
            {featOptions.map((feat) => (
              <option key={feat} value={feat}>
                {feat}
              </option>
            ))}
          </select>
        </label>
        <br />

        {/* Save and Load Buttons */}
        <button type="button" onClick={handleSaveAsJson}>Save as JSON</button>
        <input type="file" accept=".json" onChange={handleLoadFromJson} />
        <button type="button" onClick={handleNewCharacter}>New Character (Reset Form)</button>

      </form>

      {/* <h3>Character Data Preview (Live State)</h3>
      <pre>{JSON.stringify(character, null, 2)}</pre> */}
    </div>
  );
}

export default CharacterForm;