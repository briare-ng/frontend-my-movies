import { useState, useEffect } from "react";
import { Popover, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Movie from "./Movie";
import "antd/dist/antd.css";
import styles from "../styles/Home.module.css";
import fetch from "node-fetch";

function Home() {
  const [likedMovies, setLikedMovies] = useState([]);
  const [moviesData, setMoviesData] = useState([]);

  // Liked movies (inverse data flow)
  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.find((movie) => movie === movieTitle)) {
      setLikedMovies(likedMovies.filter((movie) => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  const likedMoviesPopover = likedMovies.map((data, i) => {
    return (
      <div key={i} className={styles.likedMoviesContainer}>
        <span className={styles.popTitle}>{data}</span>
        <FontAwesomeIcon
          icon={faCircleXmark}
          onClick={() => updateLikedMovies(data)}
          className={styles.crossIcon}
        />
      </div>
    );
  });

  const popoverContent = (
    <div className={styles.popoverContent}>{likedMoviesPopover}</div>
  );

  //Fetch vers la route Get /movies avec hook d'effet
  useEffect(() => {
    fetch("https://backend-my-movies.vercel.app/movies")
      // fetch("http://localhost:3000/shows")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.movies);
        // //ajout du tableau à l'état
        setMoviesData(data.movies);
      });
  }, []);

  //mise à jour de movies avec MoviesData.map
  const movies = moviesData.map((data, i) => {
    let posterUrl = "https://image.tmdb.org/t/p/w500";
    const isLiked = likedMovies.some((movie) => movie === data.original_title);
    return (
      <Movie
        key={i}
        updateLikedMovies={updateLikedMovies}
        isLiked={isLiked}
        title={data.original_title}
        overview={data.overview}
        poster={posterUrl + data.poster_path}
        voteAverage={data.vote_average}
        voteCount={data.vote_count}
      />
    );
  });

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logocontainer}>
          <img src="logo.png" alt="Logo" />
          <img className={styles.logo} src="logoletter.png" alt="Letter logo" />
        </div>
        {/* <a>Films</a>
        <a>séries</a> */}
        <Popover
          placement="bottomRight"
          title="Liked movies"
          content={popoverContent}
          className={styles.popover}
          trigger="click"
        >
          <Button>♥ {likedMovies.length} movie(s)</Button>
        </Popover>
      </div>
      <div className={styles.title}>FILMS DU MOMENT</div>
      <div className={styles.moviesContainer}>{movies}</div>
    </div>
  );
}

export default Home;
