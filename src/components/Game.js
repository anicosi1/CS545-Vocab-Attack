import React, {useState, useEffect} from 'react';
import './Game.css';

const Game = function() {

    //Definitions gotten from Google
    const prompts = [
        {definition: "a piece of land surrounded by water",
        answer: "island",
        hint: "isle"},
        {definition: "a large area of flat land with few trees",
        answer: "plain",
        hint: "grassland"},
        {definition: "an area of low-lying, uncultivated ground where water collects; a bog or marsh.",
        answer: "swamp",
        hint: "quagmire"}
    ]

    let timeLimit = 60;
    let hintPenalty = 15;
    let wrongPenalty = 5;
    
    const [input, setInput] = useState("")
    //Contains some index within the list of prompts
    const [prompt, setPrompt] = useState(Math.floor(Math.random() * prompts.length))
    //Boolean dependent on if the user got the answer right or not
    const [timer, setTimer] = useState(timeLimit)
    //State of the game (new, running, over)
    const [gameState, setGameState] = useState("new")
    //Boolean for whether or not to show the hint
    const [hint, setHint] = useState(false)
    const [points, setPoints] = useState(0)
    //Boolean for showing messages
    const [feedbackMessage, setFeedbackMessage] = useState(null);

    const start = function() {
        setGameState("running")
        setTimer(timeLimit)
        setPrompt(Math.floor(Math.random() * prompts.length))
        setHint(false)
        setInput('')
        setPoints(0)
        setFeedbackMessage(null)
    }

    const handleInput = function() {
        let guess = document.getElementById("userInput").value.trim()
        setInput(guess)
        document.getElementById("userInput").value = ''
        
        //Upon getting the answer correct, select a new prompt
        if(guess !== '' && guess === prompts[prompt].answer){
            let newPrompt = Math.floor(Math.random() * prompts.length)
            //Ensure new prompt isn't same as the one just completed
            while(newPrompt === prompt){
                newPrompt = Math.floor(Math.random() * prompts.length)
            }
            setPrompt(newPrompt)
            setTimer(timeLimit)
            setHint(false)
            setPoints(points+1)
            setFeedbackMessage('correct');
        }
        else if (guess !== '') {
            setTimer(timer - wrongPenalty);
            setFeedbackMessage('incorrect');
        }        
    }

    const showHint = function() {
        if(!hint){
            setTimer(timer-hintPenalty)
            setHint(true)
            setFeedbackMessage(null);
        }
    }

    //Decrement the timer every second
    useEffect(() => {
        if(timer>0 && gameState==="running"){
            let updateTime = setInterval(function(){setTimer(timer-1)}, 1000);
            return function(){clearInterval(updateTime)}
        }
        else if(timer<1){
            setGameState("over")
        }
    }, [timer, gameState]);

    //Hide message after 1.5 seconds
    useEffect(() => {
        if (feedbackMessage) {
            const timer = setTimeout(() => setFeedbackMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [feedbackMessage]);

    return (
        <div className="game-container">
            {gameState === "running" && (
                <>
                    <p className="prompt-text">"{prompts[prompt].definition}"</p>
                    <p className={`time-left ${hint ? 'penalty' : ''}`}>Time Left: {timer}</p>
                    <div className="input-group">
                        <label>Word: </label>
                        <input id="userInput" className="text-input" />
                        <button className="button submit-button" onClick={handleInput}>Submit</button>
                        {!hint && <button className="button hint-button" onClick={showHint}>Hint ({hintPenalty} second penalty)</button>}
                    </div>
                    <p>Points: {points}</p>
                    {hint && <p>Hint: A synonym for the word is {prompts[prompt].hint}</p>}
                    {input !== '' && feedbackMessage === 'correct' && <p>Correct</p>}
                    {input !== '' && feedbackMessage === 'incorrect' && <p>Incorrect (-{wrongPenalty} seconds)</p>}
                </>
            )}
            {gameState === "new" && (
                <button onClick={start}>Click to Start</button>
            )}
            {gameState === "over" && (
                <>
                    <p>Game Over</p>
                    <p>You got {points} point{points !== 1 ? 's' : ''}.</p>
                    <button onClick={start}>Click to Play Again</button>
                </>
            )}
        </div>
    );    
};

export default Game;