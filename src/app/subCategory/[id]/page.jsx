"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const SubCategories = () => {
  const { id } = useParams(); // Extract the id from the URL
  const [subCategories, setSubCategories] = useState([]);

  // const fetchSubCategories = async () => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:1337/api/categories/${id}?populate=sub_categories&populate=*`
  //     );
  //     const data = await response.json();
  //     setSubCategories(data.data.attributes.sub_categories?.data || []);
  //   } catch (error) {
  //     console.error("Error fetching sub-categories:", error);
  //   }
  // };

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await fetch(
          `http://localhost:1337/api/categories/${id}?populate=*`
        );
        const data = await response.json();
        setSubCategories(data.data.attributes.sub_categories?.data || []);
      } catch (error) {
        console.error("Error fetching sub-categories:", error);
      }
    };
    if (id) {
      // Ensure id is defined before making the API call
      fetchSubCategories();
    }
  }, [id]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-14 w-10/12 mx-auto mt-14">
      {subCategories.map((subCategory) => (
        <Link href={`/items/${subCategory.id}`} key={subCategory.id}>
          <div className="flex flex-col items-center p-4 shadow-md">
            {subCategory.attributes.subcategory_img && (
              <Image
                src={
                  subCategory.attributes.subcategory_thumbnail.data.attributes
                    .url
                }
                width={96}
                height={96}
                alt={subCategory.attributes.name || "Subcategory Image"}
                className="rounded-full h-24 w-24 sm:h-36 sm:w-36 object-cover mb-4"
              />
            )}
            {subCategory.attributes.name && (
              <h2 className="text-lg sm:text-xl font-bold text-blue-600 text-center">
                {subCategory.attributes.name}
              </h2>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SubCategories;
