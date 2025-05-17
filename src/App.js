import React, { useState } from 'react';

const cards = [
  { id: 1, title: 'Read a Book', category: 'Activity' },
  { id: 2, title: 'Watch a Movie', category: 'Entertainment' },
  { id: 3, title: 'Go for a Walk', category: 'Health' },
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState([]);

  function handleSwipe(like) {
    if (like) setLiked([...liked, cards[index]]);
    setIndex(index + 1);
  }

  if (index >= cards.length) {
    return (
      <div>
        <h1>Liked Cards:</h1>
        <ul>
          {liked.map((card) => (
            <li key={card.id}>{card.title}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h2>{cards[index].title}</h2>
      <p>Category: {cards[index].category}</p>
      <button onClick={() => handleSwipe(true)}>Like 👍</button>
      <button onClick={() => handleSwipe(false)}>Dislike 👎</button>
    </div>
  );
}
