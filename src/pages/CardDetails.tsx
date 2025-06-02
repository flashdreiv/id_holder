import { Button } from "@/components/ui/button";
import { useParams } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getCardById, type ICard } from "@/lib/db";
import { CardViewer } from "@/components/CardViewer";

const CardDetails = () => {
  const { card_id } = useParams();
  const navigate = useNavigate();

  const [card, setCard] = useState<ICard | null>(null);

  const fetchCardDetails = async (id: string) => {
    try {
      const cardDetails = await getCardById(id);
      if (!cardDetails) {
        navigate("/");
      }
      setCard(cardDetails as ICard);
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  };

  useEffect(() => {
    if (!card_id) {
      navigate("/");
      return;
    }
    fetchCardDetails(card_id);
  }, [card_id, navigate]);

  return card ? (
    <div className="flex flex-col gap-6">
      <header className="flex gap-4 justify-between items-center">
        <Button color="secondary" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-3xl font-bold">{card.name}</h1>
      </header>
      <main className="flex flex-col gap-4">
        <CardViewer card={card} />
      </main>
    </div>
  ) : (
    <Loader2 className="size-10 animate-spin text-blue-500 m-auto mt-[50%]" />
  );
};

export default CardDetails;
