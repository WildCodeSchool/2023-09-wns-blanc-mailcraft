import React, { useState } from 'react';
import { ColorResult } from '@uiw/color-convert';
import { Sketch } from '@uiw/react-color';

interface TextColorProps {
  onColorChange: (color: string) => void;
}

const TextColor: React.FC<TextColorProps> = ({ onColorChange }) => {
  const [hex, setHex] = useState("#fff");

  const handleChange = (color: ColorResult) => {
    setHex(color.hex);
    onColorChange(color.hex);
  };

  return (
    <Sketch
      style={{ marginLeft: 20 }}
      color={hex}
      onChange={handleChange}
    />
  );
};

export default TextColor;
