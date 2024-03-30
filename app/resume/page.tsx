import { robotoSlab } from "../fonts";

const Resume = () => {
    return (
        <div className="cpm">
            <div className="wrapper">
                <div className="py-6 md:py-12">
                    <div className="flex items-center">
                        <h2 className={`text-4xl md:text-5xl mt-12 lg:mt-0 ${robotoSlab.className}`}>Resume</h2>
                        <div className="ms-5 h-0.5 w-32 md:w-72 bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 mt-12 lg:mt-0"></div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Resume;