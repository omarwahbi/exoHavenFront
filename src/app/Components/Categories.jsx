"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://exohavenbackend.onrender.com/api/categories"
      );
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-14 w-10/12 mx-auto">
      {categories.map((category) => (
        <Link href={`/subCategory/${category.id}`} key={category.id}>
          <div className="flex flex-col items-center p-4 shadow-md">
            <Image
              src={category.attributes.img_url}
              alt={category.attributes.name}
              className="rounded-full h-24 w-24 sm:h-36 sm:w-36 object-cover mb-4"
            />
            <h2 className="text-lg sm:text-xl font-bold text-green2 text-center">
              {category.attributes.name}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Categories;
