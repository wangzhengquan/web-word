import React, { useRef } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Undo, Redo, Heading1, Heading2, Type,
  Sparkles, Baseline, Highlighter, Image as ImageIcon
} from 'lucide-react';
import { EditorActionType } from '../types';

interface EditorToolbarProps {
  onAction: (type: EditorActionType, value?: string) => void;
  onAIToggle: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onAction, onAIToggle }) => {
  
  const Button: React.FC<{ 
    action?: EditorActionType; 
    value?: string;
    icon: React.ReactNode; 
    title: string;
    onClick?: () => void;
    className?: string;
  }> = ({ action, value, icon, title, onClick, className }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent losing focus from editor
        if (onClick) onClick();
        else if (action) onAction(action, value);
      }}
      className={`p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors ${className || ''}`}
    >
      {icon}
    </button>
  );

  const ColorPickerButton: React.FC<{
    action: EditorActionType;
    icon: React.ReactNode;
    title: string;
    defaultColor: string;
  }> = ({ action, icon, title, defaultColor }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <div className="relative inline-flex">
        <button
          type="button"
          title={title}
          onMouseDown={(e) => {
            e.preventDefault();
            inputRef.current?.click();
          }}
          className="p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors"
        >
          {icon}
        </button>
        <input
          ref={inputRef}
          type="color"
          defaultValue={defaultColor}
          onChange={(e) => onAction(action, e.target.value)}
          className="absolute w-0 h-0 opacity-0 overflow-hidden bottom-0 left-0"
          tabIndex={-1}
        />
      </div>
    );
  };

  const ImageUploadButton: React.FC<{
    onImageSelected: (base64: string) => void;
  }> = ({ onImageSelected }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            onImageSelected(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
      // Reset input so same file can be selected again if needed
      if (inputRef.current) inputRef.current.value = '';
    };

    return (
       <div className="relative inline-flex">
        <button
          type="button"
          title="Insert Image"
          onMouseDown={(e) => {
            e.preventDefault();
            inputRef.current?.click();
          }}
          className="p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <ImageIcon size={18} />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  };

  const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1" />;

  return (
    <div className="sticky top-0 z-10 bg-brand-50 border-b border-gray-200 px-4 py-2 flex flex-wrap items-center gap-1 shadow-sm select-none">
      
      {/* History */}
      <div className="flex gap-1">
        <Button action={EditorActionType.UNDO} icon={<Undo size={18} />} title="Undo" />
        <Button action={EditorActionType.REDO} icon={<Redo size={18} />} title="Redo" />
      </div>
      
      <Divider />

      {/* Text Style */}
      <div className="flex gap-1">
        <Button action={EditorActionType.FORMAT_BLOCK} value="P" icon={<Type size={18} />} title="Normal Text" />
        <Button action={EditorActionType.FORMAT_BLOCK} value="H1" icon={<Heading1 size={18} />} title="Heading 1" />
        <Button action={EditorActionType.FORMAT_BLOCK} value="H2" icon={<Heading2 size={18} />} title="Heading 2" />
      </div>

      <Divider />

      {/* Formatting */}
      <div className="flex gap-1">
        <Button action={EditorActionType.BOLD} icon={<Bold size={18} />} title="Bold" />
        <Button action={EditorActionType.ITALIC} icon={<Italic size={18} />} title="Italic" />
        <Button action={EditorActionType.UNDERLINE} icon={<Underline size={18} />} title="Underline" />
        <Button action={EditorActionType.STRIKETHROUGH} icon={<Strikethrough size={18} />} title="Strikethrough" />
        
        {/* Color Pickers */}
        <ColorPickerButton 
          action={EditorActionType.FORE_COLOR} 
          defaultColor="#000000"
          icon={<Baseline size={18} />} 
          title="Text Color" 
        />
        <ColorPickerButton 
          action={EditorActionType.HILITE_COLOR} 
          defaultColor="#FFFF00"
          icon={<Highlighter size={18} />} 
          title="Highlight Color" 
        />
      </div>

      <Divider />

      {/* Alignment */}
      <div className="flex gap-1 hidden sm:flex">
        <Button action={EditorActionType.JUSTIFY_LEFT} icon={<AlignLeft size={18} />} title="Align Left" />
        <Button action={EditorActionType.JUSTIFY_CENTER} icon={<AlignCenter size={18} />} title="Align Center" />
        <Button action={EditorActionType.JUSTIFY_RIGHT} icon={<AlignRight size={18} />} title="Align Right" />
        <Button action={EditorActionType.JUSTIFY_FULL} icon={<AlignJustify size={18} />} title="Justify" />
      </div>

      <Divider />

      {/* Lists */}
      <div className="flex gap-1">
        <Button action={EditorActionType.INSERT_UNORDERED_LIST} icon={<List size={18} />} title="Bullet List" />
        <Button action={EditorActionType.INSERT_ORDERED_LIST} icon={<ListOrdered size={18} />} title="Numbered List" />
      </div>

      <Divider />

      {/* Insert Media */}
      <div className="flex gap-1">
         <ImageUploadButton onImageSelected={(url) => onAction(EditorActionType.INSERT_IMAGE, url)} />
      </div>

      <div className="flex-grow" />
      
      {/* AI Action */}
      <button
        onClick={onAIToggle}
        className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium text-sm"
      >
        <Sparkles size={16} className="animate-pulse" />
        <span>Gemini AI</span>
      </button>
    </div>
  );
};

export default EditorToolbar;