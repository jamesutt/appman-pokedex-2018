import React, { useState, useEffect } from 'react'
import './App.css'
import searchIcon from './search.png'
import cuteIcon from './cute.png'

const COLORS = {
  Psychic: '#f8a5c2',
  Fighting: '#f0932b',
  Fairy: '#c44569',
  Normal: '#f6e58d',
  Grass: '#badc58',
  Metal: '#95afc0',
  Water: '#3dc1d3',
  Lightning: '#f9ca24',
  Darkness: '#574b90',
  Colorless: '#FFF',
  Fire: '#eb4d4b',
}

function App() {
  const [myCards, setMyCards] = useState([])
  const [cards, setCards] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchKey, setSearchKey] = useState('')

  useEffect(() => {
    fetch('http://localhost:3030/api/cards')
      .then(res => res.json())
      .then(result => {
        console.log(result.cards)
        setCards(result.cards)
      })
  }, [])

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:3030/api/cards?name=${searchKey}`),
      fetch(`http://localhost:3030/api/cards?type=${searchKey}`),
    ]).then(res =>
      Promise.all([res[0].json(), res[1].json()]).then(results => {
        const myCardIds = myCards.map(card => card.id)

        const nameCards = results[0].cards.filter(
          card => !myCardIds.includes(card.id)
        )

        const nameCardIds = nameCards.map(card => card.id)

        const typeCards = results[1].cards.filter(
          card => !nameCardIds.includes(card.id)
        )

        setCards([...nameCards, ...typeCards])
      })
    )
  }, [searchKey])

  const onCardRemove = removedCard => {
    setMyCards(myCards.filter(card => card.id !== removedCard.id))
    setCards([...cards, removedCard])
  }

  const onCardAdd = addedCard => {
    setMyCards([...myCards, addedCard])
    setCards(cards.filter(card => card.id != addedCard.id))
  }

  return (
    <div>
      <h1>My Pokedex</h1>
      <div className="card_collection">
        {myCards.map(card => (
          <Card
            card={card}
            buttonType="REMOVE"
            onCardAdd={onCardAdd}
            onCardRemove={onCardRemove}
            key={card.id}
          />
        ))}
      </div>
      <div id="bottom_bar">
        <button
          id="open_modal_button"
          onClick={() => {
            setIsModalOpen(true)
          }}
        >
          +
        </button>
      </div>
      {isModalOpen && (
        <div id="modal_background" onClick={() => setIsModalOpen(false)}>
          <div id="modal_container" onClick={e => e.stopPropagation()}>
            <input
              type="text"
              id="search_input"
              placeholder="Find pokemon"
              value={searchKey}
              onChange={e => setSearchKey(e.target.value)}
            />
            {cards.map(card => (
              <Card
                card={card}
                buttonType="ADD"
                onCardAdd={onCardAdd}
                onCardRemove={onCardRemove}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const Card = ({ card, buttonType, onCardAdd, onCardRemove }) => {
  return (
    <div className="card_container" key={card.id}>
      <img src={card.imageUrl} alt="" className="card_thumbnail" />
      <div className="card_stats">
        <h2 className="card_name">{card.name}</h2>
        <div className="card_stats_row">
          HP
          <div className="card_stats_bar"></div>
        </div>
        <div className="card_stats_row">
          STR
          <div className="card_stats_bar"></div>
        </div>
        <div className="card_stats_row">
          WEAK
          <div className="card_stats_bar"></div>
        </div>
        <div className="card_stats_happiness_container">
          <img src={cuteIcon} alt="" />
          <img src={cuteIcon} alt="" />
          <img src={cuteIcon} alt="" />
          <img src={cuteIcon} alt="" />
          <img src={cuteIcon} alt="" />
        </div>
      </div>
      {buttonType === 'REMOVE' ? (
        <div className="remove_button_container">
          <button className="remove_button" onClick={() => onCardRemove(card)}>
            X
          </button>
        </div>
      ) : (
        <div className="add_button_container">
          <button className="add_button" onClick={() => onCardAdd(card)}>
            Add
          </button>
        </div>
      )}
    </div>
  )
}

export default App
