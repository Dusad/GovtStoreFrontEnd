import React from 'react'

import { useEffect, useState } from "react";

function ItemList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Items</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="p-2 border border-gray-300 rounded">
            {item.name} - {item.price} ₹
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ItemList;
