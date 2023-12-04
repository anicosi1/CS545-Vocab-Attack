import React, {useState, useEffect} from 'react';

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
    const [correct, setCorrect] = useState(false)
    const [timer, setTimer] = useState(timeLimit)
    //State of the game (new, running, over)
    const [gameState, setGameState] = useState("new")
    //Boolean for whether or not to show the hint
    const [hint, setHint] = useState(false)
    const [points, setPoints] = useState(0)

    const start = function() {
        setGameState("running")
        setTimer(timeLimit)
        setPrompt(Math.floor(Math.random() * prompts.length))
        setHint(false)
        setInput('')
        setPoints(0)
    }

    const handleInput = function() {
        let guess = document.getElementById("userInput").value.trim()
        setInput(guess)
        document.getElementById("userInput").value = ''
        //console.log(prompts[prompt].answer)
        
        //Upon getting the answer correct, select a new prompt
        if(guess !== '' && guess === prompts[prompt].answer){
            let newPrompt = Math.floor(Math.random() * prompts.length)
            //Ensure new prompt isn't same as the one just completed
            while(newPrompt === prompt){
                newPrompt = Math.floor(Math.random() * prompts.length)
            }
            setPrompt(newPrompt)
            setCorrect(true)
            setTimer(timeLimit)
            setHint(false)
            setPoints(points+1)
        }
        else if(guess !== ''){
            setTimer(timer-wrongPenalty)
            setCorrect(false)
        }
    }

    const showHint = function() {
        if(!hint){
            setTimer(timer-hintPenalty)
            setHint(true)
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

    if(gameState==="running"){
        return (
            <div>
                <p>Definition: {prompts[prompt].definition}</p>
                <p>Time Left: {timer}</p>
                <label>Word: </label>
                <input id="userInput"></input>
                <button onClick={handleInput}>Submit</button>
                {!hint && <button onClick={showHint}>Hint ({hintPenalty} second penalty)</button>}
                <p>Points: {points}</p>
                {hint && <p>Hint: A synonym for the word is {prompts[prompt].hint}</p>}
                {input !== '' && correct && <p>Correct</p>}
                {input !== '' && !correct && <p>Incorrect (-{wrongPenalty} seconds)</p>}
            </div>
        )
    }
    else if(gameState==="new"){
        return (
            <div>
                <button onClick={start}>Click to Start</button>
            </div>
        )
    }
    else if(gameState==="over"){
        return (
            <div>
                <p>Game Over</p>
                {points !== 1 && <p>You got {points} points.</p>}
                {points === 1 && <p>You got 1 point.</p>}
                <button onClick={start}>Click to Play Again</button>
            </div>
        )
    }

}

export default Game