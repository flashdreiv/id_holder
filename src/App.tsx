import { useState, useEffect } from "react";
import "./App.css";

import { Loader2 } from "lucide-react";
import {
  getAllCards,
  initDB,
  type ICard,
  getCardById,
  deleteCard,
} from "./lib/db";
import { CardList } from "./components/CardList";
import { Layout } from "./components/ui/layout";
import {
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";
import { CardViewer } from "./components/CardViewer";
import { AddCardForm } from "./components/AddCardForm";
import { EditCardForm } from "./components/EditCardForm";
import { ThemeProvider } from "./providers/theme-provider";

function ViewCardRoute({
  onCardDeleted,
}: {
  onCardDeleted: () => Promise<void>;
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState<ICard | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadCard() {
      if (id) {
        const cardData = await getCardById(id);
        setCard(cardData as ICard);
      }
    }
    loadCard();
  }, [id]);

  const handleDelete = async (cardId: string) => {
    try {
      setIsDeleting(true);
      await deleteCard(cardId);
      await onCardDeleted();
      navigate("/");
    } catch (error) {
      console.error("Failed to delete card:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!card) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Layout title="View Card" showSearch={false}>
      <CardViewer
        card={card}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        onEdit={() => navigate(`/${card.id}/edit`)}
      />
    </Layout>
  );
}

function EditCardRoute({
  onCardUpdated,
}: {
  onCardUpdated: () => Promise<void>;
}) {
  const { id } = useParams();
  const [card, setCard] = useState<ICard | null>(null);

  useEffect(() => {
    async function loadCard() {
      if (id) {
        const cardData = await getCardById(id);
        setCard(cardData as ICard);
      }
    }
    loadCard();
  }, [id]);

  if (!card) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Layout title="Edit Card" showSearch={false}>
      <EditCardForm
        card={card}
        onSuccess={async () => {
          await onCardUpdated();
        }}
      />
    </Layout>
  );
}

function App() {
  const [isDBReady, setIsDBReady] = useState<boolean>(false);
  const [cards, setCards] = useState<ICard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredCards = cards.filter(
    (card) =>
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isDBReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="id-holder-theme">
      <Routes>
        <Route
          path="/"
          element={
            <Layout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
              <CardList cards={filteredCards} />
            </Layout>
          }
        />
        <Route
          path="/add"
          element={
            <Layout title="Add New Card" showSearch={false} showBackButton>
              <AddCardForm
                onSuccess={async () => {
                  await loadCards();
                  return <Navigate to="/" />;
                }}
              />
            </Layout>
          }
        />
        <Route
          path="/:id"
          element={<ViewCardRoute onCardDeleted={loadCards} />}
        />
        <Route
          path="/:id/edit"
          element={<EditCardRoute onCardUpdated={loadCards} />}
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
