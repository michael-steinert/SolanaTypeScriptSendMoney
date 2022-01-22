import React, {useState} from "react";
import {sendMoney} from "../helpers/wallet";
import "./Sender.css";

interface SenderProps {
    didSendMoney: () => void;
}

const Sender: React.FC<SenderProps> = ({didSendMoney}) => {
    const [amount, setAmount] = useState(0);
    const [address, setAddress] = useState("");

    const onChangeAmount = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(changeEvent.target.value ? Number(changeEvent.target.value) : 0);
    };

    const onChangeAddress = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(changeEvent.target.value ? changeEvent.target.value.toString() : "");
    };

    const onClickSendMoney = async (mouseEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        mouseEvent.preventDefault();
        await sendMoney(address, amount);
        didSendMoney();
    };

    return (
        <form className={"send-container"}>
            <div className={"send-inputs"}>
                <div className={"send-top-left"}>
                    <label htmlFor={"amount"}>Amount (Lamports)</label>
                </div>
                <div className={"send-mid-left"}>
                    <label htmlFor={"address"}>Address</label>
                </div>
                <div className={"send-top-right"}>
                    <input type={"text"} value={amount} onChange={onChangeAmount}/>
                </div>
                <div className={"send-mid-right"}>
                    <input type={"text"} value={address} onChange={onChangeAddress}/>
                </div>
                <div className={"send-bottom-right"}>
                    <button className={"send-buttons"} onClick={onClickSendMoney}>
                        Submit
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Sender;
