import { useState, useEffect } from "react";
import { useProgram, useMintNFT, useSDK } from "@thirdweb-dev/react/solana";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import {
  Connection,
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import Head from "next/head";
// import metadata from "../public/metadata.json";

// deploy mint website to mint.lions.cool (vercel or netlify)
// mainnet deployment (add mainnet NFT address + other config + mint 7 1 of 1 NFTs)
// add metadata (array of 4444 objects)

require("@solana/wallet-adapter-react-ui/styles.css");

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const MAX_SUPPLY = 4444;
const MINT_PRICE = 0.6;
const WL_MINT_PRICE = 0.4;
const COLLECTION_ADDRESS_MAINNET_BETA = "";
const SOLANA_MAINNET_BETA_RPC =
  "https://solana-mainnet.g.alchemy.com/v2/sj9UVAYpI2zKHuFrp_2AfMrJKZFD3Fp8";
const COLLECTION_ADDRESS_DEVNET =
  "7Yjk7dNp8QE89kvTtmxAxd9Mn8HoLV7GjnD45QYD6qL5";
const SOLANA_DEVNET_RPC =
  "https://solana-devnet.g.alchemy.com/v2/LGsgs8DppQcOrTJ5AVR_-0U3QEikpQnF";

const whitelistAddresses = [
  "HuxE723AdxKUuxXNfY7PgyK648pR32mU3jPn7Q9ZquJc",
  "5sUJuKiAZmXZsY9wF6xPLocMYbD2beLoSmZKGFmq3J8E",
  "F6dxmXKz5kRC1MdsqcFNbnEFEP9wRcMJmD3fqgszfhux", // ADMIN
  "2yh5UzRd5kmrQtQFauCwqW5F2JEVEqbgQKGknJm6XtV2",
  "6EUF18wxbFJ1ni8Dvh36i6dbhRyryoihxY9SLM7ZDf9E",
  "Bm4ucVABhF8xn7B47UpYiaP2TiZNkqdxcw7Bcy5RTRgy",
  "BdH4LfRwASynjM927p5b6VhDUH5YY6gkbvtApAurB888",
  "HQfYSEtJnZe3trBZEfzift7tFFh2GdMbcW58maqBoigD",
];

const metadata = {
  name: "Cool Lions Club",
  description:
    "WELCOME TO THE CLUB! The COOL Lions Club is more than just an NFT collection. It's a community that is focused on bringing positive changes to the (growing) Solana NFT space. Above all that, our main goal is to benefit the COOL Lions Club holders as much as we can.",
  image:
    "https://storageapi.fleek.co/c1b47887-4944-4a44-b339-0d83287c9e83-bucket/0.jpg",
  attributes: [
    { trait_type: "Background", value: "Blue" },
    { trait_type: "Eyes", value: "Green" },
    { trait_type: "Mouth", value: "Smile" },
    { trait_type: "Nose", value: "Small" },
    { trait_type: "Head", value: "Small" },
    { trait_type: "Body", value: "Small" },
    { trait_type: "Tail", value: "Small" },
    { trait_type: "Legs", value: "Small" },
  ],
  backround_color: "#34CAC6",
  external_url: "https://lions.cool",
};

const Home: NextPage = () => {
  const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false);
  const [account, setAccount] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [mintFeePaid, setMintFeePaid] = useState<boolean>(false);

  const sdk = useSDK();

  const { data: myNftCollectionProgram } = useProgram(
    COLLECTION_ADDRESS_DEVNET,
    "nft-collection"
  );

  const { mutate: mintNFT } = useMintNFT(myNftCollectionProgram);

  useEffect(() => {
    const main = async () => {
      if (window.solana.isPhantom) {
        const res = await window.solana.connect();
        const currentAddress = res.publicKey.toString();
        setAccount(currentAddress);

        setIsWhitelisted(whitelistAddresses.includes(currentAddress));
        setConnected(true);
      } else {
        alert("Please install Phantom wallet first!");
        window.open("https://phantom.app", "_blank");
      }
    };

    main();
  }, [sdk?.wallet, myNftCollectionProgram, connected]);

  const network = SOLANA_DEVNET_RPC;
  const connection = new Connection(network, "confirmed");

  const sendSOL = async (amount: number) => {
    try {
      const lamportAmount = amount * LAMPORTS_PER_SOL;

      let tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(account),
          toPubkey: new PublicKey(whitelistAddresses[2]),
          lamports: lamportAmount,
        })
      );

      tx.feePayer = new PublicKey(account);
      const { blockhash } = await connection.getRecentBlockhash();
      tx.recentBlockhash = blockhash;

      const { signature } = await window.solana.signAndSendTransaction(tx);

      await connection.confirmTransaction(signature, "confirmed");
    } catch (error) {
      console.error(error);
    }
  };

  const sendAmount = isWhitelisted ? WL_MINT_PRICE : MINT_PRICE;

  return (
    <>
      <Head>
        <title>Cool Lions Club | Mint Your Cool Lion NOW!</title>
        <meta
          name="description"
          content="Cool Lions Club NFT Collection on Solana - Mint Your Cool Lion NOW!"
        />
      </Head>
      <div className={styles.container}>
        <div className={styles.iconContainer}>
          <Image
            src="/logo512.png"
            height={206}
            width={206}
            style={{
              objectFit: "contain",
              borderRadius: "50%",
            }}
            alt="Cool Lions Club"
          />
        </div>
        <h1
          className={styles.h1}
          style={{
            marginBottom: "35px",
            textTransform: "uppercase",
          }}
        >
          Mint Your Cool Lion
        </h1>

        <div
          style={{
            textAlign: "center",
            fontSize: "25px",
            paddingLeft: "5%",
            paddingRight: "5%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              textTransform: "uppercase",
            }}
          >
            <WalletMultiButtonDynamic
              style={{
                textTransform: "uppercase",
                fontWeight: "bold",
                fontSize: "24px",
              }}
            />
          </div>
          <p>Max Supply: {MAX_SUPPLY} NFTs</p>
          <p>
            {isWhitelisted ? (
              <span
                style={{
                  textDecoration: "line-through",
                }}
              >
                Mint Price: {MINT_PRICE} SOL
              </span>
            ) : (
              <span>Mint Price: {MINT_PRICE} SOL</span>
            )}
          </p>
          {isWhitelisted && <p>Whitelist Mint Price: {WL_MINT_PRICE} SOL</p>}

          <button
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: "24px",
              cursor: "pointer",
              margin: "auto",
              textTransform: "uppercase",
            }}
            className="mint-button wallet-adapter-button wallet-adapter-button-trigger"
            onClick={
              mintFeePaid
                ? () =>
                    mintNFT({
                      metadata: metadata,
                      to: account,
                    })
                : async () => {
                    await sendSOL(sendAmount);
                    alert("Mint fee paid! You can now mint your NFT.");
                    setMintFeePaid(true);
                  }
            }
          >
            {mintFeePaid ? "Mint" : "Pay Mint Fee"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
