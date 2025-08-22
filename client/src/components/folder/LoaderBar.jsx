const LoaderBar = ({ showLoader, progress }) => {
    if (!showLoader) return null;

    return (
        <div className="h-1 w-full absolute left-0 top-0 bg-grey/30 overflow-hidden">
            <div
                className="h-1 bg-blue-400 transition-all duration-300 ease-linear"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

export default LoaderBar;
