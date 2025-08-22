const DownloadButton = ({ handleDownloadFolder, isLoading, status }) => {
    return (
        <button
            onClick={handleDownloadFolder}
            disabled={isLoading || status}
            className={`fixed bottom-6 right-4 px-4 py-2 bg-grey text-white rounded-xl transition-all duration-300 md:flex hidden justify-center
        ${isLoading ? "w-16" : status ? "w-80" : "w-52"} 
        disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-105`}
        >
            {isLoading
                ? <div className='w-6 h-6 border-dark border-2 rounded-full border-t-white animate-spin'></div>
                : status
                    ? <p>{status}</p>
                    : <span>Download This Folder</span>}
        </button>
    );
};

export default DownloadButton;
