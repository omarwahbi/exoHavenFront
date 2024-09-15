"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

import React, { useEffect, useState } from "react";

const Items = ({ params }) => {
  const [items, setItems] = useState(null);
  //   const [categories, setCategories] = useState(null);
  const { id } = useParams(); // Extract the id from the URL

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async (id, all) => {
    try {
      // Determine the category ID to use
      const subCategoryId = id || params.id;

      // Construct the URL based on the 'all' parameter
      const url = `https://exohavenbackend.onrender.com/api/items?filters[sub_category][id][$eq]=${subCategoryId}&populate=*`;

      const response = await fetch(url);
      const data = await response.json();
      setItems(data.data);
      console.log(items);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  if (!items) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" w-4/5 m-auto mt-14">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 ">
        {items.map((item) => (
          <Link key={item.id} href={`/item/${item.id}`}>
            <div key={item.id} className="mb-14 relative">
              <div className="justify-center flex">
                <img
                  className="h-auto max-w-full rounded-lg"
                  src={item.attributes.image}
                  alt={item.attributes.name}
                />
              </div>
              <div className="absolute bottom-8 right-2 bg-black bg-opacity-50 text-white text-base p-2 rounded-e-3xl">
                {item.attributes.out_of_stock
                  ? "Out of Stock"
                  : `$${item.attributes.state}`}
              </div>
              <p>{item.attributes.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Items;
