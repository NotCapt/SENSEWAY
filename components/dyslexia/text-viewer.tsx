"use client"

import React from 'react';
import { DyslexiaSettings, Font } from '@/types/dyslexia';

interface TextViewerProps {
  text: string;
  settings: DyslexiaSettings;
  fileName?: string;
  currentWordIndex: number | null;
}

const TextViewer: React.FC<TextViewerProps> = ({ text, settings, fileName, currentWordIndex }) => {
  const fontClass = {
    [Font.OpenDyslexic]: 'font-mono', // Using monospace as fallback for OpenDyslexic
    [Font.Verdana]: 'font-sans',
    [Font.Arial]: 'font-sans',
    [Font.OpenSans]: 'font-sans'
  };

  let wordCounter = -1;

  const highlightedText = text.split('\n').map((paragraph, pIndex) => (
    <p
      key={pIndex}
      className="mb-4 transition-opacity duration-200"
    >
      {paragraph.length === 0 && '\u00A0' /* Non-breaking space for empty lines */}
      {paragraph.split(/(\s+)/).map((segment, sIndex) => {
        if (segment.trim().length === 0) {
          // This is whitespace, render it to preserve spacing
          return <React.Fragment key={sIndex}>{segment}</React.Fragment>;
        }
        // This is a word
        wordCounter++;
        const isHighlighted = wordCounter === currentWordIndex;
        return (
          <span 
            key={sIndex} 
            className={isHighlighted ? 'rounded transition-colors duration-100' : ''}
            style={isHighlighted ? {
              backgroundColor: settings.theme === 'High Contrast' ? '#FBBF24' : '#FEF08A',
              color: settings.theme === 'High Contrast' ? '#000000' : undefined,
            } : {}}
          >
            {segment}
          </span>
        );
      })}
    </p>
  ));

  // Theme configuration with proper colors
  const getThemeStyles = () => {
    switch (settings.theme) {
      case 'Sepia':
        return {
          backgroundColor: '#FBF0D9',
          color: '#5B4636',
        };
      case 'High Contrast':
        return {
          backgroundColor: '#000000',
          color: '#FBBF24', // Yellow for high contrast
        };
      case 'Soft Blue':
        return {
          backgroundColor: '#a8c5d1',
          color: '#000000',
        };
      default: // Default
        return {
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div className="w-full max-w-4xl mx-auto">
      {fileName && (
        <h2 className="text-xl font-semibold mb-4 break-words text-foreground opacity-70">
          {fileName}
        </h2>
      )}
      <div
        className={`prose max-w-none text-viewer ${fontClass[settings.font]} ${settings.isReadingRuler ? 'reading-ruler-enabled' : ''} rounded-lg p-6 transition-colors duration-300 overflow-y-auto`}
        style={{
          fontSize: `${settings.fontSize}px`,
          lineHeight: settings.lineSpacing,
          letterSpacing: `${settings.letterSpacing}rem`,
          backgroundColor: themeStyles.backgroundColor,
          color: themeStyles.color,
          minHeight: '400px',
          maxHeight: 'calc(100vh - 200px)',
        }}
      >
        {highlightedText}
      </div>
    </div>
  );
};

export default TextViewer;