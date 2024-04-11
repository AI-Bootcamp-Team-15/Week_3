"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";

import React from "react";
import image1 from "./assets/image1.jpg";
import image2 from "./assets/image2.jpg";
import image3 from "./assets/image3.jpg";
import Image from "next/image";

// Helper component for rendering a loading spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="loader">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-slate-700 h-10 w-10"></div>
      </div>
    </div>
  </div>
);

interface ImageDisplayProps {
  image: string | null; // Assuming 'image' is a base64 encoded string or null
  message: string; // Assuming 'message' is always a string
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, message }) => (
  <div className="flex flex-col items-center justify-center h-screen">
    {image && (
      <img src={`data:image/jpeg;base64,${image}`} alt="Generated Content" className="max-w-md max-h-full" />
    )}
    <p className="mt-4 w-full max-w-md text-center text-white bg-black p-4">{message}</p>
  </div>
);

const ImageSelectionPage = () => {
  const { messages, append, isLoading } = useChat();
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [message, setMessage] = useState(''); // Initialize state variable
  const [enhancedDescription, setEnhancedDescription] = useState(''); // Initialize state variable for enhanced description from server

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const [selectedImage, setSelectedImage] = useState(1);
  const images = [
    { id: 1, src: image1 },
    { id: 2, src: image2 },
    { id: 3, src: image3 },
  ];

  // Mapping of image IDs to themes
  const themes = {
    1: 'forest',
    2: 'mountains',
    3: 'beach',
  };

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
      <div>
        <form>
          <input
            type = "text"
            placeholder = "Enter your message"
            className = "text-black"
            value={message} // Bind the input field to the state variable
            onChange = {e => setMessage(e.target.value)} // Update state variable on change
          />
        </form>
      </div>
      <div>
        <form>
          <textarea
            readOnly
            placeholder = "Enhanced description will appear here"
            className = "text-black"
            value={enhancedDescription} // Bind the textarea to the state variable
          />
        </form>
      </div>
      <button
        className="bg-blue-500 p-2 text-white rounded shadow-xl"
        disabled={isLoading}
        onClick={async () => {
          setImageIsLoading(true)
          const response = await fetch("api/images", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: message, // Use the state variable here
              theme: themes[selectedImage], // Use the selected theme here
            }),
          });
          const data = await response.json();
          setImage(data.image);
          setEnhancedDescription(data.description); // Update the enhanced description
          setImageIsLoading(false);
        }}
      >
        Generate image
      </button>
      <div
        hidden={
          messages.length === 0 ||
          messages[messages.length - 1]?.content.startsWith("Generate")
        }
        className="bg-opacity-25 bg-gray-700 rounded-lg p-4"
      >
        {messages[messages.length - 1]?.content}
      </div>
      {imageIsLoading && <LoadingSpinner />}
      {image && !imageIsLoading && <ImageDisplay image={image} message={messages[messages.length - 1]?.content} />}

    </div>
  );
};

export default ImageSelectionPage;
