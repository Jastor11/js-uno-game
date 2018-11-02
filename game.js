let Game = {
    deck: null,    
    players: {},
    playersTurn: null,
    topCard: null,
    topCardColor: null,
    topCardValue: null,
    direction: 1
}

function makeNewCards(){
    const cards = [
        'red_0',
        'red_1', 'red_2', 'red_3', 'red_4', 'red_5', 'red_6', 'red_7', 'red_8', 'red_9',
        'red_1', 'red_2', 'red_3', 'red_4', 'red_5', 'red_6', 'red_7', 'red_8', 'red_9',
        'red_skip', 'red_reverse', 'red_draw_two',
        'red_skip', 'red_reverse', 'red_draw_two',
        
        'green_0',
        'green_1', 'green_2', 'green_3', 'green_4', 'green_5', 'green_6', 'green_7', 'green_8', 'green_9',
        'green_1', 'green_2', 'green_3', 'green_4', 'green_5', 'green_6', 'green_7', 'green_8', 'green_9',
        'green_skip', 'green_reverse', 'green_draw_two',
        'green_skip', 'green_reverse', 'green_draw_two',
        
        'blue_0',
        'blue_1', 'blue_2', 'blue_3', 'blue_4', 'blue_5', 'blue_6', 'blue_7', 'blue_8', 'blue_9',
        'blue_1', 'blue_2', 'blue_3', 'blue_4', 'blue_5', 'blue_6', 'blue_7', 'blue_8', 'blue_9',
        'blue_skip', 'blue_reverse', 'blue_draw_two',
        'blue_skip', 'blue_reverse', 'blue_draw_two',
        
        'yellow_0',
        'yellow_1', 'yellow_2', 'yellow_3', 'yellow_4', 'yellow_5', 'yellow_6', 'yellow_7', 'yellow_8', 'yellow_9',
        'yellow_1', 'yellow_2', 'yellow_3', 'yellow_4', 'yellow_5', 'yellow_6', 'yellow_7', 'yellow_8', 'yellow_9',
        'yellow_skip', 'yellow_reverse', 'yellow_draw_two',
        'yellow_skip', 'yellow_reverse', 'yellow_draw_two',
        
        'wild_draw_four','wild_draw_four', 'wild', 'wild',
        'wild_draw_four','wild_draw_four', 'wild', 'wild',
    ]    
    
    return cards
}

// create a function that takes an array of cards 
// and returns a new array of shuffled cards
function shuffle( cards ){
    // create an array to hold the shuffled cards
    const deck = [ ]
    // algorithm to shuffle a deck of cards
    // as long as there are cards in the cards array
    while (cards.length > 0) {
        // pick a random number between 0 and the length of the cards array
        let randomNumber = Math.floor(Math.random( ) * cards.length)
        // then use that number to pick a card
        let card = cards[randomNumber]
        // console.log('card is '+card)
        // push that card onto the new deck
        deck.push(card)
        // remove the card from the original deck
        cards.splice(randomNumber, 1)        
    }
    return deck
}

function dealCard(deck){
    if (deck.length <= 0) {
        let cards = makeNewCards()
        deck = shuffle(cards)
        Game.deck = deck
    }
    return deck.shift()
}

function startNewGame(){
    // create a new set of cards 
    let cards = makeNewCards()
    // shuffle those cards
    let deck = shuffle(cards)
    // and attach them to the Game object
    Game.deck = deck
    
    // add up to four players to the Game object
    //                        0           1           2           3 
    const playerNames = ["Kimberlina", "Ismael", "Albertito", "Jeremy" ]
    const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    for (let i = 0; i < playerNames.length; i++) {
        // get the player name 
        let name = playerNames[i]
        let id = ALPHABET[i]
        let player = createNewPlayer(name, id)
        Game.players[id] = player
    }
    
    // flip the top on the deck over to start the game
    let discard = dealCard(Game.deck)
    let val = getCardValue(discard)
    let color = getCardColor(discard)
    let valid = false
    while (!valid) {
        if (
            color === 'wild'  ||
            val === 'reverse' || 
            val === 'skip'    || 
            val === 'draw_two'
        ) {
            discard = dealCard(Game.deck)
            val = getCardValue(discard)
            color = getCardColor(discard)              
        } else {
            valid = true
        }
    }
    Game.topCard = discard
    let topCardEl = document.querySelector('#deck')
    topCardEl.setAttribute('src', 'images/'+discard+'.png')
    Game.topCardValue = val    
    Game.topCardColor = color

    
    Game.playersTurn = 'A'
    showGameObject()
    displayUserOptions('Start by picking a card from your hand to play.')
}

