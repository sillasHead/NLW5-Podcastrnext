import Header from '../components/header/header';
import Player from '../components/player/player';
import styles from '../styles/app.module.scss';
import '../styles/global.scss';


function MyApp({ Component, pageProps }) {
  return (
    <div className={styles['wrapper']}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
      <Player />
    </div>
  );
}

export default MyApp
//§ myapp eh carregado em todas as rotas
//coloco os componentes que aparecerao em todas as telas