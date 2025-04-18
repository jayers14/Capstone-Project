import React from "react";
import "./FeatListModal.css";

const FeatListModal = ({
  isOpen,
  onClose,
  featOptions,
  character,
  setCharacter,
  expandedFeat,
  setExpandedFeat,
  featDescriptions
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Select Feats</h3>
          <button className="close-button" onClick={onClose}>✖</button>
        </div>

        <ul className="feat-modal-list">
          {featOptions.map((feat) => (
            <li key={feat} className="feat-row">
              <div className="feat-row-top">
                <label className="feat-label">
                  <input
                    type="checkbox"
                    checked={character.feats.includes(feat)}
                    onChange={() => {
                      const newFeats = character.feats.includes(feat)
                        ? character.feats.filter(f => f !== feat)
                        : [...character.feats, feat];
                      setCharacter({ ...character, feats: newFeats });
                    }}
                  />
                  {feat}
                </label>
                <button
                  type="button"
                  className="dropdown-button"
                  onClick={() => setExpandedFeat(expandedFeat === feat ? null : feat)}
                  aria-label={`View description for ${feat}`}
                >
                  ⌄
                </button>
              </div>

              {expandedFeat === feat && (
                <div className="feat-description">{featDescriptions[feat]}</div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeatListModal;
