import React from "react";
import "./LanguageListModal.css";

const LanguageListModal = ({
  isOpen,
  onClose,
  languageOptions,
  selectedLanguages,
  setSelectedLanguages,
  expandedLanguage,
  setExpandedLanguage,
  languageDescriptions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="language-modal-overlay">
      <div className="language-modal-content">
        <div className="modal-header">
          <h3>Select Languages</h3>
          <button className="language-close-button" onClick={onClose}>✖</button>
        </div>
        <ul className="language-modal-list">
          {languageOptions.map((lang) => (
            <li key={lang} className="language-row">
                <div className="language-row-top">
                    <label className="language-label">
                        <input
                        type="checkbox"
                        checked={selectedLanguages.includes(lang)}
                        onChange={() => {
                            const updated = selectedLanguages.includes(lang)
                            ? selectedLanguages.filter((l) => l !== lang)
                            : [...selectedLanguages, lang];
                            setSelectedLanguages(updated);
                        }}
                        />
                        {lang}
                    </label>
                    {languageDescriptions[lang] && (
                        <button
                        className="language-icon-button"
                        type="button"
                        onClick={() =>
                            setExpandedLanguage(expandedLanguage === lang ? null : lang)
                        }
                        >
                        📄
                        </button>
                    )}
                    </div>
            
                {expandedLanguage === lang && (
                <div className="language-description">
                    {languageDescriptions[lang]}
                </div>
                )}
            </li> 
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LanguageListModal;
