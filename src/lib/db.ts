export interface ICard {
  id: string;
  name: string;
  logo: string;
  image?: string;
}

const defaultData: ICard[] = [
  {
    id: "1",
    name: "Driver's License",
    logo: "./src/assets/lto.png",
  },
  {
    id: "2",
    name: "Pagibig",
    logo: "./src/assets/pagibig.png",
  },
  {
    id: "3",
    name: "SSS",
    logo: "./src/assets/sss.svg",
  },
  {
    id: "4",
    name: "TIN",
    logo: "./src/assets/bir.png",
  },
  {
    id: "5",
    name: "National ID",
    logo: "./src/assets/PSA.png",
  },
];
export const initDB = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const request = indexedDB.open("myDB");

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains("cards")) {
        db.createObjectStore("cards", { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      // const db = request.result;
      // const tx = db.transaction("cards", "readwrite");
      // const cards = tx.objectStore("cards");
      // defaultData.forEach((card) => {
      //   cards.put(card);
      // });

      // tx.oncomplete = () => {
      //   console.log("Transaction completed");
      // };
      // tx.onerror = () => {
      //   console.log("Transaction completed");
      // };
      resolve(true);
    };

    request.onerror = () => {
      resolve(false);
    };
  });
};

export async function getAllCards() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myDB");

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("cards", "readonly");
      const store = tx.objectStore("cards");

      const getAll = store.getAll();

      getAll.onsuccess = () => resolve(getAll.result);
      getAll.onerror = () => reject(getAll.error);
    };

    request.onerror = () => reject(request.error);
  });
}
