const DownloadButton = ({ handleDownloadFolder, isLoading, status }) => {
    return (
        <button
            onClick={handleDownloadFolder}
            disabled={isLoading || status}
            className={` px-4 py-2 bg-grey text-white cursor-pointer rounded-xl transition-all duration-300 md:flex hidden justify-center
        ${status ? "w-80" : "w-52"} 
        disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-105`}
        >
            {status
                ? <p>{status}</p>
                : <span>Download This Folder</span>}
        </button>
    );
};

export default DownloadButton;
