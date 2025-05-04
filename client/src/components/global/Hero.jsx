import { IoArrowForward } from "react-icons/io5";
import { Link } from "react-router-dom";
import images from "../../assets/images";

const Hero = () => {
    return (
        <div className={`flex justify-center items-center h-screen bg-cover bg-center bg-[url(${images.Background})]`} style={{ backgroundImage: `url(${images.Background})` }}  >
            <div className="flex flex-col  items-center text-center space-y-8 relative z-10 animate-fade-in ">
                <div className="space-y-3">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter max-w-3xl mx-auto">
                        A <span className="bg-gradient-to-r from-[#2463EB] to-[#5D2DE6] bg-clip-text text-transparent pr-1 ">smarter way</span> to browse your GitHub repos
                    </h1>
                    <p className="text-lg md:text-lg  mt-6 text-[#64748B] max-w-[700px] mx-auto font-general">
                        Git View gives you a minimalist, beautiful interface to explore repositories, branches, and code with ease.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mx-auto">
                    <Link to="/facebook/react"
                        size="lg"
                        className="w-full bg-[#2463EB] hover:bg-[#2463EB] flex justify-center space-x-1 text-white py-4 rounded-2xl items-center font-general shadow-lg shadow-primary/20 text-lg shadow-[#2463EB]"
                    >
                        <span>Explore Repos</span>
                        <IoArrowForward className="h-4 w-4 ml-2" />
                    </Link>
                    {/* <button
                            size="lg"
                            variant="outline"
                            className="w-full text-lg border-primary/20 hover:bg-primary/5"
                        >
                            Learn More
                        </button> */}
                </div>
            </div>
        </div>
    );
};

export default Hero;