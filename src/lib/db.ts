export interface ICard {
  id: string;
  name: string;
  logo?: string;
  frontPicture?: string;
  backPicture?: string;
  validUntil?: string;
  type: string;
}

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
      resolve(true);
    };

    request.onerror = () => {
      resolve(false);
    };
  });
};

export async function addCard(card: ICard) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myDB");
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("cards", "readwrite");
      const store = tx.objectStore("cards");
      const addRequest = store.add(card);
      addRequest.onsuccess = () => resolve(true);
      addRequest.onerror = () => reject(addRequest.error);
    };
    request.onerror = () => reject(request.error);
  });
}

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

export async function getCardById(id: string) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myDB");

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("cards", "readonly");
      const store = tx.objectStore("cards");

      const getRequest = store.get(id);

      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => reject(getRequest.error);
    };

    request.onerror = () => reject(request.error);
  });
}

export async function deleteCard(id: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myDB");

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("cards", "readwrite");
      const store = tx.objectStore("cards");

      const deleteRequest = store.delete(id);

      deleteRequest.onsuccess = () => resolve(true);
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };

    request.onerror = () => reject(request.error);
  });
}

export async function updateCard(
  card: ICard,
  oldId?: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myDB");

    request.onsuccess = async () => {
      const db = request.result;
      const tx = db.transaction("cards", "readwrite");
      const store = tx.objectStore("cards");

      try {
        // If we're changing the ID, delete the old record first
        if (oldId && oldId !== card.id) {
          await new Promise<void>((resolve, reject) => {
            const deleteRequest = store.delete(oldId);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
          });
        }

        // Add/update the card with the new ID
        const updateRequest = store.put(card);
        updateRequest.onsuccess = () => resolve(true);
        updateRequest.onerror = () => reject(updateRequest.error);
      } catch (error) {
        reject(error);
      }
    };

    request.onerror = () => reject(request.error);
  });
}
