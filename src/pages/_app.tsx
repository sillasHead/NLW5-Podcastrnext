import { useState } from 'react';
import Header from '../components/header/header';
import Player from '../components/player/player';
import { PlayerContext } from '../contexts/PlayerContext';
import styles from '../styles/app.module.scss';
import '../styles/global.scss';


function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  return (
    <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play, isPlaying, togglePlay, setPlayingState }}>
    {/* § todos os componentes dentro desse contexto tem acesso aos dados dentro dele */}
      <div className={styles['wrapper']}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  );
}

export default MyApp
//§ myapp eh carregado em todas as rotas
//coloco os componentes que aparecerao em todas as telas
