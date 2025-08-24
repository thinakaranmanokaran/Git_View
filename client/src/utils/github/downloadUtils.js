import JSZip from "jszip";
import { saveAs } from "file-saver";
import { fetchRepoTree } from "../../services/GithubService";

export const downloadFolderAsZip = async (username, repo, path = "") => {
    const zip = new JSZip();
    const basePath = path || "";
    const folderName = basePath || repo;
    const RAW_BASE = `https://raw.githubusercontent.com/${username}/${repo}/main`;

    const treeRes = await fetchRepoTree(username, repo);
    const allFiles = treeRes.data.tree.filter(item => item.type === "blob");

    const filesToDownload = basePath
        ? allFiles.filter(file => file.path.startsWith(basePath + "/"))
        : allFiles;

    const downloadFile = async (file) => {
        const rawUrl = `${RAW_BASE}/${file.path}`;
        const res = await fetch(rawUrl);
        if (!res.ok) throw new Error(`Failed to fetch ${file.path}`);
        const blob = await res.blob();
        zip.file(file.path, blob, { binary: true });
    };

    const MAX_CONCURRENT = 20;
    for (let i = 0; i < filesToDownload.length; i += MAX_CONCURRENT) {
        const chunk = filesToDownload.slice(i, i + MAX_CONCURRENT);
        await Promise.allSettled(chunk.map(downloadFile));
    }

    const blob = await zip.generateAsync({ type: "blob", compression: "STORE" });
    saveAs(blob, `${folderName}.zip`);
};
