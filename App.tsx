import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FileText, Download, Share2, Save } from 'lucide-react';
import EditorToolbar from './components/EditorToolbar';
import AIAssistant from './components/AIAssistant';
import { EditorActionType } from './types';

const App: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [docTitle, setDocTitle] = useState("Untitled Document");
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [editorContent, setEditorContent] = useState(""); // Used for context extraction
  const [selectedText, setSelectedText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Initialize editor
  useEffect(() => {
    if (editorRef.current) {
      // Set initial content if needed
      const initialContent = "<p>Start typing your document here...</p>";
      if (editorRef.current.innerHTML === "") {
         editorRef.current.innerHTML = initialContent;
         setEditorContent(editorRef.current.innerText);
      }
    }
    // Simulating a save
    setLastSaved(new Date());
  }, []);

  // Handle input metrics
  const handleInput = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || "";
      setEditorContent(text);
      setWordCount(text.trim().split(/\s+/).filter(w => w.length > 0).length);
      setCharCount(text.length);
    }
  };

  // Handle selection changes for AI context
  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      setSelectedText(selection.toString());
    } else {
      setSelectedText("");
    }
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  // Execute toolbar command
  const executeCommand = (command: EditorActionType, value?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleInput(); // Update state after format change
  };

  // Handle AI Insertion
  const handleAIInsert = (text: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    // If there is a selection, replace it. If not, insert at cursor.
    if (selectedText) {
        document.execCommand('insertText', false, text);
    } else {
        // Simple append if no cursor focus (fallback) or insert at cursor
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
             document.execCommand('insertText', false, text);
        } else {
            // Append to end if focus lost
            editorRef.current.innerHTML += `<p>${text}</p>`;
        }
    }
    handleInput();
  };

  const handleSave = () => {
      setLastSaved(new Date());
      // In a real app, this would call an API
      alert("Document saved locally!");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      
      {/* Header / Navbar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-brand-600 p-2 rounded-lg shadow-sm">
            <FileText className="text-white" size={24} />
          </div>
          <div>
            <input 
              type="text" 
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="text-lg font-semibold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-brand-500 focus:outline-none transition-colors w-64"
            />
            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
              <span>File</span>
              <span>•</span>
              <span>Edit</span>
              <span>•</span>
              <span>View</span>
              <span>•</span>
              <span>Help</span>
              {lastSaved && <span className="ml-2 text-green-600">Saved {lastSaved.toLocaleTimeString()}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors" title="Save">
            <Save size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors" title="Export">
            <Download size={20} />
          </button>
          <button className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium shadow-sm hover:bg-brand-700 transition-colors flex items-center gap-2">
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* Formatting Toolbar */}
      <EditorToolbar 
        onAction={executeCommand} 
        onAIToggle={() => setIsAIModalOpen(true)} 
      />

      {/* Main Workspace */}
      <main className="flex-grow overflow-y-auto bg-gray-100 p-8 relative" onClick={() => {
          // Focus editor if clicking outside (optional UX choice)
          // editorRef.current?.focus(); 
      }}>
        
        {/* The "Page" */}
        <div 
            className="bg-white w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-paper p-[20mm] mb-8 outline-none editor-content"
            ref={editorRef}
            contentEditable={true}
            onInput={handleInput}
            role="textbox"
            spellCheck={true}
            suppressContentEditableWarning={true}
            style={{
                cursor: 'text'
            }}
        >
        </div>

      </main>

      {/* Status Bar */}
      <footer className="bg-white border-t border-gray-200 px-4 py-1 flex justify-between items-center text-xs text-gray-500">
        <div className="flex gap-4">
            <span>Page 1 of 1</span>
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
            <span>English (US)</span>
        </div>
        <div className="flex gap-4">
             <span>100%</span>
             <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">+</span>
             <span className="hover:bg-gray-100 px-1 rounded cursor-pointer">-</span>
        </div>
      </footer>

      {/* AI Modal */}
      <AIAssistant 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        documentContext={editorContent}
        selectedText={selectedText}
        onInsertText={handleAIInsert}
      />

    </div>
  );
};

export default App;