// src/CardDecoration.js
import React from "react";
import "./cardDecoration.css";

export default function CardDecoration() {
  return (
    <svg
      className="card-decoration"
      width="400"
      height="400"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="200" cy="200" r="180" stroke="url(#grad1)" strokeWidth="6" />
      <circle cx="200" cy="200" r="150" stroke="url(#grad2)" strokeWidth="4" />
      <circle cx="200" cy="200" r="120" stroke="url(#grad3)" strokeWidth="2" />
      <defs>
        <radialGradient id="grad1" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#00ff99" />
          <stop offset="100%" stopColor="#00cc7a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="grad2" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#00cc7a" />
          <stop offset="100%" stopColor="#00ff99" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="grad3" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#00ffcc" />
          <stop offset="100%" stopColor="#00cc99" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

