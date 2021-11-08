import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import MainScreen from "../components/MainScreen";
import Transaction from "../components/Transactions";
import TokenSelector from "../components/TokenSelector";

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
      </main>
    </div>
  );
};

export default Home;
