import { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [pengajuan, setPengajuan] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("pengajuan-data");
    if (stored) setPengajuan(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("pengajuan-data", JSON.stringify(pengajuan));
  }, [pengajuan]);

  function addPengajuan(item) {
    const newItem = { ...item, status: "Menunggu", alasan: null };
    setPengajuan(prev => [...prev, newItem]);
  }

  function editPengajuan(id, updatedData) {
    setPengajuan(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, ...updatedData }
          : item
      )
    );
  }

  function deletePengajuan(id) {
    setPengajuan(prev => prev.filter(item => item.id !== id));
  }

  function getPengajuanById(id) {
    return pengajuan.find(item => item.id === id);
  }

  function updateStatus(id, status, alasan = null) {
    setPengajuan(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status, alasan }
          : item
      )
    );
  }

  return (
    <DataContext.Provider
      value={{
        pengajuan,
        addPengajuan,
        editPengajuan,
        deletePengajuan,
        getPengajuanById,
        updateStatus
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
