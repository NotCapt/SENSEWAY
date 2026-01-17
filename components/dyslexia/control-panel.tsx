"use client"

import React from 'react';
import { DyslexiaSettings, Theme, Font } from '@/types/dyslexia';
import { FilePlusIcon, FontSizeIcon, PaletteIcon, PlayIcon, PauseIcon, RulerIcon, SpacingIcon } from './icons';
import { Button } from '@/components/ui/button';

interface ControlPanelProps {
  settings: DyslexiaSettings;
  onSettingsChange: <K extends keyof DyslexiaSettings>(setting: K, value: DyslexiaSettings[K]) => void;
  onTextToSpeech: () => void;
  isSpeaking: boolean;
  onNewFile: () => void;
  hasContent: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  settings, 
  onSettingsChange, 
  onTextToSpeech,
  isSpeaking,
  onNewFile,
  hasContent
}) => {
  return (
    <aside className="w-full md:w-80 bg-card border-r border-border p-6 flex flex-col space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Reading Controls</h2>
        <Button onClick={onNewFile} variant="outline" size="sm">
          <FilePlusIcon className="w-4 h-4" />
          <span>New File</span>
        </Button>
      </div>

      <Button
        onClick={onTextToSpeech}
        disabled={!hasContent}
        variant={isSpeaking ? "destructive" : "default"}
        className="w-full"
      >
        {isSpeaking ? <PauseIcon className="w-5 h-5 mr-2" /> : <PlayIcon className="w-5 h-5 mr-2" />}
        <span>{isSpeaking ? 'Stop Reading' : 'Read Aloud'}</span>
      </Button>

      {/* Font Size */}
      <div className="space-y-2">
        <label htmlFor="font-size" className="flex items-center text-sm font-medium text-foreground">
          <FontSizeIcon className="w-5 h-5 mr-2" /> Font Size: {settings.fontSize}px
        </label>
        <input
          id="font-size"
          type="range"
          min="12"
          max="48"
          value={settings.fontSize}
          onChange={(e) => onSettingsChange('fontSize', parseInt(e.target.value, 10))}
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Font Family */}
      <div className="space-y-2">
        <label htmlFor="font-family" className="text-sm font-medium text-foreground">Font Style</label>
        <select
          id="font-family"
          value={settings.font}
          onChange={(e) => onSettingsChange('font', e.target.value as Font)}
          className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        >
          {Object.values(Font).map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>

      {/* Color Theme */}
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-foreground">
          <PaletteIcon className="w-5 h-5 mr-2"/> Color Theme
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(Theme).map(theme => (
            <button
              key={theme}
              onClick={() => onSettingsChange('theme', theme)}
              className={`px-3 py-2 text-sm rounded-md border-2 transition ${
                settings.theme === theme 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-border hover:border-primary/50'
              }`}
              style={
                theme === Theme.Default ? { backgroundColor: '#FFFFFF', color: '#374151' } :
                theme === Theme.Sepia ? { backgroundColor: '#FBF0D9', color: '#5B4636' } :
                theme === Theme.HighContrast ? { backgroundColor: '#000000', color: '#FBBF24' } :
                { backgroundColor: '#a8c5d1', color: '#000000' }
              }
            >
              {theme}
            </button>
          ))}
        </div>
      </div>
      
      {/* Spacing */}
      <div className="space-y-4">
        <h3 className="flex items-center text-sm font-medium text-foreground">
          <SpacingIcon className="w-5 h-5 mr-2" /> Spacing
        </h3>
        <div className="space-y-2">
          <label htmlFor="line-spacing" className="text-xs text-muted-foreground">
            Line Spacing: {settings.lineSpacing.toFixed(1)}
          </label>
          <input
            id="line-spacing"
            type="range"
            min="1.2"
            max="3.0"
            step="0.1"
            value={settings.lineSpacing}
            onChange={(e) => onSettingsChange('lineSpacing', parseFloat(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="letter-spacing" className="text-xs text-muted-foreground">
            Letter Spacing: {settings.letterSpacing.toFixed(2)}rem
          </label>
          <input
            id="letter-spacing"
            type="range"
            min="0"
            max="0.5"
            step="0.01"
            value={settings.letterSpacing}
            onChange={(e) => onSettingsChange('letterSpacing', parseFloat(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Reading Ruler */}
      <div className="flex items-center justify-between">
        <label htmlFor="reading-ruler" className="flex items-center text-sm font-medium text-foreground">
          <RulerIcon className="w-5 h-5 mr-2"/> Reading Ruler
        </label>
        <button
          onClick={() => onSettingsChange('isReadingRuler', !settings.isReadingRuler)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
            settings.isReadingRuler ? 'bg-primary' : 'bg-secondary'
          }`}
        >
          <span className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
            settings.isReadingRuler ? 'translate-x-6' : 'translate-x-1'
          }`}/>
        </button>
      </div>
    </aside>
  );
};

export default ControlPanel;