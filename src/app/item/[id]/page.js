"use client";
import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import FlightIcon from "@mui/icons-material/Flight";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddToCartButton from "@/app/Components/AddToCartBtn";

export default function Page({ params }) {
  const [item, setItem] = useState(null);
  const [itemImgs, setItemImgs] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchItem(params.id);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) =>
        current === itemImgs.length - 1 ? 0 : current + 1
      );
    }, 10000); // Change slide every 10 seconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, [itemImgs]);

  const fetchItem = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:1337/api/items/${id}?populate=images`
      );
      const data = await response.json();
      setItem(data.data);
      setItemImgs(data.data.attributes.images.data);
    } catch (error) {
      console.error("Error fetching item:", error);
    }
  };

  const nextSlide = () => {
    setActiveIndex((current) =>
      current === itemImgs.length - 1 ? 0 : current + 1
    );
  };

  const prevSlide = () => {
    setActiveIndex((current) =>
      current === 0 ? itemImgs.length - 1 : current - 1
    );
  };

  return (
    item && (
      <div className="w-full md:w-4/5 m-auto mt-14 mb-14">
        <div className="flex flex-col md:flex-row md:pr-24">
          <div className="w-full md:w-3/5 relative">
            <div id="gallery" className="relative w-full" data-carousel="slide">
              <div className="relative h-96 overflow-hidden rounded-lg md:h-96">
                {itemImgs &&
                  itemImgs.map((img, index) => (
                    <div
                      className={`duration-700 ease-in-out ${
                        index === activeIndex ? "opacity-100" : "opacity-0"
                      }`}
                      data-carousel-item
                      key={img.attributes.id}
                    >
                      <img
                        src={img.attributes.img_url}
                        className="absolute block max-w-full h-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                        alt=""
                      />
                    </div>
                  ))}
              </div>
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
                <button onClick={prevSlide}>
                  <ArrowBackIosIcon />
                </button>
              </div>
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                <button onClick={nextSlide}>
                  <ArrowForwardIosIcon />
                </button>
              </div>
            </div>
            <div className="flex justify-center space-x-2 mt-2">
              {itemImgs.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-1 rounded-full ${
                    index === activeIndex ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="w-full md:w-2/5 md:ml-20 mt-6 md:mt-0">
            <h2 className="text-3xl md:text-6xl font-bold mb-4 md:mb-16">
              {item.attributes.name}
            </h2>
            <p className="text-lg md:text-2xl">{item.attributes.description}</p>
            <div className="mt-4 md:mt-8">
              <span className="flex items-center">
                <CheckCircleIcon className="mr-2" /> Quality Animals & Supplies
              </span>
              <span className="flex items-center mt-2">
                <FlightIcon className="mr-2" /> Safe And Fast Shipping
              </span>
              <span className="flex items-center mt-2">
                <SupportAgentIcon className="mr-2" /> Fast Respond and Instant
                Support
              </span>
              <AddToCartButton item={item} />
            </div>
          </div>
        </div>
      </div>
    )
  );
}
