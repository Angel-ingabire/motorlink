import React, { useState } from "react";

const languages = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" }
];

function LanguageSelector() {
  const [lang, setLang] = useState("en");
  return (
    <select
      className="border rounded px-2 py-1 text-sm"
      value={lang}
      onChange={e => setLang(e.target.value)}
      aria-label="Select language"
    >
      {languages.map(l => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
}

export default LanguageSelector;
