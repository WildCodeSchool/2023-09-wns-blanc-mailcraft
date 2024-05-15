import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const TextStyle = dynamic(() => import('@/components/TextStyle/TextStyle'), { ssr: false });

const RessourcesPage: React.FC = () => {
  const [content, setContent] = useState('Ressources');
  const [styles, setStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    fontSize: '',
    fontFamily: '',
    textAlign: ''
  });

  const applyStyle = (style: string, value?: string) => {
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
      </div>
    </>
  );
};

export default RessourcesPage;