# CRUD de Tarefas com Spring Boot e React

Projeto full stack para gerenciamento de tarefas, com backend em Spring Boot e frontend em React/Vite.

O objetivo principal deste projeto e demonstrar a integracao entre uma API REST propria e uma interface em React. O frontend consome diretamente a API Spring Boot por HTTP.

## Tecnologias

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Bean Validation
- H2 Database
- Maven
- Lombok

### Frontend

- React
- Vite
- TanStack Query
- Tailwind CSS
- Radix UI
- Lucide React
- Framer Motion

## Estrutura do projeto

```text
.
+-- api
|   `-- tasks
|       +-- src/main/java/com/proenca/tasks
|       |   +-- config
|       |   +-- controller
|       |   +-- dtos
|       |   +-- entity
|       |   +-- exceptions
|       |   +-- mapper
|       |   +-- repository
|       |   `-- service
|       `-- src/main/resources/application.properties
`-- web
    +-- src
    |   +-- api
    |   +-- components
    |   +-- lib
    |   `-- pages
    `-- package.json
```

## Como a integracao funciona

O frontend nao acessa o banco de dados diretamente. A comunicacao acontece por HTTP:

```text
React -> tasksApi -> apiRequest -> HTTP -> Spring Controller -> Service -> Repository -> H2
```

No frontend, a ponte com o backend fica centralizada em:

- `web/src/api/httpClient.js`: cliente HTTP generico baseado em `fetch`.
- `web/src/api/tasksApi.js`: funcoes especificas para listar, criar, atualizar e deletar tarefas.
- `web/src/pages/Tasks.jsx`: tela que chama `tasksApi` usando TanStack Query.

Exemplo de fluxo ao criar uma tarefa:

1. O usuario preenche o formulario no React.
2. A tela chama `tasksApi.create(formData)`.
3. O `tasksApi` faz `POST /tasks`.
4. O `httpClient` monta a URL usando `VITE_API_BASE_URL`.
5. O Spring recebe a requisicao no controller.
6. O service processa a regra.
7. O repository persiste a tarefa no H2.
8. O frontend invalida a query `tasks`.
9. O frontend busca a lista atualizada com `GET /tasks`.

## Como rodar o frontend

Entre na pasta do frontend:

```bash
cd web
```

Instale as dependencias:

```bash
npm install
```

Crie um arquivo `.env.local` dentro de `web`:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Como o frontend chama `/tasks`, a URL final fica:

```text
http://localhost:8080/api/v1/tasks
```

Rode o frontend:

```bash
npm run dev
```

Por padrao, o Vite sobe em:

```text
http://localhost:5173
```

## Como rodar o backend

Entre na pasta da API:

```bash
cd api/tasks
```

Rode a aplicacao:

```bash
./mvnw spring-boot:run
```

No Windows:

```bash
mvnw.cmd spring-boot:run
```

Por padrao, o Spring Boot sobe em:

```text
http://localhost:8080
```

## Banco H2

O projeto usa H2 para desenvolvimento. A console fica disponivel em:

```text
http://localhost:8080/h2-console
```

Confira os dados reais de conexao no arquivo:

```text
api/tasks/src/main/resources/application.properties
```

Normalmente, em projetos com H2 em memoria, os dados seguem este formato:

```text
JDBC URL: jdbc:h2:mem:<nome-do-banco>
User: sa
Password: vazio
```

## Endpoints da API

Base URL esperada pelo frontend:

```text
http://localhost:8080/api/v1
```

### Listar tarefas

```http
GET /tasks
```

Resposta:

```json
[
  {
    "id": 1,
    "title": "Estudar Spring Boot",
    "description": "Criar uma API REST",
    "status": "pendente",
    "priority": "media",
    "created_at": "2026-05-07T01:00:00"
  }
]
```

### Buscar tarefa por ID

```http
GET /tasks/{id}
```

### Criar tarefa

```http
POST /tasks
Content-Type: application/json
```

Body:

```json
{
  "title": "Nova tarefa",
  "description": "Descricao da tarefa",
  "status": "pendente",
  "priority": "media"
}
```

### Atualizar tarefa

```http
PUT /tasks/{id}
Content-Type: application/json
```

Body:

```json
{
  "title": "Tarefa atualizada",
  "description": "Nova descricao",
  "status": "em_progresso",
  "priority": "alta"
}
```

### Deletar tarefa

```http
DELETE /tasks/{id}
```

Resposta esperada em caso de sucesso:

```http
204 No Content
```

## Modelo de dados

Campos usados pela aplicacao:

| Campo | Tipo | Observacao |
| --- | --- | --- |
| `id` | Long | Gerado automaticamente |
| `title` | String | Titulo da tarefa |
| `description` | String | Descricao da tarefa |
| `status` | String | `pendente`, `em_progresso` ou `concluida` |
| `priority` | String | `baixa`, `media` ou `alta` |
| `created_at` | LocalDateTime | Data de criacao |

## Tratamento de erros

A API possui um handler global para erros. Exemplo de resposta quando uma tarefa nao existe:

```json
{
  "status": 404,
  "title": "NOT_FOUND",
  "message": "Task not found",
  "path": "/api/v1/tasks/2",
  "timeStamp": "2026-05-07T01:13:25.5111151"
}
```

Importante: o corpo do erro e diferente do status HTTP. Para o frontend tratar corretamente, a API precisa retornar o status HTTP real, por exemplo `404 Not Found`, e nao apenas um JSON contendo `"status": 404`.

## CORS

Como o frontend e o backend rodam em portas diferentes, o backend precisa liberar CORS para o Vite:

```text
http://localhost:5173
```

Sem isso, o navegador bloqueia as requisicoes mesmo que a API esteja funcionando corretamente no Postman ou Insomnia.

## Scripts uteis

Frontend:

```bash
cd web
npm run dev
npm run build
npm run typecheck
```

Backend:

```bash
cd api/tasks
mvnw.cmd spring-boot:run
mvnw.cmd test
```

## Observacoes sobre o frontend

Alguns arquivos do template React podem aparecer com avisos de TypeScript no editor, principalmente componentes JSX gerados em `web/src/components/ui`. Esses avisos nao impedem a execucao do projeto.

O ponto mais importante para a integracao e que o arquivo `.env.local` do frontend esteja apontando para a mesma base URL exposta pelo Spring Boot.

## Proximos passos possiveis

- Adicionar testes de controller e service no backend.
- Validar `status` e `priority` com enum ou validacao customizada.
- Padronizar nomes de data entre Java e JSON.
- Adicionar paginacao em `GET /tasks`.
- Adicionar autenticacao futuramente, caso o projeto evolua.

## Autor

`pr0mesy`
