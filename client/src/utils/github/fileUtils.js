const nonCodeExtensions = [
    ".png", ".jpg", ".jpeg", ".gif", ".mp4", ".webm", ".mov",
    ".pdf", ".zip", ".ico", ".webp"
];

export const isCodeFile = (fileName) => {
    return !nonCodeExtensions.some(ext =>
        fileName.toLowerCase().endsWith(ext)
    );
};
