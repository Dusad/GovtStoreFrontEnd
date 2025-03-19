import React from 'react'

import { useState } from "react";

function ItemIssue() {
  const [itemId, setItemId] = useState("");
  const [issuedTo, setIssuedTo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/api/issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, issuedTo }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Issue Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Item ID"
          className="border p-2 w-full"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Issued To"
          className="border p-2 w-full"
          value={issuedTo}
          onChange={(e) => setIssuedTo(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Issue</button>
      </form>
    </div>
  );
}

export default ItemIssue;
