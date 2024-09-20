"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Category = ({ params }) => {
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `https://exohavenbackend.onrender.com/api/categories`
        );
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };
    fetchCategory(null, true);
    fetchCategories();
  }, [params.id]);

  const fetchCategory = async (id, all) => {
    try {
      // Determine the category ID to use
      const categoryId = id || params.id;

      // Construct the URL based on the 'all' parameter
      const url = all
        ? "https://exohavenbackend.onrender.com/api/items?populate=item_thumbnail"
        : `https://exohavenbackend.onrender.com/api/items?filters[category][$eq]=${categoryId}&populate=item_thumbnail`;

      const response = await fetch(url);
      const data = await response.json();
      setCategory(data.data);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `https://exohavenbackend.onrender.com/api/categories/?populate=category_thumbnail`
      );
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  if (!category) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" w-4/5 m-auto mt-14">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => fetchCategory(null, true)}
          className="text-blue-700 hover:text-white border border-blue-600 bg-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:bg-gray-900 dark:focus:ring-blue-800"
        >
          All Items
        </button>
        {categories &&
          categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => fetchCategory(cat.id)}
              className="text-blue-700 hover:text-white border border-blue-600 bg-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:bg-gray-900 dark:focus:ring-blue-800"
            >
              {cat.attributes.name}
            </button>
          ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 ">
        {category.map((item) => (
          <Link key={item.id} href={`/item/${item.id}`}>
            <div key={item.id} className="mb-14 relative">
              <div className="justify-center flex">
                <Image
                  className="h-auto max-w-full rounded-lg"
                  src={item.attributes.item_images.data.attributes.url}
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

export default Category;
