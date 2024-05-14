import React, { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const newChat =()=>{
        setLoading(false)
        setShowResult(false)
    }


    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        if (prompt !== undefined){
            response = await runChat(prompt)
            setRecentPrompt(prompt)
        } else {
            setPrevPrompts(prev => [...prev, input]);
            setRecentPrompt(input);
            response = await runChat(input);
        }

        // Split response text by "**" to detect parts to be bolded
        const responseParts = response.split("**");

        // Initialize variable to hold formatted response
        let formattedResponse = "";

        // Loop through response parts
        for (let i = 0; i < responseParts.length; i++) {
            if (i % 2 === 0) {
                // Text not surrounded by "**", just append
                formattedResponse += responseParts[i];
            } else {
                // Text surrounded by "**", make it bold
                formattedResponse += `<b>${responseParts[i]}</b>`;
            }
        }

        // Split formatted response by "*" to detect lines to be broken
        const lines = formattedResponse.split("*");

        // Join lines with line breaks
        formattedResponse = lines.join("<br/>");

        // Split formatted response by spaces to simulate typing animation
        const words = formattedResponse.split(" ");
        let typedText = "";

        // Loop through words with delay
        for (let i = 0; i < words.length; i++) {
            // Simulate typing by delaying appending each word
            setTimeout(() => {
                typedText += words[i] + " ";
                setResultData(typedText);
            }, 50* i);
        }

        setLoading(false);
        setInput("");
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;
