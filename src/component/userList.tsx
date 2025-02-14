'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  nama: string;
  createdAt: string;
  updatedAt: string;
}


export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');

  // 🔥 Ambil data pengguna dari API
  useEffect(() => {
    const fetchGames = async () => {
      const response = await axios.get('/api/users');
      console.log(response.data);
      setUsers(response.data.games);
      setLoading(false);
    };
    
    fetchGames();
  }, []);

  // 🔥 Tambah pengguna
  const addUser = async () => {
    // kayakya ada error di sini
    // console.log(newName);
    // if (!newName.trim()) {
    //   alert('Nama pengguna wajib diisi!');
    //   return;
    // }
    
    try {
      console.log(newName);
      const response = await axios.post('/api/users', { nama: newName });
      if (response.data) {
        setUsers([...users, response.data]);
        setNewName('');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Terjadi kesalahan saat menambah pengguna');
    }
  };

  // 🔥 Hapus pengguna
  const deleteUser = async (id: number) => {
    await axios.delete('/api/users', { data: { id } });
    setUsers(users.filter((user) => user.id !== id));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold">Daftar Pengguna</h2>
      <ul className="list-disc pl-5">
        {users.map((user) => (
          <li key={user.id}>
            {user.nama} <button onClick={() => deleteUser(user.id)}>❌</button>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Masukkan nama baru"
          className="border p-1"
        />
        <button onClick={addUser} className="ml-2 p-1 bg-blue-500 text-white">Tambah</button>
      </div>
    </div>
  );
}
