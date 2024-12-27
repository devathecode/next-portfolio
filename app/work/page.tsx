import { MdDesignServices } from "react-icons/md";
import Card from "../components/Card";
import { robotoSlab } from "../fonts";
import Image from "next/image";

const Work = () => {
  return (
    <div className="cpm">
      <div className="wrapper">
        <div className="py-6 md:py-12">
          <div className="flex items-center">
            <h2
              className={`text-4xl md:text-5xl mt-12 lg:mt-0 ${robotoSlab.className}`}
            >
              Portfolio
            </h2>
            <div className="ms-5 h-0.5 w-32 md:w-72 bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 mt-12 lg:mt-0"></div>
          </div>
          <div className="grid grid-cols-12 gap-y-5 md:gap-10 pt-4 md:pt-[40px] items-center">
            <Card
              redirectUrl="https://www.npmjs.com/package/ngx-table-with-pagination"
              classes="col-span-12 md:col-span-6 lg:col-span-4"
            >
              <div className=" bg-black rounded-md overflow-hidden h-60">
                <Image
                  width="300"
                  height="300"
                  className="h-60 w-60 object-contain group-hover:scale-110 transition-all ease-in-out duration-700 mx-auto"
                  alt="tax"
                  src="/npm.png"
                />
              </div>
              <h4 className="text-base dark:text-white/60 my-3">NPM Library</h4>
              <p className="text-lg lg:text-xl">ngx-table-with-pagination</p>
            </Card>
            <Card
              redirectUrl="https://go-calc.vercel.app/"
              classes="col-span-12 md:col-span-6 lg:col-span-4"
            >
              <div className="bg-pink-50 rounded-md overflow-hidden h-60">
                <Image
                  width="300"
                  height="300"
                  className="h-60 object-contain group-hover:scale-110 transition-all ease-in-out duration-700"
                  alt="tax"
                  src="https://firebasestorage.googleapis.com/v0/b/dev-cms-46756.appspot.com/o/devanshuv1501%40gmail.com%2Fimage-removebg-preview.png?alt=media&token=1d3e0e17-e899-42e5-b37c-575371267e2a"
                />
              </div>
              <h4 className="text-base dark:text-white/60 my-3">Web app</h4>
              <p className="text-lg lg:text-xl">GoCalc - Calculator Hub</p>
            </Card>
            <Card
              redirectUrl="https://e-commerce-psi-flax.vercel.app"
              classes="col-span-12 md:col-span-6 lg:col-span-4"
            >
              <div className="bg-blue-300 rounded-md overflow-hidden h-60">
                <Image
                  width="300"
                  height="300"
                  className="h-60 object-contain group-hover:scale-110 transition-all ease-in-out duration-700"
                  alt="tax"
                  src="https://firebasestorage.googleapis.com/v0/b/dev-cms-46756.appspot.com/o/devanshuv1501%40gmail.com%2Fimage__1_-removebg-preview.png?alt=media&token=d9202219-eabe-44fd-b025-5af7f1c68449"
                />
              </div>
              <h4 className="text-base dark:text-white/60 my-3">Web app</h4>
              <p className="text-lg lg:text-xl">E-commerce shoes</p>
            </Card>
            <Card
              redirectUrl="https://netflix-react-ui-clone.netlify.app/"
              classes="col-span-12 md:col-span-6 lg:col-span-4"
            >
              <div className=" bg-orange-300 rounded-md overflow-hidden h-60">
                <Image
                  width="300"
                  height="300"
                  className="h-60 object-contain group-hover:scale-110 transition-all ease-in-out duration-700"
                  alt="tax"
                  src="https://firebasestorage.googleapis.com/v0/b/dev-cms-46756.appspot.com/o/devanshuv1501%40gmail.com%2Fmovies.webp?alt=media&token=3b672fb2-cf61-4a71-ac14-7cff03284598"
                />
              </div>
              <h4 className="text-base dark:text-white/60 my-3">Web app</h4>
              <p className="text-lg lg:text-xl">Netflix clone</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
