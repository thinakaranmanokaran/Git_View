import { Link } from "react-router-dom";
import images from "../../assets/images";

const FileGrid = ({ files, username, repo, path, clearStates, isCodeFile }) => {
    return (
        <ul className='w-full grid grid-cols-2 mx-2 my-6 md:grid-cols-8 gap-y-3 h-fit'>
            {Array.isArray(files) && files
                .sort((a, b) => {
                    if (a.type === 'dir' && b.type !== 'dir') return -1;
                    if (a.type !== 'dir' && b.type === 'dir') return 1;
                    return a.name.localeCompare(b.name);
                })
                .map((file) => (
                    <li key={file.sha}>
                        <Link
                            to={isCodeFile(file.name) ? `/${username}/${repo}/${path ? path + '/' : ''}${file.name}` : undefined}
                            onClick={clearStates}
                            className="flex flex-col items-center gap-2 p-2 hover:bg-grey rounded-md transition max-w-40"
                            title={file.name}
                        >
                            <img
                                src={
                                    file.type === 'dir'
                                        ? file.hasContent ? images.DataFolder : images.EmptyFolder
                                        : /\.(png|jpe?g|svg)$/i.test(file.name)
                                            ? file.download_url
                                            : /\.(js)$/i.test(file.name)
                                                ? images.JavaScript
                                                : /\.(py)$/i.test(file.name)
                                                    ? images.Python
                                                    : images.File
                                }
                                alt={file.name}
                                className='w-24 h-24 object-contain rounded shadow'
                            />
                            <div className='text-center w-4/5 text-xs font-general tracking-wide break-words'>
                                {file.name}
                            </div>
                        </Link>
                    </li>
                ))}
        </ul>
    );
};

export default FileGrid;
