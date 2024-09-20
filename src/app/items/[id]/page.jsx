"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import React, { useEffect, useState } from "react";

const Items = () => {
  const { id } = useParams(); // Extract the id from the URL
  const [items, setItems] = useState(null);
  //   const [categories, setCategories] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Determine the category ID to use
        const subCategoryId = id;

        // Construct the URL based on the 'all' parameter
        const url = `https://exohavenbackend.onrender.com/api/items?filters[sub_category][id][$eq]=${subCategoryId}&populate=*`;

        const response = await fetch(url);
        const data = await response.json();
        setItems(data.data);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchItems();
  }, [id]);

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
                <Image
                  className="h-auto max-w-full rounded-lg"
                  src={item.attributes.item_thumbnail.data.attributes.url}
                  alt={item.attributes.name}
                  width={300}
                  height={300}
                />
              </div>
              <div className="absolute bottom-8 right-2 bg-black bg-opacity-50 text-white text-base p-2 rounded-e-3xl">
                {item.attributes.out_of_stock
                  ? "Out of Stock"
                  : `${Number(item.attributes.state).toLocaleString()} IQD`}
              </div>
              <p className="text-center">{item.attributes.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Items;
