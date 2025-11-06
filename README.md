# ProjetinhoFront

Projeto feito utilizando [Angular CLI](https://github.com/angular/angular-cli) versão 19.2.15.

## Server local

Para iniciar o desenvolvimento local:

```bash
npm run start
```

Acessar no navegador `http://localhost:4200/`. A aplicação vai recarregar automaticamente quando um arquivo fonte for atualizado.

## Testing

O teste é feito utilizando Jest.  
Para testar e gerar relatório de cobertura:

```bash
npm run test:coverage
```

## API

O projeto utiliza API do [thedogapi.com](thedogapi.com) e configura um Proxy, redirecionando `/api` da aplicação para a API oficial (ver aquivo proxy.conf.json).
A autenticação na API é feita pelo Proxy, utilizando a header configurada, que deve ser obtida criando uma conta gratuíta no serviço.
