import React, {useState} from "react";
import robot from "./myrobot.module.css";
import live2D_CSS from "./live2d.module.css";
import {fetchNormalData} from "./fetch-llm";

export default function ChatInput() {
    const [inputText, setInputText] = useState('');
    const [chatHistory, setChatHistory] = useState('');
    const [loadingState, setLoadingState] = useState(false);

    const generateChatHistory = () => {
        if (chatHistory == "") {
            return <div className={live2D_CSS.ChatHistory}>
                {loadingState ? <div className={robot.loadingAnimation}></div> : null}
            </div>
        }
        return (
            <div className={robot.mainContentText}>
                {JSON.parse(chatHistory).map((item, index) => {
                    return (
                        <div
                            key={index}
                            className={item.hasOwnProperty("Human") ? robot.mainContentTextUser : robot.mainContentTextRobot}
                        >
                            {Object.values(item)[0] as React.ReactNode}
                        </div>
                    );
                })}
                {loadingState ? <div className={robot.loadingAnimation}></div> : null}
            </div>
        )
    }

    const sendMessage = async () => {
        setLoadingState(true);
        setChatHistory(
            chatHistory === ""
                ? JSON.stringify([{Human: inputText}])
                : JSON.stringify([...JSON.parse(chatHistory), {Human: inputText}])
        );
        const data = await fetchNormalData(inputText);
        setChatHistory((prevChatHistory) =>
            JSON.stringify([
                ...JSON.parse(prevChatHistory),
                {Assistant: data},
            ]));
        setLoadingState(false);
        setInputText('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault(); // 阻止默认的 Enter 键行为
            setInputText(inputText + '\n'); // 插入换行符
            return;
        }

        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className={live2D_CSS.ChatModel}>
            {generateChatHistory()}
            <div className={live2D_CSS.ChatInput}>
<textarea
    value={inputText}
    onChange={(e) => setInputText(e.target.value)}
    onKeyPress={handleKeyPress}
/>
                <button onClick={sendMessage}>Send</button>
            </div>

        </div>
    )
}