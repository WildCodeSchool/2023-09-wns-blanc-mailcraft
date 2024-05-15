import React, { useState } from 'react';
import TextStyle from '@/components/TextDesign/TextStyle';
import TextColor from '@/components/TextDesign/TextColor';

const RessourcesPage: React.FC = () => {
  const [content, setContent] = useState('Ressources');
  const [styles, setStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    fontSize: '',
    fontFamily: '',
    textAlign: '',
    color: ''
  });

  const applyStyle = (style: string, value?: string | boolean) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      [style]: value !== undefined ? value : !prevStyles[style],
    }));
  };

  const getStyledContent = () => {
    let styledContent = content;
    if (styles.bold) styledContent = `<b>${styledContent}</b>`;
    if (styles.italic) styledContent = `<i>${styledContent}</i>`;
    if (styles.underline) styledContent = `<u>${styledContent}</u>`;

    const styleString = `
      ${styles.fontSize ? `font-size: ${styles.fontSize};` : ''}
      ${styles.fontFamily ? `font-family: ${styles.fontFamily};` : ''}
      ${styles.textAlign ? `text-align: ${styles.textAlign};` : ''}
      ${styles.color ? `color: ${styles.color};` : ''}
    `;

    return `<span style="${styleString}">${styledContent}</span>`;
  };

  return (
    <>
      <div>
        <h1 dangerouslySetInnerHTML={{ __html: getStyledContent() }} />
        <TextStyle
          onBold={() => applyStyle('bold')}
          onItalic={() => applyStyle('italic')}
          onUnderline={() => applyStyle('underline')}
          onFontSizeChange={(size) => applyStyle('fontSize', size)}
          onFontFamilyChange={(family) => applyStyle('fontFamily', family)}
          onJustify={(align) => applyStyle('textAlign', align)}
        />
        <TextColor
          onColorChange={(color) => applyStyle('color', color)}
        />
      </div>
    </>
  );
};

export default RessourcesPage;
