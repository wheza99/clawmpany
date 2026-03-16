// Detect if running in VS Code webview or standalone browser
declare const acquireVsCodeApi: (() => { postMessage(msg: unknown): void }) | undefined;

const inVsCode = typeof acquireVsCodeApi !== 'undefined';

// VS Code API type
type VsCodeApi = { postMessage(msg: unknown): void };

// Mock API for standalone development
const mockVsCode: VsCodeApi = {
  postMessage: (msg: unknown) => {
    console.log('[Mock VSCode] postMessage:', msg);
    // In standalone mode, we don't send messages anywhere
    // All state management is handled locally
  },
};

// Export the appropriate API
export const vscode: VsCodeApi = inVsCode ? acquireVsCodeApi!() : mockVsCode;

// Export flag for conditional logic
export const isStandalone = !inVsCode;
