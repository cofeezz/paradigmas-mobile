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

### -Ciclo de build e distribuição
 
Na web, o ciclo é curto: depois de salvar o código, rodar o build e publicar no servidor (no Archv Rooms, o front-end vai para a Vercel e o back-end para o Render), todo usuário recebe a versão nova no próximo acesso, porque o navegador baixa os arquivos atualizados. No mobile, o aplicativo fica instalado no aparelho. Depois do build, ele precisa ser assinado e enviado para a App Store ou a Google Play, onde passa pela revisão da Apple ou do Google antes de ser liberado, o que pode levar de horas a dias. E mesmo depois de liberada, a atualização não chega para todos de uma só vez: o usuário precisa atualizar ou ter a atualização automática ligada. Por isso versões antigas e novas do app convivem falando com a mesma API, e o back-end precisa continuar compatível com as antigas. Em projetos Expo, é possível publicar mudanças só de JavaScript sem passar por nova revisão, mas mudanças em código nativo exigem novo build e nova publicação.
 
### -Ciclo de vida do aplicativo
 
Uma aba do navegador fica aberta até o usuário fechá-la, e o navegador, no máximo, reduz a atividade das abas que estão ao fundo. Um programa de desktop roda até ser fechado. No celular, quem controla o ciclo é o sistema operacional: o app pode estar **ativo** (em primeiro plano e em uso), em **segundo plano** (o usuário saiu dele, mas o processo ainda existe) ou ter sido **encerrado pelo sistema** para liberar memória, sem aviso e sem o usuário tê-lo fechado. No iOS existe ainda o estado `inactive`, de transição, como quando chega uma ligação. Por isso o app precisa guardar o que importa antes de ir para segundo plano e se recuperar quando for reaberto. Em geral, o sistema também limita o que o app faz ao fundo para poupar bateria, e só algumas categorias de tarefa, como reprodução de áudio, podem continuar rodando, o que explica o Spotify seguir tocando com a tela bloqueada.
 
### -Restrições do dispositivo
 
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
 
### -Entrada e interação
 
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
 
### -UX mobile
 
O celular é usado em contextos diferentes do desktop: em pé, com uma mão, com pressa e com atenção dividida. Isso favorece fluxos curtos, conteúdo enxuto e poucas decisões por tela. A **zona do polegar** é a região da tela que o polegar alcança com facilidade, em geral a parte de baixo, enquanto o topo é difícil de alcançar em telas grandes. Por isso as ações principais ficam embaixo, como a barra de navegação inferior e os controles do player do Spotify. Entre os **padrões de navegação mobile** estão as abas na parte inferior, a navegação em pilha com botão de voltar e os gestos, como deslizar para trocar de música. No projeto, a barra de filtros ficou no topo da tela, fora da zona do polegar, o que dependendo da forma de uso pode ser uma limitação.
 
Exemplos no código do projeto:
 
```jsx
// FilterBar.js — filtros em uma linha com rolagem horizontal
<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
 
// LibraryScreen.js — grade de duas colunas
<FlatList numColumns={2} />
```
 
---
 
## 2. análise de aplicativo
 
### -Spotify
 
**Plano analisado:** Premium

**Aparelho e sistema operacional:** Sansung A55 & Windows 11 
 
#### Ponto 1 — Rede ausente
 
Quando a rede está ausente no celular e o plano Premium está ativo, o usuário pode tocar as músicas baixadas ou as mais ouvidas acessando por meio de playlist ou pela home no canto superior mostrando seus artistas/álbuns mais tocados. Já na página web nenhuma destas opções está disponível caso o usuário fique sem internet.
 
| App (celular) | Versão web |
|---|---|
<img width="1080" height="2327" alt="image" src="https://github.com/user-attachments/assets/7e190cad-f04f-401d-905f-53bea9788792" /> | <img width="1919" height="989" alt="image" src="https://github.com/user-attachments/assets/df82c11d-1c5b-4172-a45c-abad4a55a8ed" /> |
 
#### Ponto 2 — Zona do polegar
 
Todas as funcionalidades do aplicativo se encontram no canto inferior da tela, como passar, voltar, pausar e ajustar o tempo exato da música. Esta lógica persiste até com o aplicativo em segundo plano. Quando está na tela de bloqueio e o aplicativo aberto em segundo plano, um Widget aparece mostrando apenas funcionalidades básicas (capa, pause/play, próxima faixa e faixa anterior) e dependendo de onde for pressionado ele expandirá e mostrará informações mais detalhadas.
 