function createNewPlayer( playerName, id ){
    // every player has to have a name
    // cards
    // points
    let player = {
        id: id,
        name: playerName,
        cards: [ ],
        points: 0
    }
    
    for (let i = 0; i < 7; i++){
        let card = dealCard(Game.deck)
        player.cards.push(card)
    }
    
    return player
}

function showGameObject(){
    const codeSectionEl = document.querySelector('#game-object')
    codeSectionEl.innerHTML = JSON.stringify(Game, null, 2)
}

function changePlayersTurn(){
    // get the alphabet
    // const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] 
    const ALPHABET = Object.keys(Game.players)
    // get the index of the current player's turn in the alphabet array 
    const idx = ALPHABET.indexOf(Game.playersTurn)
    // change that index by +1 or -1 depending on if a reverse has been played
    let newIdx = idx + Game.direction
    // check to see if that index is less than zero
    // or more than the length of the array
    if (newIdx < 0) {
        // if it is < 0, set it to the index 
        // at the end of the alphabet
        newIdx = ALPHABET.length - 1
    } else if (newIdx >= ALPHABET.length) {
        // if it is > ALPHABET.length, set it equal to the index
        // at the beginning of the alphabet
        newIdx = 0
    }
    // change the current players turn in the Game object
    Game.playersTurn = ALPHABET[newIdx]
}

function getCardColor(cardName){
    // each card looks like 'blue_7' or 'red_skip'
    // split the string at the underscore
    // this turns it into an array
    const splitCard = cardName.split('_')
    const color = splitCard[0]
    // color could be 'red', 'yellow', 'blue', 'green', or 'wild'
    return color
}

function getCardValue(cardName){
    // each card looks like 'blue_7' or 'red_skip'
    // split the string at the underscore
    // this turns it into an array
    const splitCard = cardName.split('_')
    // splitCard[0] will be the color    
    // const color = splitCard[0]
    // splitCard[1] could be either 
    // '1', '2', '3', '4', '5, '6', '7', '8', '9' or
    // 'skip', 'reverse', 'draw' and undefined    
    let numberOrAction = splitCard[1]
    // if splitCard[1] is 'draw'
    // then splitCard[2] will be either 'two' or 'four'
    if (numberOrAction === 'draw') {
        // concatenate that amount back onto the numberOrAction
        numberOrAction += '_'+splitCard[2]
    }
    
    return numberOrAction
}

