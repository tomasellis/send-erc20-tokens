import react from "react";
import Image from "next/image";
import UBIPng from "../../public/UBI.png";

const Landing = ({
  setWentThroughLanding,
}: {
  setWentThroughLanding: react.Dispatch<react.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <div className="w-1/2 h-full flex-1 flex flex-col justify-center items-start ml-40">
        <span className="text-lightPurple text-5xl mb-12">
          Send any curated <br /> ERC20 token.
        </span>
        <button
          className="bg-lightPurple text-accentPurple px-6 rounded-full  font-thin text-center"
          onClick={async () => {
            setWentThroughLanding(true);
          }}
          style={{ fontSize: "48px" }}
        >
          Go to app
        </button>
      </div>
      <div className="w-1/2 h-full flex-1 flex justify-center items-center flex-col pr-12">
        <div style={{ position: "relative", right: "100px" }}>
          <Image
            src={UBIPng}
            height="200px"
            width="200px"
            quality={100}
            placeholder="blur"
          />
        </div>
        <div style={{ position: "relative", bottom: "30px", left: "80px" }}>
          <Image
            src={UBIPng}
            height="150px"
            width="150px"
            quality={100}
            placeholder="blur"
          />
        </div>
        <div style={{ position: "relative", bottom: "50px", right: "50px" }}>
          <Image
            src={UBIPng}
            height="100px"
            width="100px"
            quality={100}
            placeholder="blur"
          />
        </div>
      </div>
    </>
  );
};

export default Landing;
