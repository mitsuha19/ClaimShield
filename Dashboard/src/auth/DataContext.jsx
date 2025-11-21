import { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [pengajuan, setPengajuan] = useState([]);

  // Muat dari localStorage saat aplikasi pertama kali dibuka
  useEffect(() => {
    const stored = localStorage.getItem("pengajuan-data");
    if (stored) setPengajuan(JSON.parse(stored));
  }, []);

  // Simpan setiap perubahan data ke localStorage
  useEffect(() => {
    localStorage.setItem("pengajuan-data", JSON.stringify(pengajuan));
  }, [pengajuan]);

  // ➕ Tambah data
  function addPengajuan(item) {
    const newItem = { ...item };
    setPengajuan(prev => [...prev, newItem]);
  }

  // ✏️ Edit data
  function editPengajuan(id, updatedData) {
    setPengajuan(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updatedData } : item))
    );
  }

  // 🗑 Hapus data
  function deletePengajuan(id) {
    setPengajuan(prev => prev.filter(item => item.id !== id));
  }

  function getPengajuanById(id) {
    return pengajuan.find(item => item.id === id);
  }

  return (
    <DataContext.Provider
      value={{
        pengajuan,
        addPengajuan,
        editPengajuan,
        deletePengajuan,
        getPengajuanById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
