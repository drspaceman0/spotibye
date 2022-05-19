import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

import { CLIENT_ID, REDIRECT_URI, AUTH_ENDPOINT, RESPONSE_TYPE } from "../Credentials";

const SCOPE = "user-read-private user-read-email user-library-read";

function Spotify({ callbackReturnLibrary }) {
  const [token, setToken] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    console.log({ token });
    setToken(token);
  }, []);

  const logout = () => {
    console.log("logging out");
    setToken("");
    window.localStorage.removeItem("token");
  };

  const getUserAlbums = async () => {
    const library = [];
    console.log("getUserAlbums");
    const { data } = await axios.get("https://api.spotify.com/v1/me/albums", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: 50,
      },
    });

    const totalAlbums = data.total;
    library.push(...formatAlbumData(data));

    if (library.length >= totalAlbums) {
      // we only needed to do the inital call. cool
      callbackReturnLibrary(library);
      return;
    }

    const promises = [];
    for (let i = 50; i < totalAlbums; i += 50) {
      const p = axios.get(`https://api.spotify.com/v1/me/albums`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          offset: i,
          limit: 50,
        },
      });
      promises.push(p);
    }
    console.log("lets do an all promise");

    await Promise.all(promises).then((data) => {
      for (let d of data) {
        library.push(...formatAlbumData(d.data));
      }
    });

    console.log("finished getting all albums");

    const filename = "allYourSpotifyAlbums.json";
    const jsonStr = JSON.stringify(library);

    let element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(jsonStr));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    callbackReturnLibrary(library);
  };

  const formatAlbumData = (data) => {
    const result = [];
    for (let d of data.items) {
      const dateAdded = d.added_at;
      const artist = getArtistsName(d.album.artists);
      const name = d.album.name;
      const img = d.album.images[2].url;
      const id = d.album.id;
      /// Add tracks??
      result.push({ dateAdded, artist, name, img, id });
    }
    return result;
  };

  const getArtistsName = (artistsData) => {
    return artistsData.map((e) => e.name).join(", ");
  };

  console.log("Rendered Spotify.js");
  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&SCOPE=${SCOPE}`}>Login to Spotify</a>
        ) : (
          <>
            <button onClick={logout}>Logout</button>
            <button onClick={getUserAlbums}>Get Spotify Library</button>
          </>
        )}
      </header>
    </div>
  );
}

export default Spotify;