function playCard(playerId, cardName){
    // get the card's color
    const color = getCardColor(cardName)
    // get the card's value
    const val = getCardValue(cardName)     
    
    // check to make sure they're allowed to play this card
    const allowed = cardIsPlayable(color, val)
    if (!allowed) {
        // it it's not allowed, notify the user and make them select again
        promptUser('You are not allowed to play that card. Try again.')
        // return early to end the function
        return 
    }
    const playerEl = document.querySelector('#current-players-hand')
    playerEl.innerHTML = ''       
    // otherwise continue on
    setTimeout( () => {
        // clear cards in hand
     
        // check to make sure color is not a wild or a wild draw four
        if (color === 'wild') {
            // if it is a wild card, call the playWildCard function
            // this will let the user pick the color
            console.log('playing a wild card')
            playWildCard(playerId)
        } else {
            // otherwise set the Game.topCardColor to the color
            Game.topCardColor = color
        }
    
        // check the possible options for the value
        
        // if val is undefined, it was just a wild, so do nothing
        if (val === undefined) {
            
            console.log('val is undefined')
        }
        // if it is a skip, call the skipTurn function
        if (val === 'skip') {
            console.log('skipping a turn')
            skipTurn()
        }
        // if it is a draw_two, call the playerDrawTwo function
        if (val === 'draw_two') {
            console.log('player draw two')
            playerDrawTwo(playerId)
        }        
        // if it is a wild_draw_four, call the playerDrawFour function    
        if (val === 'draw_four') {
            console.log('player draw two')
            playerDrawFour(playerId)
        }         
        // if it is a reverse, call the reverse turn function 
        if (val === 'reverse') {
            console.log('player reverse')
            reverseTurn()
        } 
        
        // check to see if value is a number: 
        // turn it into a number and use Number.isNaN() on it
        // const num = Number(val)    
    
        // if ( Number.isNaN(num) ) { 
        //     // if val is not a number, then
        //     // it was an action so we already handled it
        //     // just set the Game.topCardValue to val
        //     Game.topCardValue = val        
        // } else {
        //     // if val is a number, then
        //     // just set the Game.topCardValue to val also
        //     Game.topCardValue = val        
        // }
        // notice how we actually didn't need to do this?
        // the result is the same either way
        
        Game.topCardValue = val        
        
        // change topCard to be the played card
        Game.topCard = cardName
        // remove card from player's hand  
        removeCardFromPlayersHand(playerId, cardName)
        // make top card on deck the new card
        let topCardEl = document.querySelector('#deck')
        topCardEl.setAttribute('src', 'images/'+cardName+'.png')
        // change to the next player's turn
        changePlayersTurn()
        // end the users turn
        console.log('ending turn')
        endTurn()
    }, 1000)
}

function playerDrawCardAndGoAgain(playerId){
    const card = dealCard(Game.deck)
    Game.players[playerId].cards.push(card)
    showGameObject()
    displayUserOptions('Select a card or draw one.')
}

function getNextPlayerId(playerId){
    // get the alphabet
    // const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] 
    const ALPHABET = Object.keys(Game.players)
    // get the index of the current player's turn in the alphabet array 
    const idx = ALPHABET.indexOf(playerId)
    // change that index by +1 or -1 depending on
    // which direction the round is going
    let newIdx = idx + Game.direction
    // check to see if that index is less than zero
    // or more than the length of the array
    if (newIdx < 0) {
        // if it is < 0, set it to the index 
        // at the end of the alphabet
        newIdx = ALPHABET.length - 1
    } else if (newIdx >= ALPHABET.length) {
        // if it is > ALPHABET.length, set it equal to the index
        // at the beginning of the alphabet
        newIdx = 0
    }    
    // get the next player's id  
    const nextPlayerId = ALPHABET[newIdx]    
    
    return nextPlayerId
}

function playerDrawCard(playerId){
    const nextPlayerId = getNextPlayerId(playerId)
    // take a card off the top of the deck
    const newCard = dealCard(Game.deck)
    // and put it in the next player's cards array
    const nextPlayer = Game.players[nextPlayerId]
    nextPlayer.cards.push(newCard)
}

function skipTurn(){
    // call the change players turn function one extra time
    changePlayersTurn()
}

function playerDrawTwo(playerId){
    const nextPlayerId = getNextPlayerId(playerId)
    
    console.log(`player ${playerId} made player ${nextPlayerId} draw two`)
    // call the playerDrawCard function twice
    playerDrawCard(playerId)
    playerDrawCard(playerId)
}

function playerDrawFour(playerId){
    const nextPlayerId = getNextPlayerId(playerId)
    console.log(`player ${playerId} made player ${nextPlayerId} draw four`)    
    // call the playerDrawCard function four times
    playerDrawCard(playerId)
    playerDrawCard(playerId)
    playerDrawCard(playerId)
    playerDrawCard(playerId)    
}

