"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SubCategories = () => {
  const { id } = useParams(); // Extract the id from the URL
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    if (id) {
      // Ensure id is defined before making the API call
      fetchSubCategories();
    }
  }, [id]);

  const fetchSubCategories = async () => {
    try {
      const response = await fetch(
        `https://exohavenbackend.onrender.com/api/categories/${id}?populate=sub_categories`
      );
      const data = await response.json();
      setSubCategories(data.data.attributes.sub_categories.data);
    } catch (error) {
      console.error("Error fetching sub-categories:", error);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-14 w-10/12 mx-auto mt-14">
      {subCategories.map((subCategory) => (
        <Link href={`/items/${subCategory.id}`} key={subCategory.id}>
          <div className="flex flex-col items-center p-4 shadow-md">
            <img
              src={subCategory.attributes.subcategory_img}
              alt={subCategory.attributes.name}
              className="rounded-full h-24 w-24 sm:h-36 sm:w-36 object-cover mb-4"
            />
            <h2 className="text-lg sm:text-xl font-bold text-blue-600 text-center">
              {subCategory.attributes.name}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SubCategories;
