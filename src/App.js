import React, {useState} from "react";
import "./App.css";
import RickRollGIF from "./rickroll.gif";
import RickRollStill from "./rickroll_still.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBug, faCheck, faCircleNotch, faCoffee, faSpinner, faTimes} from "@fortawesome/free-solid-svg-icons";


const database_url = "https://raw.githubusercontent.com/realmayus/FrickRoll/master/database.txt";

export default function App() {
    const [spoiler, setSpoiler] = useState(true);
    const [query, setQuery] = useState(null);
    const [result, setResult] = useState(undefined);
    const [error, setError] = useState(null);
    const [currentlyWorking, setCurrentlyWorking] = useState(false);


    const handleFormSubmit = (e) => {
        e.preventDefault();
        const video_id_regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/g;
        let groupArray = [...query.matchAll(video_id_regex)];
        let firstGroup = groupArray.map(m => m[1]);
        if(!!query && query !== "" && firstGroup.length !== 0) {
            setCurrentlyWorking(true);
            fetch(database_url)
                .then((r) => r.text())
                .then(text => {
                    setCurrentlyWorking(false);
                    setResult(true);
                    let videoID = firstGroup[0];
                    let lines = text.split("\n");
                    for(let line in lines) {
                        if(lines[line] === videoID) {
                            setResult(false);
                            return;
                        }
                    }
                    setResult(true);
                })
                .catch((err) => {
                    console.log(err);
                    setResult(null);
                    setError("An error ocurred, please check the log!");
                })
        } else if (firstGroup.length === 0) {
            setResult(null);
            setError("The entered URL is not a valid YouTube link!");
        }

    };

    const openRickRoll = () => {
        var win = window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        win.focus();
    };

    const getCurrentStatusMessage = () => {
        if(query === "") {
            return (
                <div className="statusWrapper">
                    <FontAwesomeIcon className={"statusIcon notSafe"} icon={faTimes} />
                    <span className={"statusText notSafe"}>Please enter a URL</span>
                </div>
            );
        } else if(currentlyWorking) {
            return(
                <div className="statusWrapper">
                    <FontAwesomeIcon className={"statusIcon spinner"} icon={faCircleNotch} />
                    <span className={"statusText"}>Checking your url…</span>
                </div>
            );
        } else if(result === false) {
            return(
                <div className="statusWrapper">
                    <FontAwesomeIcon className={"statusIcon notSafe"} icon={faTimes} />
                    <span className={"statusText notSafe"}>Looks like someone tried to rickroll you!</span>
                </div>
            );
        } else if (result === true) {
            return(
                <div className="statusWrapper">
                    <FontAwesomeIcon className={"statusIcon safe"} icon={faCheck} />
                    <span className={"statusText safe"}>The provided link is safe to visit.</span>
                </div>
            );
        } else if (result === null) {
            return(
                <div className="statusWrapper">
                    <FontAwesomeIcon className={"statusIcon error"} icon={faBug} />
                    <span className={"statusText error"}>{error}</span>
                </div>
            );
        }

    };

    return(
      <div>
          <h1>FrickRoll</h1>
          <h4>Never gonna give you a rickroll again!</h4>
          <form onSubmit={handleFormSubmit}>
              <input id="url" type="url" placeholder="Enter suspicious link here…" disabled={currentlyWorking} onChange={e => {setQuery(e.target.value); setResult(undefined)}}/>
              <button type="submit" disabled={currentlyWorking || query === "" || !query}>Check</button>
          </form>

          {getCurrentStatusMessage()}

          <div className="explanation">
              <h4>What is "rickrolling"?</h4>
              <p>
                  Rickrolling, alternatively rick-rolling, is a prank and an Internet meme involving an unexpected appearance of the music video for the 1987 Rick Astley song "Never Gonna Give You Up".
              </p>
              <p>
                  The meme is a type of bait and switch using a disguised hyperlink that leads to the music video. The victims, believing that they are accessing some unrelated material, are said to have been "rickrolled". The meme has also extended to using the song's lyrics in unexpected places.
              </p>
              <blockquote>- <a className="cntLink" href="https://en.wikipedia.org/wiki/Rickrolling">Wikipedia</a></blockquote>
              <div className="imageWrapper" onClick={() => setSpoiler(!spoiler)}>
                  <div className={"imageSubWrapper"}>
                      <img alt="rickroll GIF" className={spoiler ? "spoiler" : "spoilerInactive"} src={RickRollGIF}/>
                  </div>


                  <div className="spoilerPill" style={{opacity: spoiler ? "1" : "0"}}>SPOILER</div>
              </div>
          </div>


          <footer>
              <div className="footerWrapper">
                  <a href="#" onClick={openRickRoll} className="footerLink">How it works</a> · <a href="https://github.com/realmayus/FrickRoll" className="footerLink">Source Code</a> · <a href="https://realmayus.xyz/legal" className="footerLink">Legal stuff</a> · <a href="https://github.com/realmayus/FrickRoll/issues" className="footerLink">Report false negative</a>
              </div>
          </footer>
      </div>
    );
}
