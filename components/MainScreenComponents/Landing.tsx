import react from "react";
import Image from "next/image";
import connectWallet from "../../utils/connectWallet";

const Landing = ({
  setUserAddress,
}: {
  setUserAddress: react.Dispatch<react.SetStateAction<string>>;
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
            const address = await connectWallet();
            return setUserAddress(address);
          }}
          style={{ fontSize: "48px" }}
        >
          Connect Wallet
        </button>
      </div>
      <div className="w-1/2 h-full flex-1 flex justify-center items-center flex-col pr-12">
        <div style={{ position: "relative", right: "100px" }}>
          <Image src="/UBI.png" height="200px" width="200px" />
        </div>
        <div style={{ position: "relative", bottom: "30px", left: "80px" }}>
          <Image src="/UBI.png" height="150px" width="150px" />
        </div>
        <div style={{ position: "relative", bottom: "50px", right: "50px" }}>
          <Image src="/UBI.png" height="100px" width="100px" />
        </div>
      </div>
    </>
  );
};

export default Landing;
