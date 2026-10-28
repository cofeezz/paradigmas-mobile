# Paradigmas Mobile: da web para o React Native
 
Este repositório reúne a fundamentação teórica, a análise de dois aplicativos e a reconstrução, em React Native (Expo), da tela de biblioteca de jogos da plataforma web **Archv Rooms**, desenvolvida originalmente em Angular.
 
## Como rodar
 
```bash
npm install
npx expo start
```
 
Abra o app com o **Expo Go** (escaneando o QR code) ou aperte `a` (emulador Android) ou `i` (simulador iOS, só em Mac).
 
## Estrutura do repositório
 
```
README.md
App.js
src/
  components/
    GameCard.js
    FilterBar.js
    SearchBar.js
    LibraryScreen.js
docs/
  apps/          prints da análise dos aplicativos
  comparacao/    prints da comparação web x mobile
```
 
---
## 1. Fundamentação

### 1.1 Ciclo de build e distribuição
 
Na web, o ciclo é curto: depois de salvar o código, rodar o build e publicar no servidor (no Archv Rooms, o front-end vai para a Vercel e o back-end para o Render), todo usuário recebe a versão nova no próximo acesso, porque o navegador baixa os arquivos atualizados. No mobile, o aplicativo fica instalado no aparelho. Depois do build, ele precisa ser assinado e enviado para a App Store ou a Google Play, onde passa pela revisão da Apple ou do Google antes de ser liberado, o que pode levar de horas a dias. E mesmo depois de liberada, a atualização não chega para todos de uma só vez: o usuário precisa atualizar ou ter a atualização automática ligada. Por isso versões antigas e novas do app convivem falando com a mesma API, e o back-end precisa continuar compatível com as antigas. Em projetos Expo, é possível publicar mudanças só de JavaScript sem passar por nova revisão, mas mudanças em código nativo exigem novo build e nova publicação.
 
### 1.2 Ciclo de vida do aplicativo
 
Uma aba do navegador fica aberta até o usuário fechá-la, e o navegador, no máximo, reduz a atividade das abas que estão ao fundo. Um programa de desktop roda até ser fechado. No celular, quem controla o ciclo é o sistema operacional: o app pode estar **ativo** (em primeiro plano e em uso), em **segundo plano** (o usuário saiu dele, mas o processo ainda existe) ou ter sido **encerrado pelo sistema** para liberar memória, sem aviso e sem o usuário tê-lo fechado. No iOS existe ainda o estado `inactive`, de transição, como quando chega uma ligação. Por isso o app precisa guardar o que importa antes de ir para segundo plano e se recuperar quando for reaberto. Em geral, o sistema também limita o que o app faz ao fundo para poupar bateria, e só algumas categorias de tarefa, como reprodução de áudio, podem continuar rodando, o que explica o Spotify seguir tocando com a tela bloqueada.
 
### 1.3 Restrições do dispositivo
 
O celular tem menos recursos e mais variação que um computador. A **bateria** é limitada, e CPU, rede e GPS gastam energia, então o app deve evitar trabalho desnecessário, principalmente ao fundo. A **memória** é menor, e o sistema encerra apps para liberar espaço, por isso listas longas devem renderizar só o que está perto da tela. A **rede** é instável ou ausente com frequência, então o app precisa de estados de carregamento, de erro e de tentar novamente, e quando possível, de conteúdo disponível offline, como as músicas baixadas do Spotify. As **telas** variam em tamanho, densidade e orientação, o que pede layout flexível e medidas independentes de pixel físico. O **notch** e a barra de gestos tomam parte da tela, então o conteúdo deve respeitar a área segura (safe area). Por fim, recursos sensíveis, como **câmera, localização e notificações**, exigem **permissão** pedida em tempo de execução, e o usuário pode negar, então o app precisa continuar funcionando sem elas.
 
Exemplos no código do projeto:
 
```jsx
// LibraryScreen.js — a lista renderiza só os itens próximos da tela
<FlatList data={filteredGames} keyExtractor={(game) => String(game.id)} numColumns={2} />
 
// GameCard.js — se a imagem não carregar, usa uma imagem reserva
<Image
  source={{ uri: imagemComErro ? imagemReserva : game.image }}
  onError={() => setImagemComErro(true)}
  style={styles.image}
/>
 
// App.js — margem fixa no topo, no lugar de tratar a safe area
container: { flex: 1, backgroundColor: '#11131a', paddingTop: 44 }
```
 
### 1.4 Entrada e interação
 
Com mouse e teclado, o ponteiro é preciso, existe `hover`, clique com botão direito e atalhos. No toque, o dedo é impreciso, não existe `hover`, e a interação se faz por toque, segurar, deslizar e pinça. Por isso a área tocável precisa ser grande: a **Apple** recomenda no mínimo 44 x 44 pontos e o Material Design da **Google** recomenda 48 x 48 dp . No código do projeto, o botão de favorito tem 26 pontos visuais, e o `hitSlop` amplia a área tocável sem mudar o desenho. O teclado virtual também ocupa parte da tela e pode cobrir campos e botões, por isso a tela precisa se ajustar a ele e continuar aceitando toques enquanto ele está aberto, como faz o `keyboardShouldPersistTaps` na lista.
 
 
Exemplos no código do projeto:
 
```jsx
// GameCard.js — o botão de favorito tem 26x26 visuais; hitSlop aumenta a área tocável
<Pressable onPress={() => onToggleFavorite?.(game)} hitSlop={12} style={styles.favoriteBtn}>
 
// GameCard.js — feedback de toque no lugar do :hover
style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
 
// LibraryScreen.js — tocar na lista não fecha o teclado da busca
<FlatList keyboardShouldPersistTaps="handled" />
```
 
### 1.5 UX mobile
 
O celular é usado em contextos diferentes do desktop: em pé, com uma mão, com pressa e com atenção dividida. Isso favorece fluxos curtos, conteúdo enxuto e poucas decisões por tela. A **zona do polegar** é a região da tela que o polegar alcança com facilidade, em geral a parte de baixo, enquanto o topo é difícil de alcançar em telas grandes. Por isso as ações principais ficam embaixo, como a barra de navegação inferior e os controles do player do Spotify. Entre os **padrões de navegação mobile** estão as abas na parte inferior, a navegação em pilha com botão de voltar e os gestos, como deslizar para trocar de música. No projeto, a barra de filtros ficou no topo da tela, fora da zona do polegar, o que dependendo da forma de uso pode ser uma limitação.
 
Exemplos no código do projeto:
 
```jsx
// FilterBar.js — filtros em uma linha com rolagem horizontal
<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
 
// LibraryScreen.js — grade de duas colunas
<FlatList numColumns={2} />
```
 
---
 
