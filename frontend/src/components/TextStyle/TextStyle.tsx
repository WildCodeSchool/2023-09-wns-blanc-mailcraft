import React from 'react';

interface StyleButtonsProps {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onFontSizeChange: (size: string) => void;
  onFontFamilyChange: (family: string) => void;
  onJustify: (justify: string) => void;
}

const StyleButtons: React.FC<StyleButtonsProps> = ({ onBold, onItalic, onUnderline, onFontSizeChange, onFontFamilyChange, onJustify }) => {
  return (
    <div>
    <button onClick={onBold}>Bold</button>
    <button onClick={onItalic}>Italic</button>
    <button onClick={onUnderline}>Underline</button>
    <select onChange={(e) => onFontSizeChange(e.target.value)}>
      <option value="16px">16px</option>
      <option value="20px">20px</option>
      <option value="24px">24px</option>
      <option value="32px">32px</option>
    </select>
    <select onChange={(e) => onFontFamilyChange(e.target.value)}>
      <option value="Arial">Arial</option>
      <option value="Courier New">Courier New</option>
      <option value="Georgia">Georgia</option>
      <option value="Times New Roman">Times New Roman</option>
      <option value="Verdana">Verdana</option>
    </select>
    <button onClick={() => onJustify('left')}>Left</button>
    <button onClick={() => onJustify('center')}>Center</button>
    <button onClick={() => onJustify('right')}>Right</button>
  </div>
  );
};

export default StyleButtons;
