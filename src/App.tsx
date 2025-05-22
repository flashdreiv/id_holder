import { useState } from "react";
import "./App.css";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Plus } from "lucide-react";

function App() {
  const [cards, setCards] = useState([
    {
      id: 1,
      name: "Driver's License",
      description: "00232405-34341-123123",
      logo: "./src/assets/lto.png",
    },
    {
      id: 2,
      name: "Pagibig",
      description: "00232405-34341-123123",
      logo: "./src/assets/pagibig.png",
    },
    {
      id: 3,
      name: "SSS",
      description: "123213123-123123",
      logo: "./src/assets/sss.svg",
    },
    {
      id: 4,
      name: "TIN",
      description: "123213123-123123",
      logo: "./src/assets/bir.png",
    },
    {
      id: 5,
      name: "National ID",
      description: "123213123-123123",
      logo: "./src/assets/PSA.png",
    },
  ]);

  const renderCards = () => {
    return cards.map((card) => (
      <Card key={card.id} className="w-full flex py-3">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <CardTitle>{card.name}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </div>
            <img
              src={card.logo}
              alt={`${card.name} Logo`}
              className="size-12 md:size-15"
            />
          </div>
        </CardHeader>
      </Card>
    ));
  };
  return (
    <>
      <header className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">My Cards</h1>
        <Input placeholder="Search" onChange={() => {}} />
      </header>
      <main className="mt-5 flex flex-col gap-3">
        {renderCards()}
        <footer className="fixed bottom-10 left-1/2 transform -translate-x-1/2">
          <Button className="size-12 sm:size-20 p-0 rounded-full flex items-center justify-center">
            <Plus className="size-5 sm:size-7" />
          </Button>
        </footer>
      </main>
    </>
  );
}

export default App;
