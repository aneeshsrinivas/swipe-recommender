import './App.css';
import './styles.css';  // Only one import of styles.css here
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Activities and mapping to image filenames
const activities = [
  { title: "Reading a Book", emoji: "📖", image: "Reading a Book.png" },
  { title: "Walking", emoji: "🚶", image: "Walking.png" },
  { title: "Watching a Movie", emoji: "🎬", image: "Watching a Movie.png" },
  { title: "Write a Poem", emoji: "✍️", image: "Draw.png" },
  { title: "Draw", emoji: "🎨", image: "Draw.png" },
  { title: "Listening to Music", emoji: "🎵", image: "Listening to Music.png" },
  { title: "Cooking a Meal", emoji: "🍳", image: "Cooking a Meal.png" },
  { title: "Dance", emoji: "💃", image: "Dance.png" },
  { title: "Meditate", emoji: "🧘", image: "Meditate.png" },
  { title: "Talk to a friend", emoji: "📞", image: "Talk to a friend.png" },
];

const categories = ["Health", "Fun", "Learning", "Social", "Hobby"];

const colorsByCategory = {
  Health: "#9be15d",
  Fun: "#f2709c",
  Learning: "#24c6dc",
  Social: "#ff5f6d",
  Hobby: "#00f2fe",
};

const lightColorsByCategory = {
  Health: "#d5f1a3",
  Fun: "#f8a7be",
  Learning: "#7fdbff",
  Social: "#ff9aa3",
  Hobby: "#90e0fb",
};

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function generateUniqueCards() {
  const shuffled = shuffle(activities).slice(0, 10);
  return shuffled.map((activity) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    return {
      id: crypto.randomUUID(),
      title: activity.title,
      emoji: activity.emoji,
      image: activity.image,
      category,
      color: colorsByCategory[category],
      lightColor: lightColorsByCategory[category],
    };
  });
}

export default function App() {
  const [cards, setCards] = useState(generateUniqueCards);
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState(() => JSON.parse(localStorage.getItem("likedCards")) || []);
  const [soundOn, setSoundOn] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [direction, setDirection] = useState(0);
  const [history, setHistory] = useState([]);
  const [showUndo, setShowUndo] = useState(false);

  const likeSoundRef = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/click.wav`));
  const dislikeSoundRef = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/snap-click.wav`));

  useEffect(() => {
    localStorage.setItem("likedCards", JSON.stringify(liked));
  }, [liked]);

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#00ff99", "#00cc7a", "#ffffff"],
    });
  };

  const handleSwipe = useCallback(
    (like, swipeDir = 0) => {
      setDirection(swipeDir);
      setHistory((prev) => [...prev, { card: cards[index], liked: like }]);
      if (like) {
        setLiked((prev) => [...prev, cards[index]]);
        if (soundOn) likeSoundRef.current.play();
        launchConfetti();
      } else {
        if (soundOn) dislikeSoundRef.current.play();
      }
      setShowUndo(true);
      setIndex((prev) => prev + 1);
    },
    [cards, index, soundOn]
  );

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    if (last.liked) {
      setLiked((prev) => prev.filter((c) => c.id !== last.card.id));
    }
    setIndex((prev) => prev - 1);
    setShowUndo(false);
  };

  const disliked = cards.filter((card) => !liked.some((l) => l.id === card.id));
  const currentCard = cards[index];
  const cardLightBg = currentCard?.lightColor || "#222";
  const summaryBg = `linear-gradient(135deg, ${Object.values(lightColorsByCategory).join(", ")})`;

  const imagePath = currentCard ? `/task-images/${currentCard.image}` : null;

  return (
    <motion.div
      className={`app-container ${darkMode ? "dark-mode" : ""}`}
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/images/background.jpg')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundColor: darkMode ? "#111" : currentCard?.color || "#222",
        minHeight: "100vh",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {showUndo && index > 0 && (
        <button
          className="reset-btn"
          style={{ position: "fixed", top: 20, right: 20, zIndex: 1000 }}
          onClick={handleUndo}
          title="Undo last like/dislike"
        >
          ↩️ Undo Last
        </button>
      )}

      <div className="settings">
        <button className="reset-btn" onClick={() => setSoundOn((prev) => !prev)} title="Toggle Sound">
          {soundOn ? "🔊 Sound On" : "🔇 Sound Off"}
        </button>
        <button className="reset-btn" onClick={() => setDarkMode((prev) => !prev)} title="Toggle Dark Mode">
          {darkMode ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>

      {index >= cards.length ? (
        <div className="liked-list" style={{ background: summaryBg }}>
          <h1>Summary</h1>
          <p>👍 Total Likes: {liked.length}</p>
          <p>👎 Total Dislikes: {disliked.length}</p>

          <div className="summary-section">
            <h2>Liked Tasks</h2>
            {liked.length === 0 ? (
              <p>No liked tasks.</p>
            ) : (
              <ul>
                {liked.map((card) => (
                  <li key={card.id}>
                    <span className="emoji">{card.emoji}</span> {card.title} <span className="category">({card.category})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="summary-section">
            <h2>Disliked Tasks</h2>
            {disliked.length === 0 ? (
              <p>No disliked tasks.</p>
            ) : (
              <ul>
                {disliked.map((card) => (
                  <li key={card.id}>
                    <span className="emoji">{card.emoji}</span> {card.title} <span className="category">({card.category})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            className="reset-btn"
            onClick={() => {
              setIndex(0);
              setLiked([]);
              setHistory([]);
              setShowUndo(false);
              setCards(generateUniqueCards());
            }}
          >
            🔄 Restart
          </button>
        </div>
      ) : (
        <div
          className="card-area"
          style={{
            position: "relative",
            background: "#fff",
            borderRadius: "12px",
            padding: "20px",
            maxWidth: "400px",
            margin: "40px auto",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            zIndex: 2,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id}
              className="card"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              onDragEnd={(event, info) => {
                const velocity = info.velocity.x;
                const offsetX = info.offset.x;
                if (offsetX > 100 || velocity > 500) handleSwipe(true, 1);
                else if (offsetX < -100 || velocity < -500) handleSwipe(false, -1);
              }}
              initial={{ opacity: 0, scale: 0.8, x: direction * 300, rotate: direction * 15 }}
              animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, x: direction * -300, rotate: direction * -15 }}
              transition={{ duration: 0.5 }}
              style={{
                backgroundColor: cardLightBg,
                color: "#111",
                position: "relative",
                zIndex: 1,
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <h2>{currentCard.emoji} {currentCard.title}</h2>
              <p>{currentCard.category}</p>

              {/* ✅ TASK IMAGE IN FRONT OF PANEL */}
              {imagePath && (
                <img
                  src={imagePath}
                  alt={currentCard.title}
                  style={{
                    margin: "12px auto",
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                  }}
                />
              )}

              <div className="buttons">
                <button className="dislike-btn" onClick={() => handleSwipe(false, -1)}>❌</button>
                <button className="like-btn" onClick={() => handleSwipe(true, 1)}>❤️</button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
