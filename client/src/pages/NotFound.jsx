import { useLocation } from "react-router-dom";
import { useEffect } from "react";
// import { Link } from "@/components/ui/Link";
import { Link } from "react-router-dom";

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname
        );
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-subtle p-4">
            <div className="text-center max-w-xl animate-fade-in">
                <div className="mb-8 relative">
                    <div className="w-40 h-40 mx-auto bg-secondary/80 rounded-2xl flex items-center justify-center shadow-card relative">
                        <svg
                            className="text-primary w-20 h-20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path className="animate-bounce" d="M12 14V16.5M12 16.5L10.5 15M12 16.5L13.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        {/* Add a sad face to the folder */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl opacity-30">
                            :(
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-10 -left-4 w-8 h-8 rounded-full bg-blue-200/50"></div>
                    <div className="absolute -bottom-2 -right-6 w-12 h-12 rounded-full bg-purple-200/50"></div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4">404</h1>
                <h2 className="text-2xl md:text-3xl font-medium mb-4 text-gradient">Oops! That folder must be in another branch.</h2>
                <p className="text-lg text-muted-foreground mb-8">
                    We couldn't find the page you're looking for. It might have been moved, deleted, or maybe it never existed in the first place.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link asChild size="lg" className="bg-[#2463EB] text-white px-4 py-2 rounded-xl font-general   hover:bg-primary/90">
                        <Link to="/">Back to Root</Link>
                    </Link>
                    {/* <Link variant="outline" size="lg" className="border-primary/20">
                        <Link to="/">Report Issue</Link>
                    </Link> */}
                </div>
            </div>
        </div>
    );
};

export default NotFound;
