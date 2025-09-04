import React from "react";
import Editor from "@monaco-editor/react";

// Simple Night Owl theme JSON (you can extend this if needed)
const nightOwlTheme = {
    base: "vs-dark",
    inherit: true,
    rules: [
        { token: "", foreground: "d6deeb", background: "011627" },
        { token: "comment", foreground: "637777", fontStyle: "italic" },
        { token: "keyword", foreground: "c792ea" },
        { token: "number", foreground: "f78c6c" },
        { token: "string", foreground: "ecc48d" },
        { token: "operator", foreground: "7fdbca" },
        { token: "function", foreground: "82aaff" },
        { token: "variable", foreground: "addb67" },
    ],
    colors: {
        "editor.background": "#011627",
        "editor.foreground": "#d6deeb",
        "editor.lineHighlightBackground": "#1d3b53",
        "editorCursor.foreground": "#80a4c2",
        "editorWhitespace.foreground": "#2e2040",
    },
};

const getLanguage = (filename) => {
    if (filename.endsWith(".js")) return "javascript";
    if (filename.endsWith(".jsx")) return "javascript";
    if (filename.endsWith(".py")) return "python";
    if (filename.endsWith(".json")) return "json";
    if (filename.endsWith(".html")) return "html";
    if (filename.endsWith(".css")) return "css";
    if (filename.endsWith(".java")) return "java";
    return "plaintext";
};

const CodeViewer = ({ content, filename }) => {
    // Define theme when editor mounts
    const handleEditorMount = (editor, monaco) => {
        monaco.editor.defineTheme("night-owl", nightOwlTheme);
        monaco.editor.setTheme("night-owl");
    };

    return (
        <div className="w-full bg-[#1e1e1e] py-8 px-0  h-[500px]">
            <Editor
                height="100%"
                defaultLanguage={getLanguage(filename)}
                defaultValue={content}
                // theme="night-owl"
                theme="vs-dark"
                // onMount={handleEditorMount}
                options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 18,
                    wordWrap: "on",
                    scrollBeyondLastLine: false,
                    roundedSelection: true,
                    automaticLayout: true,
                }}
            />
        </div>
    );
};

export default CodeViewer;
