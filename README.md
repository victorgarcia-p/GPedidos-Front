# GPedidos - Frontend Angular

Sistema de gestão de pedidos desenvolvido em Angular com funcionalidades completas de CRUD para todas as entidades.

## 🚀 Funcionalidades

### 📋 Pedidos
- **Listagem de pedidos** com status e ações
- **Criação de pedidos** com fluxo completo:
  - Seleção de cliente (com opção de criar novo)
  - Adição de produtos (com opção de criar novo)
  - Carrinho com controle de quantidade e desconto
  - Aplicação de cupons de desconto
- **Edição de pedidos** (apenas rascunhos e confirmados)
- **Visualização detalhada** de pedidos
- **Ações disponíveis**:
  - Baixar pedido (registrar pagamento)
  - Faturar pedido (gerar nota fiscal)
  - Cancelar pedido (desfaz baixas e faturas)

### 👥 Clientes
- **CRUD completo** de clientes
- **Validação de CPF** com formatação automática
- **Validação de email** e telefone
- **Status ativo/inativo**

### 📦 Produtos
- **CRUD completo** de produtos
- **Controle de estoque** (atual, separação, inicial)
- **SKU único** para identificação
- **Preços unitários** com validação

### 🎫 Cupons
- **CRUD completo** de cupons
- **Tipos de desconto**: valor fixo ou porcentagem
- **Controle de validade** (data início e fim)
- **Uso máximo** configurável
- **Status visual** (válido, expirado, futuro)

### 💰 Lançamentos
- **Visualização** de todos os lançamentos
- **Baixa de lançamentos** (parcial ou total)
- **Cancelamento** de lançamentos
- **Status visual** (aguardando, parcial, baixado, cancelado)

## 🛠️ Tecnologias Utilizadas

- **Angular 20** (Standalone Components)
- **TypeScript**
- **SCSS** para estilização
- **Angular Router** para navegação
- **Angular Forms** (Reactive Forms)
- **Angular HTTP Client** para comunicação com API

## 📁 Estrutura do Projeto

```
src/app/
├── models/                 # Interfaces e tipos TypeScript
├── services/              # Serviços para comunicação com API
├── shared/components/     # Componentes reutilizáveis
│   ├── data-table/       # Tabela genérica com ações
│   └── modal/            # Modal genérico
├── modules/              # Módulos de funcionalidades
│   ├── pedidos/         # Módulo de pedidos
│   ├── clientes/        # Módulo de clientes
│   ├── produtos/        # Módulo de produtos
│   ├── cupons/          # Módulo de cupons
│   └── lancamentos/     # Módulo de lançamentos
└── app.*                # Componente principal e configurações
```

## 🔧 Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar URL da API
Edite o arquivo `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7000/api' // URL do seu backend
};
```

### 3. Executar o projeto
```bash
ng serve
```

O projeto estará disponível em `http://localhost:4200`

## 🔗 Integração com Backend

O frontend está preparado para se comunicar com o backend .NET através das seguintes rotas:

### Pedidos
- `GET /api/pedidos` - Listar pedidos
- `GET /api/pedidos/{id}` - Obter pedido por ID
- `POST /api/pedidos` - Criar pedido
- `PUT /api/pedidos/{id}` - Atualizar pedido
- `PUT /api/pedidos/{id}/baixar` - Baixar pedido
- `PUT /api/pedidos/{id}/faturar` - Faturar pedido
- `PUT /api/pedidos/{id}/cancelar` - Cancelar pedido

### Clientes
- `GET /api/clientes` - Listar clientes
- `GET /api/clientes/{id}` - Obter cliente por ID
- `POST /api/clientes` - Criar cliente
- `PUT /api/clientes/{id}` - Atualizar cliente
- `DELETE /api/clientes/{id}` - Excluir cliente

### Produtos
- `GET /api/produtos` - Listar produtos
- `GET /api/produtos/{id}` - Obter produto por ID
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/{id}` - Atualizar produto
- `DELETE /api/produtos/{id}` - Excluir produto

### Cupons
- `GET /api/cupons` - Listar cupons
- `GET /api/cupons/{codigo}` - Obter cupom por código
- `POST /api/cupons` - Criar cupom
- `PUT /api/cupons/{codigo}` - Atualizar cupom
- `DELETE /api/cupons/{codigo}` - Excluir cupom

### Lançamentos
- `GET /api/lancamentos` - Listar lançamentos
- `GET /api/lancamentos/{id}/{parcela}` - Obter lançamento
- `POST /api/lancamentos/{id}/{parcela}/baixar` - Baixar lançamento
- `PUT /api/lancamentos/{id}/{parcela}/cancelar` - Cancelar lançamento

## 🎨 Interface

- **Design responsivo** que funciona em desktop e mobile
- **Navegação intuitiva** com menu lateral
- **Tabelas interativas** com ações contextuais
- **Modais** para confirmações e formulários
- **Validação em tempo real** nos formulários
- **Feedback visual** para todas as ações

## 📱 Responsividade

O sistema é totalmente responsivo e se adapta a diferentes tamanhos de tela:
- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Layout adaptado com navegação otimizada
- **Mobile**: Interface simplificada e touch-friendly

## 🔒 Validações

- **Formulários**: Validação em tempo real com mensagens de erro
- **CPF**: Formatação automática e validação
- **Email**: Validação de formato
- **Telefone**: Formatação automática
- **Datas**: Validação de períodos e datas futuras
- **Valores**: Validação de valores positivos e decimais

## 🚀 Próximos Passos

1. **Implementar as rotas no backend** conforme especificado
2. **Configurar CORS** no backend para permitir requisições do frontend
3. **Testar a integração** entre frontend e backend
4. **Implementar autenticação** se necessário
5. **Adicionar testes unitários** e de integração
6. **Configurar CI/CD** para deploy automático

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Se o backend está rodando na porta configurada
2. Se as rotas da API estão implementadas corretamente
3. Se o CORS está configurado no backend
4. Se os dados estão sendo enviados no formato correto

---

**Desenvolvido com ❤️ usando Angular**