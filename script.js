

const body = document.body;
const playBtn = document.getElementById('play')
const gameGridContainer = document.querySelector('.game-grid-container')
const headerTitle = document.querySelector('.header-title')
const modalPopUp = document.querySelector('.modal-overlay')
const popUpMsg = document.querySelector('.popup-close')

let cardsChosen = []
let cardsChosenId = []
let cardsWon = []

   // Card Img Options
   const cardArray = [
    {
        name: 'Ginger',
        img: 'img/ginger.jpg'
    },
    {
        name: 'Ginger',
        img: 'img/ginger.jpg'
    },
    {
        name: 'Leo',
        img: 'img/leo.jpg'
    },
    {
        name: 'Leo',
        img: 'img/leo.jpg'
    },
    {
        name: 'Lulu',
        img: 'img/lulu.jpg'
    },
    {
        name: 'Lulu',
        img: 'img/lulu.jpg'
    },
    {
        name: 'Mow',
        img: 'img/mow.jpg'
    },
    {
        name: 'Mow',
        img: 'img/mow.jpg'
    },
    {
        name: 'Onyx',
        img: 'img/onyx.jpg'
    },
    {
        name: 'Onyx',
        img: 'img/onyx.jpg'
    },
    {
        name: 'Tibbs',
        img: 'img/tibbs.jpg'
    },
    {
        name: 'Tibbs',
        img: 'img/tibbs.jpg'
    }
]

// Window Load - Sets the Body Height to "Auto", once the game start if under 800px
window.addEventListener("load", function() {
    if (gameGridContainer.classList.contains('show') && window.matchMedia("(max-width: 800px)").matches) {
        body.style.height = "auto"
    } else if (!gameGridContainer.classList.contains('show') && window.matchMedia("(max-width: 800px)").matches) {
        body.style.height = "100vh"
    }
  })

// Shuffles cards
cardArray.sort(() => 0.5 - Math.random())

// PlayBtn - Starts Game
playBtn.addEventListener('click', createBoard)

      function createBoard() {
        playBtn.remove()

        headerTitle.innerHTML =
        ` 
        <h3>In The Bag: <span id="result">${cardsWon}</span></h3>
        `

        gameGridContainer.classList.add('show')

        const gameGridDiv = document.createElement('div')
        
        gameGridContainer.appendChild(gameGridDiv)
        gameGridDiv.classList.add('game-grid')

        requestAnimationFrame(() => {
            gameGridDiv.classList.add('show')
        })

        for (let i = 0; i < cardArray.length; i++) {
          const card = document.createElement('div')

          card.setAttribute('data-id', i)
          card.addEventListener('click', flipCard)

          const gameGrid = document.querySelector('.game-grid')
          gameGrid.appendChild(card)

          card.classList.add('card')
          card.innerHTML = `
          <img src="img/blank.jpg">
          <i class="fas fa-cat"></i>
         `
        }
      }

// Clears Cards
function clearCards() {
    const cards = document.querySelectorAll('div img')
    const resultDisplay = document.getElementById('result')

    cards.forEach(card => {
        card.parentElement.classList.remove('active')
        card.parentElement.innerHTML = 
        `
        <img src="img/blank.jpg">
        <i class="fas fa-cat"></i>
        `
        cardsWon = []
        resultDisplay.innerText = 0
      })
}

// Clear Modal setTimeout - Same Card & Mismatch
let modalTime

function setModalTime() {
    modalTime = setTimeout(() => {
        modalPopUp.style.display = 'none'
        clearCards()
    }, 1500)
}

// Clear Modal setTimeout - Match & End of Game
let modalEndofGame

function clearModalEndofGame() {
    modalEndofGame = setTimeout(() => {
        modalPopUp.style.display = 'none'
    }, 1500)
}

// Clear Modal by window click
function clearModal() {
    window.onclick = function (e) {
        if (e.target == modalPopUp) {
            if (e.target.innerText === 'SAME IMAGE CLICKED. TRY AGAIN!') {

                modalPopUp.style.display = 'none'
                clearCards()
                clearTimeout(modalTime)
                
            } else if (e.target.innerText === 'SORRY, TRY AGAIN!') {

                modalPopUp.style.display = 'none'
                clearCards()
                clearTimeout(modalTime)
            

            } else {
                modalPopUp.style.display = 'none'
                clearTimeout(modalEndofGame)        
            }
        } 
    }      
}

//  Check for Matches
function checkForMatch() {
    const cards = document.querySelectorAll('.card.active')
    const resultDisplay = document.getElementById('result')

    const optionOneId = cardsChosenId[0]
    const optionTwoId = cardsChosenId[1]

    // Same Card Clicked
    if(optionOneId === optionTwoId) {

        modalPopUp.style.display = 'flex'
        popUpMsg.innerText = 'Same Image Clicked. Try Again!'
        
        setModalTime()
        clearModal()
    
    // MATCH!!!
    } else if (cardsChosen[0] === cardsChosen[1]) {
        
        modalPopUp.style.display = 'flex'
        popUpMsg.innerText = "MATCH!!!"

        cards.forEach(card => card.classList.add('disabled'))

        clearModalEndofGame()

        cardsWon.push(cardsChosen[0] + (' 🐈 '))
    
     // Sorry, Try Again!
    } else {
       
        modalPopUp.style.display = 'flex'
        popUpMsg.innerText = 'Sorry, Try Again!'

        setModalTime()
        clearModal()
    }

        cardsChosen = []
        cardsChosenId = []

        resultDisplay.innerText = cardsWon.join('  -  ')

    // Cards Match - Congrats
    if  (cardsWon.length === cardArray.length / 2) {
          modalPopUp.style.display = 'flex'
          body.style.overflow = 'hidden'
          popUpMsg.classList.add('win')
          modalPopUp.innerHTML = 
          `
          <div class="popup-close win">
          Congratulations! You found them all!
          </div>
          <div class="play-again">
          <button id="play_again" class="btn">Play Again!</button>
          </div>
          `
          
          window.onclick = null

          const playAgainBtn = document.getElementById('play_again')

          playAgainBtn.addEventListener('click', () => {
            modalPopUp.style.display = 'none'
            clearCards()
          })

          clearTimeout(modalEndofGame)
    }
}

// Gets Card Name & ID then checks after two cards flipped
function flipCard() {
    let cardId = this.getAttribute('data-id')

    cardsChosen.push(cardArray[cardId].name)
    cardsChosenId.push(cardId)

    this.classList.add('active')
    this.innerHTML = `
    <img src="${cardArray[cardId].img}" alt="cat" />
    <span class="cat-name">${cardArray[cardId].name}</span>`

    if(cardsChosen.length === 2) {
            setTimeout(checkForMatch, 300)
    }
}
