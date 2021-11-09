import type { NextPage } from "next";
import Head from "next/head";
import MainScreen from "../components/MainScreen";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Send ERC20 Tokens</title>
        <meta name="description" content="Send Kleros approved ERC20 tokens" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen h-screen flex">
        <MainScreen />
        <ToastContainer
          bodyClassName="w-72 cursor-default"
          toastClassName="border border-borderGrey absolute top-20"
          className=""
          autoClose={false}
          newestOnTop
          closeOnClick={false}
          rtl={false}
          draggable
        />
      </main>
    </div>
  );
};

export default Home;
