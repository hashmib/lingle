import { useEffect, useState } from 'react'
import { Button } from "@material-ui/core";
import './Board.css'

function keyIsInvalid (key) {
  return key.length > 1 || /[^a-z]/i.test(key)
}

function noMoreToDelete ({ attempts, position }) {
  const atBeginning = position.char === 0
  const charIsEmpty = attempts[position.attempt][position.char].value === ''
  return atBeginning && charIsEmpty
}

function noMoreToAdd ({ attempts, position }) {
  const atEnd = position.char === 4
  const charIsNotEmpty = attempts[position.attempt][position.char].value !== ''
  return atEnd && charIsNotEmpty
}

function wordIsNotComplete ({ attempts, position }) {
  return attempts[position.attempt].some(char => char.value === '')
}

function wordIsComplete(currentAttempt) {
  console.log(currentAttempt)
  for (let letterIndex in currentAttempt) {
    if (currentAttempt[letterIndex].status !== 'at-location') {
      return false
    }
  }
  return true
}


const initialGameState = {
  word: '',
  attempts: [
    [
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' }
    ],
    [
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' }
    ],
    [
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' }
    ],
    [
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' }
    ],
    [
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' }
    ],
    [
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' }
    ]
  ],
  position: {
    attempt: 0,
    char: 0
  },
  status: 'playing',
  error: ''
}


const lingleAPIObject = {
  frequency: 0,
  room_uuid: '',
  word: ''
}

// Calls our API to fetch the word to be guessed
async function fetchWordOfTheDay(room_name) {
  let queryBuilder = "/api/wordoftheday?name=" + room_name;
  const data = await fetch(queryBuilder)
    .then(response => response.json())
    .catch(error => {
      console.log(error);
    });
  
  return data;
}


