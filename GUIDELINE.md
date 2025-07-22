# GUIDELINE

Este documento define os padrões e boas práticas para desenvolvimento, testes, nomenclatura, estrutura de pastas, validação, tratamento de erros, notificações, value objects, repositórios, middlewares, formatação e scripts do projeto **manage-my-wallet-backend**.

## 1. Estrutura de Pastas

- `src/config/`: Configurações e constantes do sistema.
- `src/controllers/`: Controllers de cada domínio, organizados por entidade.
- `src/core/domain/`: Domínio da aplicação, contendo entidades, value objects, interfaces, erros, notificações e repositórios.
- `src/core/usecases/`: Casos de uso organizados por entidade e operação (create, update, find, list, delete, etc).
- `src/infrastructure/`: Implementações de infraestrutura (API, banco de dados, criptografia, JWT, e-mail, etc).
- `src/infrastructure/api/express/routes/`: Definição de rotas por entidade.
- `src/infrastructure/api/express/middlewares/`: Middlewares reutilizáveis.
- `src/infrastructure/api/express/__tests__/`: Testes end-to-end (e2e) por entidade.

## 2. Padrão de Nomenclatura

- Classes: PascalCase (ex: `CreateUserUseCase`, `UserController`).
- Arquivos: kebab-case (ex: `create.user.controller.ts`, `user.entity.ts`).
- Métodos: camelCase (ex: `findByName`, `changePassword`).
- DTOs: Sufixo `dto.ts` (ex: `create.user.dto.ts`).
- Interfaces: Sufixo `interface.ts` (ex: `repository.interface.ts`).
- Testes: Sufixo `.spec.ts` para unitários e `.e2e.spec.ts` para e2e.
- Mocks: Sufixo `.mock.ts`.

## 3. Entidades e Value Objects

- Toda entidade herda de `Entity` (`src/core/domain/@shared/entity.interface.ts`).
- Value Objects devem validar seus valores no construtor e lançar `EntityError` em caso de valor inválido (ex: `Email`).
- Notificações de erro são acumuladas via `Notification` e lançadas como `EntityError`.

## 4. Repositórios

- Interfaces de repositório seguem o padrão `RepositoryInterface<T>` com métodos: `create`, `update`, `find`, `findAll`, `delete`.
- Filtros e paginação devem usar as classes `Filter<T>` e `Pagination<T>`.

## 5. Validação

- Toda validação de entidade/value object deve lançar `EntityError` com mensagem descritiva.
- Validações reutilizáveis devem ser implementadas em arquivos separados (ex: `email.validate.ts`).

## 6. Tratamento de Erros e Notificações

- Use sempre a classe `EntityError` para erros de domínio.
- Notificações de erro devem ser acumuladas em `Notification` e lançadas ao final da validação.
- Mensagens de erro devem ser claras e indicar o campo e o motivo.

## 7. Middlewares

- Middlewares devem ser funções puras, exportadas como constantes.
- Exemplo: `authMiddleware` valida JWT e adiciona `userId` ao request.

## 8. Testes

- Testes unitários: arquivos `.spec.ts` próximos ao código testado.
- Testes e2e: arquivos `.e2e.spec.ts` em `src/infrastructure/api/express/__tests__/`.
- Use `jest` e `supertest` para e2e.
- Estrutura dos testes:
   - `beforeAll` para setup global (ex: conectar ao banco).
   - `beforeEach` para limpar mocks e dados.
   - `afterAll` para teardown global.
   - Testes devem cobrir casos de sucesso e erro, validando status HTTP, mensagens e estrutura do response.

## 9. Formatação e Lint

- Use `prettier` com as configurações de `.prettierrc`:
   - trailingComma: es5
   - tabWidth: 3
   - semi: true
   - singleQuote: true
- O pre-commit roda `yarn lint-staged` para garantir formatação automática.

## 10. Scripts e Convenções

- Scripts principais em `package.json`:
   - `test`: roda todos os testes.
   - `test:coverage`: roda testes com cobertura.
   - `build`: compila o projeto.
   - `start:dev`: inicia o servidor em modo desenvolvimento.
   - `start`: inicia o servidor em produção.
- Use aliases de importação conforme configurado em `tsconfig.json` e `package.json` (`@core`, `@infrastructure`, `@controllers`, `@config`).
- Sempre utilize `strict mode` do TypeScript.

## 11. Boas Práticas Gerais

- Separe responsabilidades: controllers apenas orquestram, usecases contêm lógica de negócio, repositórios abstraem persistência.
- Sempre escreva testes para novos casos de uso e entidades.
- Prefira funções puras e imutabilidade sempre que possível.
- Mensagens de commit e PRs devem ser claras e descritivas.
- Siga o padrão de mensagens e estrutura de resposta dos endpoints (sempre incluir `data` e `message`).

---

Este guideline deve ser seguido para toda contribuição, manutenção e prompts futuros relacionados ao projeto.
