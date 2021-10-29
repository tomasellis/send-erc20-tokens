import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Send ERC20 Tokens</title>
        <meta name="description" content="Send Kleros approved ERC20 tokens" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full h-full flex flex-col justify-center items-center">
        <div className="flex-1 flex max-w-3xl rounded-md border border-red-500">
          <h1 className="">Check the ERC20 tokens available!</h1>
        </div>
      </main>
    </div>
  );
};

export default Home;
