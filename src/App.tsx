import { useState, useEffect, useMemo } from "react";
import "./App.css";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { getAllCards, initDB, type ICard } from "./lib/db";

function App() {
  const [isDBReady, setIsDBReady] = useState<boolean>(false);

  const [cards, setCards] = useState<ICard[]>([]);

  const isDataReady = useMemo(
    () => isDBReady && cards.length > 0,
    [isDBReady, cards]
  );

  const handleInitDB = async () => {
    const status = await initDB();
    setIsDBReady(status);
  };

  async function loadCards() {
    try {
      const cards = await getAllCards();
      setCards(cards as ICard[]);
    } catch (err) {
      console.error("Failed to get cards:", err);
    }
  }

  useEffect(() => {
    handleInitDB();
    loadCards();
  }, []);

  const renderCards = () => {
    return cards.map((card) => (
      <Card key={card.id} className="w-full flex py-3 cursor-pointer">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <CardTitle>{card.name}</CardTitle>
              <CardDescription>{card.id}</CardDescription>
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
        {isDataReady ? (
          renderCards()
        ) : (
          <Loader2 className="size-10 animate-spin text-blue-500 m-auto mt-[50%]" />
        )}
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
