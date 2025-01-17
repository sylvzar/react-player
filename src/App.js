import React, {useState, useRef} from 'react';
import Player from './components/Player';
import Song from './components/Song';
import Library from './components/Library';
import Nav from './components/Nav';
import data from './data';
import './styles/app.scss';
import { library } from '@fortawesome/fontawesome-svg-core';


function App() {
    //Ref
    const audioRef = useRef(null); 
  //State
  const [songs, setSongs] = useState(data());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
    });
  const [libraryStatus, setLibraryStatus] = useState(false);

  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    // Calculate percentage
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const animation = Math.round((roundedCurrent / roundedDuration) * 100)
    setSongInfo({...songInfo, currentTime: current, duration: duration, animationPercentage: animation})
          };
  
  const activeLibraryHandler = (nextPrev) => {
    const newSongs = songs.map((song) => {
      if (song.id === nextPrev.id) {
      return {
      ...song,
      active: true,
      };
      } else {
      return {
      ...song,
      active: false,
      };
      }
      });
        
      setSongs(newSongs);
      };

  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
    if(isPlaying) audioRef.current.play();
    return;
    };

  return (
    <div className={`App ${libraryStatus ? 'library-active' : ""}`}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus}/>
      <Song currentSong={currentSong} />
      <Player setIsPlaying={setIsPlaying} isPlaying={isPlaying} currentSong={currentSong} audioRef={audioRef} setSongInfo={setSongInfo} songInfo={songInfo} songs={songs} setCurrentSong={setCurrentSong} setSongs={setSongs} activeLibraryHandler={activeLibraryHandler}/>
      <Library songs={songs} setCurrentSong={setCurrentSong} audioRef={audioRef} isPlaying={isPlaying} setSongs={setSongs} libraryStatus={libraryStatus} />
      <audio 
      onTimeUpdate={timeUpdateHandler} 
      ref={audioRef} 
      onLoadedMetadata={timeUpdateHandler} 
      src={currentSong.audio}
      onEnded={songEndHandler}></audio>
    </div>
  );
}

export default App;
