//§roteamento no next eh observado dentro da pasta 'pages'.
//qualquer arquivo .tsx criado dentro da pasta pages e observado no roteamento
//exemplo: arquivo: pages/exemplo.tsx -> localhost:3000/exemplo
//para varias paginas em um mesmo estilo, porem com dados diferentes
//cria-se uma pasta para essa rota, e um arquivo .tsx com colchetes
//exemplo: pages/exemplo/[slug].tsx -> localhost:3000/exemplo/qualquer-coisa

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from 'next/head';
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "../../contexts/PlayerContext";
import { api } from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import styles from "./episode.module.scss";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  description: string;
  duration: number;
  durationAsString: string;
  url: string;
};

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer();

  return (
    <div className={styles['background']}>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>

      <div className={styles["episode"]}>
        <div className={styles["thumbnail-container"]}>
          <Link href="/">
            <button type="button">
              <img src="/arrow-left.svg" alt="Voltar" />
            </button>
          </Link>
          <Image
            width={900}
            height={250}
            src={episode.thumbnail}
            objectFit="cover"
            />
          <button type="button" onClick={() => play(episode)}>
            <img src="/play.svg" alt="Tocar episódio" />
          </button>
        </div>

        <header>
          <h1>{episode.title}</h1>
          <span>{episode.members}</span>
          <span>{episode.publishedAt}</span>
          <span>{episode.durationAsString}</span>
        </header>

        <div
          className={styles["description"]}
          dangerouslySetInnerHTML={{ __html: episode.description }}
          //§ quando nao se sabe de onde os dados estao vindo, para prevenir
          //a fim de evitar a injecao de scripts maliciosos, usamos
          //dangerouslySetInnerHTML={{ __html: localOndeVaiBuscarOsDados }}
          //para converte-lo em html na exibicao da pagina
          />
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
//§ funcao necessaria sempre que a rota seja dinamica ex: episode/[episodes].tsx
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc',
    }
  });

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id,
      }
    }
  });

  return {
    paths, //§ paginas que sempre estarao carregadas
    fallback: "blocking", //§ permite que as demais paginas que nao foram carregadas
    //ainda sejam carregadas, (pelo lado do servidor) no momento em que sao
    //acessadas, e na finalizacao aparecam em tela
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params;

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", { locale: ptBR }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24 horas
  };
};
