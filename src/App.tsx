import DragAndDrop from "./components/dragAndDrop";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="font-bold text-3xl animate-appearanceIn mt-5">
        Move your fruits and have fun!
      </h1>
      <DragAndDrop />
    </div>
  );
}

export default App;
