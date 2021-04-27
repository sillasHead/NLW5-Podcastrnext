//§ assim como no create-react-app, esse documento sera utilizado
//para ter configuracoes que fiquem por volta de toda aplicacao
//porem sendo chamado uma unica vez
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" /> {/* agiliza a conexao com o servidor de fontes */}
          <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet" />
          <link rel="shortcut icon" href="/favicon.png" type="image/png"/>
        </Head>
        <body>
          <Main /> {/* § onde ficara a aplicacao */}
          <NextScript /> {/* § scripts que o next precisa injetar dentro da
                         aplicacao para que ela funcione */}
        </body>
      </Html>
    );
  }
}
