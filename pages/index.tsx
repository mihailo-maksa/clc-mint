import { useState, useEffect } from "react";
import { useProgram, useMintNFT, useSDK } from "@thirdweb-dev/react/solana";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import styles from "../styles/Home.module.css";
import {
  Connection,
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import Head from "next/head";
import metadata from "../public/metadata.json";

require("@solana/wallet-adapter-react-ui/styles.css");

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const MAX_SUPPLY = 4444;
const MINT_PRICE = 0.6;
const WL_MINT_PRICE = 0.4;

const COLLECTION_ADDRESS_MAINNET_BETA =
  "6WFci8tpJBdA28w4pEHcG8VafGkrK1HAJJXtG5UNJhE7";
const SOLANA_MAINNET_BETA_RPC =
  "https://solana-mainnet.g.alchemy.com/v2/sj9UVAYpI2zKHuFrp_2AfMrJKZFD3Fp8";

// const COLLECTION_ADDRESS_DEVNET =
//   "7Yjk7dNp8QE89kvTtmxAxd9Mn8HoLV7GjnD45QYD6qL5";
// const SOLANA_DEVNET_RPC =
//   "https://solana-devnet.g.alchemy.com/v2/LGsgs8DppQcOrTJ5AVR_-0U3QEikpQnF";

const whitelistAddresses = [
  "HuxE723AdxKUuxXNfY7PgyK648pR32mU3jPn7Q9ZquJc",
  "5sUJuKiAZmXZsY9wF6xPLocMYbD2beLoSmZKGFmq3J8E",
  "F6dxmXKz5kRC1MdsqcFNbnEFEP9wRcMJmD3fqgszfhux", // ADMIN
  "2yh5UzRd5kmrQtQFauCwqW5F2JEVEqbgQKGknJm6XtV2",
  "6EUF18wxbFJ1ni8Dvh36i6dbhRyryoihxY9SLM7ZDf9E",
  "Bm4ucVABhF8xn7B47UpYiaP2TiZNkqdxcw7Bcy5RTRgy",
  "BdH4LfRwASynjM927p5b6VhDUH5YY6gkbvtApAurB888",
  "HQfYSEtJnZe3trBZEfzift7tFFh2GdMbcW58maqBoigD",
  "DmqAhAqK4xra72qxWBZSvK7Weq3xsMMj9gjQBooyYZv1",
];

const Home: NextPage = () => {
  const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false);
  const [account, setAccount] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [mintFeePaid, setMintFeePaid] = useState<boolean>(false);

  const sdk = useSDK();

  const { data: myNftCollectionProgram } = useProgram(
    // @ts-ignore
    new PublicKey("6WFci8tpJBdA28w4pEHcG8VafGkrK1HAJJXtG5UNJhE7"),
    "nft-collection"
  );

  const { mutate: mintNFT } = useMintNFT(myNftCollectionProgram);

  useEffect(() => {
    const main = async () => {
      // @ts-ignore
      if (window.solana.isPhantom) {
        // @ts-ignore
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

  const network = SOLANA_MAINNET_BETA_RPC;
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

      // @ts-ignore
      const { signature } = await window.solana.signAndSendTransaction(tx);

      await connection.confirmTransaction(signature, "confirmed");
    } catch (error) {
      console.error(error);
    }
  };

  const sendAmount = isWhitelisted ? WL_MINT_PRICE : MINT_PRICE;

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 1024);
  };

  return (
    <>
      <Head>
        <title>COOL Lions Club | Mint Your COOL Lion NOW!</title>
        <meta
          name="description"
          content="COOL Lions Club | Mint Your COOL Lion NOW!"
        />
      </Head>
      <div className={styles.container}>
        <div className={styles.iconContainer}>
          <img
            src="https://storageapi.fleek.co/c1b47887-4944-4a44-b339-0d83287c9e83-bucket/logo512.png"
            height={206}
            width={206}
            style={{
              objectFit: "contain",
              borderRadius: "50%",
            }}
            alt="COOL Lions Club"
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

          {sdk?.wallet.isConnected() ? (
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
                        // @ts-ignore
                        metadata: metadata[getRandomNumber()],
                        to: sdk?.wallet.getAddress(),
                      })
                  : async () => {
                      await sendSOL(sendAmount);

                      alert(
                        "Mint fee paid successfully! You can now mint your COOL Lions Club NFT!"
                      );

                      setMintFeePaid(true);
                    }
              }
            >
              {mintFeePaid ? "Mint" : "Pay Mint Fee"}
            </button>
          ) : (
            <p>Not Connected. Please Refresh the Page and Try Again.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
