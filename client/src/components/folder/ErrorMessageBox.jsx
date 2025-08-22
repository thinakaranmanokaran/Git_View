const ErrorMessageBox = ({ errorMessage, errorCode, username, fetchFiles }) => {
    return (
        <div className="text-center bg-grey w-fit p-6 min-w-1/3 rounded-3xl min-h-40 flex flex-col justify-center items-center shadow-md absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 max-w-2/5 space-y-6">
            <p className={`text-lg font-general ${errorMessage.startsWith("❌") ? "text-red-500" :
                    errorMessage.startsWith("🔒") ? "text-yellow-500" :
                        "text-white"
                }`}>
                {errorMessage}
            </p>

            {errorCode === 1 ? (
                <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                    Go to Profile
                </a>
            ) : errorCode === 2 || errorCode === 3 ? (
                <button onClick={fetchFiles}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                    Try Again
                </button>
            ) : null}
        </div>
    );
};

export default ErrorMessageBox;