| Player no app | Tela de bloqueio |
|---|---|
|<img width="1080" height="2240" alt="image" src="https://github.com/user-attachments/assets/6b953fcf-cc7d-437d-aa93-8a4dda4eae9c" />| <img width="1080" height="2229" alt="image" src="https://github.com/user-attachments/assets/52ce4e52-ce2b-45f0-b5fb-4fb641379164" /> |
 
#### Ponto 3 — Entrada e interação

Ao deslizar a capa da música, ela irá passar para a próxima música se for deslizada da direita para a esquerda, e para a música anterior se for deslizada da esquerda para a direita. Se for deslizada para baixo, o usuário poderá ver mais detalhes sobre a música, como a letra (se o artista disponibilizar), DNA do artista, álbuns e artistas relacionados, shows/turnês disponíveis (se o artista estiver em uma) e o videoclipe da música (se o artista disponibilizar).


#### —Comparação entre versões
 
Como citado anteriormente, uma das funções existentes no mobile, mas inexistente na web, é o próprio "modo offline". Mas existem outras funcionalidades que são exclusivas do app mobile, como o botão "Sua cápsula sonora", que mostra todo o seu histórico de artistas/músicas/álbuns que você escutou no último mês, tendo como diferencial mostrar os minutos totais exatos de músicas tocadas dentro do aplicativo e a sua porcentagem em relação ao resto dos seus amigos e ouvintes da sua região. Esta função não está disponível nem para a web nem para a sua versão executável de computador.
 
 
## —Prática: da web para o React Native


### 1 — Seção reconstruída
 
Foi reconstruída a **tela de biblioteca de jogos** do Archv Rooms (Angular), formada por barra de filtros por plataforma, busca, grade de cards e favoritos.
 
| Componente | Responsabilidade | Props principais | Estado (`useState`) |
|---|---|---|---|
| `LibraryScreen` | Monta a tela, filtra e busca | `games`, `loading`, `error`, `onRetry`, `onGamePress`, `onToggleFavorite`, `initialFavoriteIds` | filtro ativo, texto da busca, "só favoritos", conjunto de favoritos |
| `FilterBar` | Chips de plataforma e favoritos | `filters`, `activeFilter`, `onChangeFilter`, `showOnlyFavorites`, `onToggleFavorites`, `resultCount` | — |
| `SearchBar` | Campo de busca | `value`, `onChangeText`, `onClear` | — |
| `GameCard` | Card do jogo | `game`, `favorito`, `onPress`, `onToggleFavorite` | erro ao carregar a imagem |
 
O estado dos favoritos ficou na `LibraryScreen`, e não no `GameCard`, porque o filtro "só favoritos" e a contagem de jogos encontrados precisam saber quais jogos estão favoritados, e essa informação pertence ao conjunto da tela. Se cada card guardasse o próprio estado, a tela não conseguiria filtrar. Assim, o card só recebe `favorito` e `onToggleFavorite` por props e avisa a tela quando a estrela é tocada. Já o estado de erro da imagem fica no card, porque só interessa a ele.


#### 2. Elementos HTML x componentes nativos
 
**Web (Angular):**
```html
<p class="game-title">{{ game.title }}</p>
```
**React Native:**
```jsx
<Text style={styles.title} numberOfLines={1}>{game.title}</Text>
```
**Por que muda:** O React Native não trabalha com o DOM do navegador: os componentes são traduzidos para elementos nativos do iOS e do Android. Por isso não existe `p`, `span` ou `div`, e todo texto precisa estar dentro de `Text`.
 
#### 3. Listas: `*ngFor` x `FlatList`
 
**Web (Angular):**
```html
<div class="game-card" *ngFor="let game of filteredGames" (click)="onGameClick(game)">
```
**React Native:**
```jsx
<FlatList data={filteredGames} keyExtractor={(game) => String(game.id)} numColumns={2}
  renderItem={({ item }) => <GameCard game={item} onPress={onGamePress} />} />
```
**Por que muda:** O `*ngFor` coloca todos os itens no DOM. Num celular, com pouca memória, renderizar muitos cards de uma vez é caro. A `FlatList` renderiza só os itens perto da área visível, exige uma chave por item (`keyExtractor`) e usa `numColumns` no lugar do grid do CSS.
 
