import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './player.module.scss';

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null); //§useRef utilizado quando queremos
  //acessar elementos nativos para realizar uma acao nele de forma manual
  //uma boa pratica eh tipar de acordo com o elemento que vamos acessar a fim de atraves
  //do intellisense, saber quais funcoes e dados existem dentro desse elemento, e inicializar
  //como nulo ate que a acao seja executada

  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    clearPlayerState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
  } = usePlayer();

  useEffect(() => {
    if (!audioRef.current) { //§ refs tem uma unica propriedade chamada current que eh o seu valor
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);
  //§useEffect o segundo parametro eh o objeto observado, e toda vez que este tiver
  //o seu valor alterado, o primeiro parametro sera executado. nesse exemplo o
  //isPlaying eh o objeto observado

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
      setProgress(0);
    }
  }

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles["player-container"]}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora {episode?.title}</strong>
      </header>

      {episode ? (
        <div className={styles["current-episode"]}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles["empty-player"]}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles["empty"] : ""}>
        <div className={styles["progress"]}>
          <span>{(convertDurationToTimeString(progress))}</span>
          <div className={styles["slider"]}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: "#04D361" }}
                railStyle={{ backgroundColor: "#9F75FF" }}
                handleStyle={{ borderColor: "#04D361", borderWidth: 4 }}
              />
            ) : (
              <div className={styles["empty-slider"]} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            loop={isLooping}
            autoPlay
            onEnded={handleEpisodeEnded}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles["buttons"]}>
          <button
            type="button"
            disabled={!episode}
            onClick={toggleShuffle}
            className={isShuffling ? styles["is-active"] : ""}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" onClick={playPrevious}  disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            className={styles["play-button"]}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying
              ? <img src="/pause.svg" alt="Tocar" />
              : <img src="/play.svg" alt="Tocar" />
            }
          </button>
          <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles["is-active"] : ""}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
