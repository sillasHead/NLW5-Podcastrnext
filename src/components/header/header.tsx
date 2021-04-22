import format from "date-fns/format";
import ptBR from 'date-fns/locale/pt-BR'

import styles from './header.module.scss';

export default function Header() {
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR, //§ objeto de configuracoes
  });
  
  return (
    <header className={styles['header-container']}>
      <img src="/logo.svg" alt="Podcastr"/>

      <p>O melhor para você ouvir, sempre</p>   

      <span>{currentDate}</span>
    </header>
  );
}