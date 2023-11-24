import React, {useState, useEffect} from 'react';

const Home = function() {

    //Definitions gotten from Google
    const prompts = [
        {definition: "a piece of land surrounded by water",
        answer: "island"},
        {definition: "a large area of flat land with few trees",
        answer: "plain"},
        {definition: "an area of low-lying, uncultivated ground where water collects; a bog or marsh.",
        answer: "swamp"}
    ]

    let timeLimit = 60;
    
    const [input, setInput] = useState("")
    //Contains some index within the list of prompts
    const [prompt, setPrompt] = useState(Math.floor(Math.random() * prompts.length))
    //Boolean dependent on if the user got the answer right or not
    const [correct, setCorrect] = useState(false)
    const [timer, setTimer] = useState(timeLimit)

    const handleInput = function() {
        let guess = document.getElementById("userInput").value
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
        }
        else{
            setCorrect(false)
        }
    }

    //Decrement the timer every second
    useEffect(() => {
        if(timer>0){
            let updateTime = setInterval(function(){setTimer(timer-1)}, 1000);
            return function(){clearInterval(updateTime)}
        }
    }, [timer]);

    return (
        <div>
            <p>{prompts[prompt].definition}</p>
            <p>Time Left: {timer}</p>
            <input id="userInput"></input>
            <button onClick={handleInput}>Submit</button>
            {input !== '' && correct && <p>Correct</p>}
            {input !== '' && !correct && <p>Incorrect</p>}
        </div>
    )
}

export default Home