// SPA Single Page Application 
// SSR Server Side Rendering
// SSG Static Site Generator

//§ utilizando SSG
export default function Home(props) {
  console.log(props.episodes);
  
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

export async function getStaticProps() { //§ o primeiro carregamento desse componente eh feito pela camada do next (servidor node)
  const response = await fetch('http://localhost:3333/episodes'); //§ chamada API
  const data = await response.json(); //§ convertendo resposta em json

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8, //§ faz uma requisicao ao servidor a cada 8 horas
  }
}