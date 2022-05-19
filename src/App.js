import { useState, useEffect } from "react";
import myTestData from "./debug_data/allYourSpotifyAlbums.json";
import "./App.css";
import Spotify from "./components/Spotify";
import Albums from "./components/Albums";

const DEBUG_READ_JSON = false;

function App() {
  const [spotifyLibrary, setSpotifyLibrary] = useState([]);

  useEffect(() => {
    if (DEBUG_READ_JSON) {
      setSpotifyLibrary(myTestData);
      return;
    }
  }, []);

  return (
    <div className="App">
      {!spotifyLibrary.length && <Spotify callbackReturnLibrary={setSpotifyLibrary} />}
      {spotifyLibrary.length > 0 && (
        <section id="users-albums">
          <h2>Your albums</h2>
          <Albums albums={spotifyLibrary} />
        </section>
      )}
    </div>
  );
}

export default App;
