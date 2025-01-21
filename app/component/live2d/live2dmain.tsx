"use client"

import Live2D from "./live2d";
import ChatInput from "./chatInput";
import React, {useState} from "react";
import live2D_CSS from "./live2d.module.css";

export default function Live2DPage() {
    const [chatDisplay, setChatDisplay] = useState('none');

    const live2DClickFunction = (event) => {
        setChatDisplay((prevState) => prevState === "none" ? "flex" : "none");
    };

    return (
        <div>
            <Live2D live2Dclick={live2DClickFunction}/>
            <div className={live2D_CSS.ChatInputMain} style={{display: chatDisplay}}>
                <ChatInput/>
            </div>
        </div>
    )
}