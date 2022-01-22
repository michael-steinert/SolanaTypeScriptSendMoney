import {Connection} from "@solana/web3.js";
import React, {useEffect, useRef, useState} from "react";
import "./App.css";
import Sender from "./components/Sender";
import TransactionsView from "./components/TransactionView";
import {
    getTransactions,
    TransactionWithSignature,
} from "./helpers/transactions";
import {initWallet, WalletAdapter} from "./helpers/wallet";

function App() {
    const [transactions, setTransactions] = useState<Array<TransactionWithSignature>>();
    const connection = useRef<Connection>();
    const wallet = useRef<WalletAdapter>();

    useEffect(() => {
        initWallet().then(([_connection, _wallet]: [Connection, WalletAdapter]) => {
            connection.current = _connection;
            wallet.current = _wallet;
            if (_wallet.publicKey) {
                getTransactions(_connection, _wallet.publicKey).then((_transaction) => {
                    setTransactions(_transaction);
                });
            }
        });
    }, []);

    const didSendMoney = () => {
        getTransactions(connection.current!, wallet.current!.publicKey!).then((_transaction) => {
            setTransactions(_transaction);
        });
    };

    return (
        <div className={"app-body"}>
            <div className={"app-body-top"}>
                <h3>Send Money on Solana</h3>
                <Sender didSendMoney={didSendMoney}/>
            </div>
            <div className={"app-body-mid"}>
                <TransactionsView transactions={transactions}/>
            </div>
        </div>
    );
}

export default App;
