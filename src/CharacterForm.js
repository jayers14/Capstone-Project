import React, { useState } from "react";

function CharacterForm() {
  const [character, setCharacter] = useState({
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
  });

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

  // Function to Save Character as JSON File
  const handleSaveAsJson = () => {
    const characterData = JSON.stringify(character, null, 2);
    const blob = new Blob([characterData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${character.name || "character"}.json`;
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

  return (
    <div>
      <h2>Character Creator</h2>
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
          Background:
          <input type="text" name="background" value={character.background} onChange={handleChange} />
        </label>
        <br />

        <h3>Ability Scores (Point-Buy Default: 8)</h3>
        {Object.keys(character.abilityScores).map((stat) => (
          <label key={stat}>
            {stat.charAt(0).toUpperCase() + stat.slice(1)}:
            <input type="number" name={stat} value={character.abilityScores[stat]} onChange={handleAbilityChange} />
          </label>
        ))}
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
      </form>

      <h3>Character Data Preview (Live State)</h3>
      <pre>{JSON.stringify(character, null, 2)}</pre>
    </div>
  );
}

export default CharacterForm;
