import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const getLanguage = (filename) => {
    if (filename.endsWith('.js')) return 'javascript';
    if (filename.endsWith('.py')) return 'python';
    if (filename.endsWith('.json')) return 'json';
    if (filename.endsWith('.html')) return 'html';
    if (filename.endsWith('.css')) return 'css';
    if (filename.endsWith('.java')) return 'java';
    return 'text';
};

const CodeViewer = ({ content, filename }) => {

    return (
        <div className="w-full max-w-4xl mx-auto bg-[#d9eafd05] rounded-2xl shadow-lg p-4 mt-6 overflow-auto">
            <SyntaxHighlighter
                language={getLanguage(filename)}
                style={oneDark}
                showLineNumbers
                wrapLines 
                customStyle={{ fontSize: '0.85rem', borderRadius: '10px' }}
            >
                {content}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeViewer;