#### 4. Renderização condicional: `*ngIf` x `&&`
 
**Web (Angular):**
```html
<span class="search-clear" *ngIf="searchQuery" (click)="clearSearch()">✕</span>
```
**React Native:**
```jsx
{value.length > 0 && (
  <Pressable onPress={onClear}><Text style={styles.clear}>✕</Text></Pressable>
)}
```
**Por que muda:** O template do Angular tem diretivas próprias, como `*ngIf`. O JSX é JavaScript, então a condição é uma expressão comum, como `&&` ou um ternário, sem diretiva de template.
 
#### 5. `:hover` x feedback de toque
 
**Web (SCSS):**
```scss
.game-card {
  &:hover { transform: translateY(-4px); border-color: $purple-bright; }
}
```
**React Native:**
```jsx
style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
// cardPressed: { borderColor: '#fcfcfc', opacity: 0.85 }
```
**Por que muda:** No toque não existe `hover`, porque não há ponteiro pairando sobre a tela. O que existe é o estado de pressionado durante o toque, que o `Pressable` expõe, e o efeito visual passa a ser uma mudança de estilo enquanto o dedo está sobre o card.
 
#### 6. Estilos: SCSS x `StyleSheet`
 
**Web (SCSS):**
```scss
.game-title { font-size: 11px; color: $text-bright; text-transform: uppercase; }
```
**React Native:**
```jsx
title: { fontSize: 11, color: '#f2f4ff', textTransform: 'uppercase' }
```
**Por que muda:** O SCSS é compilado para CSS, com cascata, herança e variáveis. O `StyleSheet` é um objeto JavaScript, com nomes em camelCase e números sem unidade. Não há cascata nem herança, então cada `Text` precisa da própria cor e fonte, e as variáveis como `$text-bright` viram valores literais ou constantes.
 
#### 7. Eventos: `stopPropagation` x `Pressable` interno
 
**Web (Angular):**
```ts
toggleFavorite(game: Game, event: Event): void {
  event.stopPropagation();
  // ...
}
```
**React Native:**
```jsx
<Pressable onPress={() => onToggleFavorite?.(game)} hitSlop={12}>
```
**Por que muda:** Na web, o clique sobe pela árvore de elementos, então clicar na estrela também dispara o clique do card, e é preciso chamar `stopPropagation`. No React Native, o toque é tratado pelo componente tocável mais interno, então o `Pressable` da estrela captura o toque e o do card não dispara.
 
#### 8. Campo de busca: `ngModel` x `TextInput` controlado
 
**Web (Angular):**
```html
<input class="search-input" type="text" [(ngModel)]="searchQuery" (input)="onSearch()" />
```
**React Native:**
```jsx
<TextInput value={value} onChangeText={onChangeText} placeholder="BUSCAR_JOGO..." />
```
**Por que muda:** O `ngModel` é uma ligação nos dois sentidos própria do Angular, e o React Native não tem isso. O `TextInput` é controlado: o `value` vem do estado e o `onChangeText` atualiza o estado, num fluxo de dados em um só sentido.
 
#### 9. Estado dos favoritos: mutação x cópia
 
**Web (Angular):**
```ts
favoriteIds = new Set<number>();
// ...
this.favoriteIds.add(game.id);
this.cdr.detectChanges();
```
**React Native:**
```jsx
const [favoriteIds, setFavoriteIds] = useState(new Set(initialFavoriteIds));
setFavoriteIds((anterior) => {
  const proximo = new Set(anterior);
  proximo.has(game.id) ? proximo.delete(game.id) : proximo.add(game.id);
  return proximo;
});
```
**Por que muda:** No Angular, o código muda o mesmo `Set` e chama `detectChanges()` manualmente. O React decide se deve redesenhar comparando referências, então mudar o mesmo `Set` não é percebido. Por isso o estado é atualizado com uma cópia nova do `Set`.
 
<!-- Outras possíveis: grid com auto-fill x numColumns; barra lateral x navegação por abas; box-shadow x shadow*/elevation; object-fit x resizeMode; navegação por router x navegação mobile (ainda não implementada). -->
 
---