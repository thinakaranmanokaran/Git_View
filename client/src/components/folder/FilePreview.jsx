import CodeViewer from "../global/CodeViewer";

const FilePreview = ({ fileContent, fileName, isCodeFile }) => {
    if (!fileContent || !isCodeFile(fileName)) return null;
    return <CodeViewer content={fileContent} filename={fileName} />;
};

export default FilePreview;