function reverseTurn(){
    // change the Game.direction
    // from either 1 to -1
    // or -1 to 1
    Game.direction = Game.direction * -1
}

function playWildCard(playerId){
    // create a loop that keeps prompting the user
    // until they pick a valid color
    let valid = false
    while (!valid) {
        // prompt the player to pick a color
        let newColor = prompt('What color would you like to change to?')
        // check to make sure the color they entered is valid   
        if (newColor === 'green' || newColor === 'yellow' || newColor === 'blue' || newColor === 'red'){
            // if it is, set the Game.topCardColor to that color
            Game.topCardColor = newColor
            // set valid to tru
            valid = true
        } else {
            // alert the user that the color they entered is not valid
            alert('Color: '+newColor+' was not valid. Choose either red, green, yellow, or blue.')
        }    
    }
}

function cardIsPlayable(cardColor, cardValue){
    // if the card that is being played is the same color
    // as the top card's color, return true
    if (cardColor === Game.topCardColor) {
        return true
    }
    
    // if the card that is being played has the same value
    // as the top card's value, return true
    if (cardValue === Game.topCardValue) {
        return true
    }
    
    // if card is a wild, return true
    if (cardColor === 'wild') {
        return true
    }
    
    // otherwise return false
    return false
}

function removeCardFromPlayersHand(playerId, cardName){
    console.log(`removing ${cardName} from ${playerId}`)
    const player = Game.players[playerId]
    
    player.cards = player.cards.filter(function(card){
        return card !== cardName
    })
}

function promptUser(message){
    // alert the user of the what to do
    alert(message)
    // display the current user's options
    displayUserOptions()
}

function displayUserOptions(message){
    if (message) {
        alert(message)
    }
    const answer = confirm('Is the next player ready?')
    if (answer) {
        console.log('all good here')
    } else {
        // displayUserOptions('Shall we get back to it?')
        return displayUserOptions('Shall we get back to it?')
    }
    // get the player who's turn it is
    const currentPlayerId = Game.playersTurn
    const currentPlayer = Game.players[currentPlayerId]
    // get all the cards in their hand
    const currentPlayersHand = currentPlayer.cards
    // get their HTML section
    // const playerEl = document.querySelector('#player'+currentPlayerId)
    const playerEl = document.querySelector('#current-players-hand')
    // display a screen for them with their options
    playerEl.style.position = 'fixed'
    playerEl.style.background = 'white'
    playerEl.style.width = '100vw'
    playerEl.style.height = '30vh'
    playerEl.style.left = '0'
    playerEl.style.bottom = '0'
    playerEl.style.display = 'flex'
    playerEl.style.overflowX = 'scroll'
    // playerEl.style.padding = '20px'
    
    let cardsHTML = ''
    currentPlayersHand.forEach(function(cardName){
        cardsHTML += `<img class="player-card" src="images/${cardName}.png" onclick="playCard('${currentPlayerId}', '${cardName}')" />`
    })
    cardsHTML += `<button onclick="playerDrawCardAndGoAgain('${currentPlayerId}')"   class="game-button">Draw A Card</button>`
    cardsHTML += `<h3 style="position:fixed;background:white;bottom:10px;left:40vw">${currentPlayer.name}'s Turn</h3>`
    playerEl.innerHTML  = cardsHTML
}

function endTurn(){
    // refresh game object
    showGameObject()
    for (let playerId in Game.players) {
        let player = Game.players[playerId]
        if (player.cards.length === 0) {
            return endGame(player.name)
        }
    }

    // check to see if any user has won yet
    // if no one has
    // prompt the user to pass the computer to the next person
    // when they click ok, start the next round
    // by showing them their hand and letting them play a card
    displayUserOptions('Choose a card from your hand to play.')
}

function endGame(name){
    alert(`Uno! ${name} has won the game.`)
}