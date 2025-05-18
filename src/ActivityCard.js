// src/ActivityCard.js
import React, { useState } from "react";
import CardDecoration from "./CardDecoration";

const activities = [
  { title: "Read a Book", emoji: "📖" },
  { title: "Go for a Walk", emoji: "🚶" },
  { title: "Watch a Movie", emoji: "🎬" },
  { title: "Write a Poem", emoji: "✍️" },
  { title: "Draw Something", emoji: "🎨" },
  { title: "Listen to Music", emoji: "🎵" },
  { title: "Cook a Meal", emoji: "🍳" },
  { title: "Dance!", emoji: "💃" },
  { title: "Meditate", emoji: "🧘" },
  { title: "Call a Friend", emoji: "📞" },
];

const categories = ["Entertainment", "Relaxation", "Creative", "Social"];
const colors = ["#ff5733", "#33ff57", "#3357ff", "#ff33a1"];

export default function ActivityCard() {
  const [cards] = useState(() =>
    Array.from({ length: 5 }, (_, i) => {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      return {
        id: i + 1,
        title: activity.title,
        emoji: activity.emoji,
        category: categories[Math.floor(Math.random() * categories.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    })
  );

  return (
    <div className="card">
      <CardDecoration />
      <h2 className="card-title" style={{ color: cards[0].color }}>
        {cards[0].emoji} {cards[0].title}
      </h2>
      <p className="card-category">{cards[0].category}</p>
    </div>
  );
}
