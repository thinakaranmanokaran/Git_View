import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

const Breadcrumbs = ({ username, repo, path, clearStates }) => {
    return (
        <div className='flex justify-start md:justify-center px-4 overflow-x-scroll md:overflow-hidden items-center gap-2 my-4 text-sm min-h-16 font-medium'>
            {path
                ? path.split('/').map((part, index, arr) => {
                    const subPath = arr.slice(0, index + 1).join('/');
                    return (
                        <span key={index} className="flex items-center gap-1">
                            <Link onClick={clearStates} to={`/${username}/${repo}/${subPath}`}
                                className="bg-grey px-3 py-2 rounded-full hover:bg-blue hover:text-dark transition-colors line-clamp-1">
                                {part}
                            </Link>
                            {index < arr.length - 1 && <IoIosArrowForward />}
                        </span>
                    );
                })
                : <span className="text-gray-400"></span>}
        </div>
    );
};

export default Breadcrumbs;
