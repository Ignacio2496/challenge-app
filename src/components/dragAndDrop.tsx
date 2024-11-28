import React, { useState, useEffect } from "react";

interface Item {
  id: number;
  text: string;
}

const DragAndDrop: React.FC = () => {
  const [leftItems, setLeftItems] = useState<Item[]>([]);
  const [rightItems, setRightItems] = useState<Item[]>([]);
  const [secretMessage, setSecretMessage] = useState<string | undefined>("");
  const [newItemText, setNewItemText] = useState<string>("");
  const [selectedEmoji, setSelectedEmoji] = useState<string>("🍎");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const totalItems = leftItems.length + rightItems.length; // Track the total number of items

  useEffect(() => {
    if (leftItems.length === 0 && rightItems.length === 5) {
      // Fetch the secret message when all items are moved
      fetch("https://iems-757535565657.us-central1.run.app/Test")
        .then((response) => response.json())
        .then((data) => {
          setSecretMessage(data.secret || "No message available");
        })
        .catch((error) => {
          console.error("Error fetching secret message:", error);
          setSecretMessage("Unable to fetch the secret message.");
        });
    }
    if (leftItems.length !== 5) {
      setSecretMessage(undefined);
    }
  }, [leftItems, rightItems, totalItems]);

  const handleAddItem = () => {
    if (totalItems >= 5) {
      setErrorMessage("You can only add up to 5 items in total.");
      return;
    }

    if (!newItemText.trim()) {
      setErrorMessage("Item cannot be empty.");
      return;
    }

    const id = Date.now(); // Generate a unique ID
    const newItem = { id, text: `${selectedEmoji} ${newItemText.trim()}` };

    setLeftItems((prev) => [...prev, newItem]);
    setNewItemText(""); // Clear the input
    setErrorMessage(""); // Clear any previous error message
  };

  const handleDeleteItem = (id: number, destination: "left" | "right") => {
    if (destination === "left") {
      setLeftItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setRightItems((prev) => prev.filter((item) => item.id !== id));
    }
    setErrorMessage(""); // Clear error message in case it was displayed
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: Item) => {
    e.dataTransfer.setData("draggedItem", JSON.stringify(item));
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    destination: "left" | "right"
  ) => {
    e.preventDefault();

    const itemData = e.dataTransfer.getData("draggedItem");
    if (!itemData) return;

    const item: Item = JSON.parse(itemData);

    if (destination === "right") {
      // Move to the right pane
      setRightItems((prev) => [...prev, item]);
      setLeftItems((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      // Move back to the left pane
      setLeftItems((prev) => [...prev, item]);
      setRightItems((prev) => prev.filter((i) => i.id !== item.id));
    }
    setErrorMessage(""); // Clear error message in case it was displayed
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center p-8 gap-6 md:w-[50%]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddItem();
        }}
        className="w-full flex gap-4 items-center flex-col"
      >
        <div className="flex gap-3 w-full">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Enter fruit emoji and name (e.g., 🍍 Pineapple)"
            className={`flex-grow p-3 text-lg bg-white border rounded-lg shadow-sm focus:outline-none transition-all duration-300 ease-in-out ${
              errorMessage
                ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            }`}
          />
          <select
            value={selectedEmoji}
            onChange={(e) => setSelectedEmoji(e.target.value)}
            className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="🍎">🍎 Apple</option>
            <option value="🍌">🍌 Banana</option>
            <option value="🍇">🍇 Grape</option>
            <option value="🍍">🍍 Pineapple</option>
            <option value="🍓">🍓 Strawberry</option>
            <option value="🍊">🍊 Orange</option>
          </select>
        </div>
        <div className="w-full">
          <button
            type="submit"
            className={`p-3 text-white rounded-lg shadow hover:bg-blue-600 transition w-full ${
              errorMessage ? "bg-red-500" : "bg-blue-500"
            }`}
          >
            Add Item
          </button>
        </div>
      </form>
      {errorMessage && (
        <p className="text-red-500 text-md text-center animate-pulse">
          {errorMessage}
        </p>
      )}

      <div className="w-full">
        <div className="flex w-full gap-8 sm:flex-col sm:items-center md:flex-row">
          <div
            className="sm:w-full md:w-1/2 border-2 border-gray-300 rounded-lg p-4 shadow-md bg-white min-h-[300px] animate-fadeIn"
            onDrop={(e) => handleDrop(e, "left")}
            onDragOver={handleDragOver}
          >
            <h2 className="text-xl font-semibold mb-4">Drag Items</h2>
            <div className="space-y-2">
              {leftItems.map((item) => (
                <div
                  key={item.id}
                  className="relative p-4 bg-blue-100 rounded-lg cursor-move hover:bg-blue-200 transition border-zinc-100 animate-fadeIn"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                >
                  {item.text}
                  <button
                    onClick={() => handleDeleteItem(item.id, "left")}
                    className="absolute top-0 right-0 mt-1 mr-1 text-red-500 text-sm bg-white rounded-full w-6 h-6 flex items-center justify-center shadow"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`sm:w-full md:w-1/2 border-2 transition-colors duration-500 animate-fadeIn ${
              secretMessage ? "border-green-500" : "border-gray-300"
            } rounded-lg p-4 shadow-md bg-white min-h-[300px]`}
            onDrop={(e) => handleDrop(e, "right")}
            onDragOver={handleDragOver}
          >
            <h2 className="text-xl font-semibold mb-4">Drop Items Here</h2>
            <div className="space-y-2">
              {rightItems.map((item) => (
                <div
                  key={item.id}
                  className="relative p-4 bg-green-100 rounded-lg cursor-move hover:bg-green-200 transition"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                >
                  {item.text}
                  <button
                    onClick={() => handleDeleteItem(item.id, "right")}
                    className="absolute top-0 right-0 mt-1 mr-1 text-red-500 text-sm bg-white rounded-full w-6 h-6 flex items-center justify-center shadow"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {secretMessage && (
        <div className="mt-8 p-4 bg-yellow-100 rounded-lg shadow-md sm:w-full animate-appearanceIn">
          <h3 className="text-lg font-semibold text-center underline">
            Secret Message
          </h3>
          <p className="text-center">{secretMessage}</p>
        </div>
      )}
    </div>
  );
};

export default DragAndDrop;
