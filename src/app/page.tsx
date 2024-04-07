"use client";

import React, { useState } from "react";
import image1 from "./assets/image1.jpg";
import image2 from "./assets/image2.jpg";
import image3 from "./assets/image3.jpg";
import Image from "next/image";

const ImageSelectionPage = () => {
  const [selectedImage, setSelectedImage] = useState(1);
  const images = [
    { id: 1, src: image1 },
    { id: 2, src: image2 },
    { id: 3, src: image3 },
  ];

  const handleImageSelect = (event) => {
    setSelectedImage(+event.target.value);
  };

  return (
    <div>
      <h1>Select an theme with the radio button</h1>
      <br />
      {images.map((image) => (
        <div key={image.id}>
          <Image
            src={image.src}
            alt={`Image ${image.id}`}
            width={400}
            height={300}
          />
          <input
            type="radio"
            name="selectedImage"
            value={image.id}
            checked={selectedImage === image.id}
            onChange={handleImageSelect}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageSelectionPage;
