export enum EditorActionType {
  BOLD = 'bold',
  ITALIC = 'italic',
  UNDERLINE = 'underline',
  STRIKETHROUGH = 'strikeThrough',
  JUSTIFY_LEFT = 'justifyLeft',
  JUSTIFY_CENTER = 'justifyCenter',
  JUSTIFY_RIGHT = 'justifyRight',
  JUSTIFY_FULL = 'justifyFull',
  INSERT_ORDERED_LIST = 'insertOrderedList',
  INSERT_UNORDERED_LIST = 'insertUnorderedList',
  FORMAT_BLOCK = 'formatBlock',
  UNDO = 'undo',
  REDO = 'redo',
  FORE_COLOR = 'foreColor',
  HILITE_COLOR = 'hiliteColor',
  INSERT_IMAGE = 'insertImage',
}

export interface AIRequest {
  prompt: string;
  context: string; // The current text in the editor
  selection?: string; // Specifically selected text
}

export interface AIResponse {
  text: string;
  error?: string;
}

export enum AIUsageMode {
  ASSISTANT = 'ASSISTANT', // General help/chat
  REWRITE = 'REWRITE',     // Rewrite specific selection
  CONTINUE = 'CONTINUE',   // Continue writing from cursor
}