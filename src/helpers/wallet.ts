// @ts-ignore
import Wallet from "@project-serum/sol-wallet-adapter";
import {
    Connection,
    SystemProgram,
    Transaction,
    PublicKey,
    TransactionInstruction,
} from "@solana/web3.js";
import EventEmitter from "eventemitter3";

export interface WalletAdapter extends EventEmitter {
    publicKey: PublicKey | null;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    connect: () => any;
    disconnect: () => any;
}

const cluster = "http://devnet.solana.com";
const connection = new Connection(cluster, "confirmed");
const wallet: WalletAdapter = new Wallet("https://www.sollet.io", cluster);

export async function initWallet(): Promise<[Connection, WalletAdapter]> {
    await wallet.connect();
    console.log("Wallet Public Key", wallet?.publicKey?.toBase58());
    return [connection, wallet];
}

export async function sendMoney(destinationPubkeyString: string, lamports: number = 500 * 1000_000) {
    try {
        console.log("Starting Send Money");
        const destinationPubkey = new PublicKey(destinationPubkeyString);
        const walletAccountInfo = await connection.getAccountInfo(wallet!.publicKey!);
        console.log("Wallet Data Size", walletAccountInfo?.data.length);

        const receiverAccountInfo = await connection.getAccountInfo(destinationPubkey);
        console.log("Receiver Data Size", receiverAccountInfo?.data.length);

        const instruction = SystemProgram.transfer({
            fromPubkey: wallet!.publicKey!,
            toPubkey: destinationPubkey,
            lamports: lamports
        });
        let transaction = await setWalletTransaction(instruction);
        let signature = await signAndSendTransaction(wallet, transaction);
        let result = await connection.confirmTransaction(signature, "singleGossip");
        console.log("Money sent", result);
    } catch (error) {
        console.warn("Failed with Error", error);
    }
}

export async function setWalletTransaction(instruction: TransactionInstruction): Promise<Transaction> {
    const transaction = new Transaction();
    transaction.add(instruction);
    transaction.feePayer = wallet!.publicKey!;
    let hash = await connection.getRecentBlockhash();
    console.log("Blockhash", hash);
    transaction.recentBlockhash = hash.blockhash;
    return transaction;
}

export async function signAndSendTransaction(wallet: WalletAdapter, transaction: Transaction): Promise<string> {
    let signedTrans = await wallet.signTransaction(transaction);
    console.log("Signature Transaction");
    let signature = await connection.sendRawTransaction(signedTrans.serialize());
    console.log("Send Raw Transaction");
    return signature;
}