function Board (props) {
  const [{ word, attempts, position, error }, setGameState] = useState(
    initialGameState
  )

  const [wordIndex, setWordIndex] = useState(0)

  const [words, setWords] = useState([])

  const [isWon, setIsWon] = useState(false)

  // useEffect requires async within an async... weird
  useEffect(() => {
    (async () => {
      const data = await fetchWordOfTheDay(props.room)

      if (data.success) {
        const words_in = data.words;

        setWords(words_in)
        setGameState(gameState => {
          const newGameState = JSON.parse(JSON.stringify(gameState))
          newGameState.word = words_in[wordIndex].word.toUpperCase();
    
          return newGameState
        });
      }
    })();
  },[])

  function enterCharacter (char) {
    char = char.toUpperCase()
    if (position.attempt > 5) return
    if (keyIsInvalid(char)) return

    setGameState(gameState => {
      if (noMoreToAdd(gameState)) return gameState

      const newGameState = JSON.parse(JSON.stringify(gameState))
      const { attempts, position } = newGameState

      attempts[position.attempt][position.char].value = char
      if (position.char < 4) position.char++

      return newGameState
    })
  };


  async function handlePlayAgain(event) {
    event.preventDefault();

    setGameState(gameState => {
      gameState = JSON.parse(JSON.stringify(initialGameState))
      const newGameState = JSON.parse(JSON.stringify(gameState));
      newGameState.word = words[wordIndex + 1].word.toUpperCase();
      console.log(newGameState)

      return newGameState;
    });
    setIsWon(false);
    setWordIndex(wordIndex + 1);
  }

  function eraseCharacter () {
    setGameState(gameState => {
      if (noMoreToDelete(gameState)) return gameState

      const newGameState = JSON.parse(JSON.stringify(gameState))
      const { attempts, position } = newGameState

      if (attempts[position.attempt][position.char].value !== '') {
        attempts[position.attempt][position.char].value = ''
      } else {
        if (position.char > 0) position.char--
      }

      return newGameState
    })
  }

  function guessWord () {
    setGameState(gameState => {
      if (wordIsNotComplete(gameState)) {
        return { ...gameState, error: 'Incomplete word' }
      }

      const newGameState = JSON.parse(JSON.stringify(gameState))
      const { attempts, position } = newGameState

      const currentAttempt = attempts[position.attempt]

      let wordCopy = newGameState.word;

      for (const index in currentAttempt) {
        const char = currentAttempt[index]
        if (wordCopy[index] === char.value) {
          char.status = 'at-location'
          wordCopy = wordCopy.replace(char.value, '_')
        }
      }

      for (const index in currentAttempt) {
        const char = currentAttempt[index]
        if (char.status !== '') continue

        if (wordCopy.includes(char.value)) {
          char.status = 'in-word'
          wordCopy = wordCopy.replace(char.value, '_')
        }
      }

      for (const index in currentAttempt) {
        const char = currentAttempt[index]

        if (char.status === '') {
          char.status = 'not-in-word'
        }
      }

      position.attempt += 1
      position.char = 0

      newGameState.error = ''

      if (wordIsComplete(currentAttempt)) {
        setIsWon(true)
      }

      return newGameState
    })
  }

  function goLeft () {
    setGameState(gameState => {
      if (gameState.position.char === 0) return gameState

      const newGameState = JSON.parse(JSON.stringify(gameState))
      newGameState.position.char--

      return newGameState
    })
  }

  function goRight () {
    setGameState(gameState => {
      if (gameState.position.char === 4) return gameState

      const newGameState = JSON.parse(JSON.stringify(gameState))
      newGameState.position.char++

      return newGameState
    })
  }

  function updatePosition (newPosition) {
    setGameState(gameState => {
      if (newPosition.attempt !== gameState.position.attempt) return gameState
      return { ...gameState, position: newPosition }
    })
  }

  function checkKey (key) {
    key = key.toUpperCase()
    let status = ''
    for (const attempt of attempts) {
      for (const char of attempt) {
        if (char.value !== key) continue
        if (char.status === 'at-location') {
          return 'at-location'
        } else if (char.status === 'in-word') {
          status = 'in-word'
        } else if (char.status === 'not-in-word' && status === '') {
          status = 'not-in-word'
        }
      }
    }

    return status
  }

  useEffect(() => {
    if (position.attempt > 5) return

    const handleKeyDown = e => {
      if (e.key === 'Enter') guessWord()
      if (e.key === 'ArrowLeft') goLeft()
      if (e.key === 'ArrowRight') goRight()
      if (e.key === 'Backspace') eraseCharacter()
      else enterCharacter(e.key)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [position.attempt])


  return (
    <div className='lingleboard'>
            <div className='board'>
              {attempts.map((attempt, attemptIndex) => (
                <div
                  key={attemptIndex}
                  className={`attempt ${
                    attemptIndex === position.attempt ? 'current' : ''
                  }`}
                >
                  {attempt.map((char, charIndex) => (
                    <span
                      key={`${attemptIndex}-${charIndex}`}
                      id={`char-${attemptIndex}-${charIndex}`}
                      className={`char ${char.status} ${
                        position.attempt === attemptIndex &&
                        position.char === charIndex
                          ? 'current'
                          : ''
                      }`}
                      style={{
                        transition: `background-color 0s ${charIndex * 400 +
                          200}ms ease`,
                        animationDelay: charIndex * 400 + 'ms'
                      }}
                      onClick={() => {
                        updatePosition({ attempt: attemptIndex, char: charIndex })
                      }}
                    >
                      {char.value}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            {isWon ? <Button variant="contained" color="secondary" onClick={handlePlayAgain}> Congrats! Play the next word!</Button> : null}
            <div className='error'>{error}</div>
            <div className='keyboard'>
              {['qwertyuiop', 'asdfghjkl', 'zxcvbnm'].map((row, rowIndex) => (
                <div key={rowIndex} className={`row row-${rowIndex}`}>
                  {row.split('').map(letter => (
                    <button
                      key={letter}
                      className={`key ${checkKey(letter)}`}
                      onClick={() => enterCharacter(letter)}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              ))}
              <div className='row'>
                <button className='key delete' onClick={eraseCharacter}>
                  <img
                    src='https://www.svgrepo.com/show/48292/delete.svg'
                    alt='delete'
                  />
                </button>
                <button className='key enter' onClick={guessWord}>
                  <img
                    src='https://www.svgrepo.com/show/258678/send.svg'
                    alt='send'
                  />
                </button>
              </div>
            </div>
    </div>
  )
}

export default Board;
