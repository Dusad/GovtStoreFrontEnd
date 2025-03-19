import React from 'react'

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/items/${id}`)
      .then((res) => res.json())
      .then((data) => setItem(data));
  }, [id]);

  if (!item) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">{item.name}</h2>
      <p>Price: {item.price} ₹</p>
      <p>Description: {item.description}</p>
    </div>
  );
}

export default ItemDetail;
