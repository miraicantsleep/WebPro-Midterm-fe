"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

interface Transaction {
  id: string; // Use string for UUID
  owner: string; // User ID or username
  name: string; // Transaction name
  type: string; // Income or expense
  amount: number; // Nominal amount
  notes: string; // Description
}

export default function ListCommunalTransaction() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transaction, setTransaction] = useState<Transaction>({
    id: '',
    owner: '',
    name: '',
    type: 'income',
    amount: 0,
    notes: ''
  });

  const fetchTransactions = async () => {
    try {
      const response = await fetch('https://ets-pweb-be-production.up.railway.app/api/transaksi', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setTransactions(data.data.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      [name]: name === 'amount' ? Number(value) : value, // Convert amount to a number
    }));
  };

  const resetForm = () => {
    setTransaction({
      id: '',
      owner: '',
      name: '',
      type: 'income',
      amount: 0,
      notes: ''
    });
    setEditingTransaction(null);
  };

  const handleSubmitTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const url = editingTransaction ? 
        `https://ets-pweb-be-production.up.railway.app/api/transaksi/${editingTransaction.id}` :
        'https://ets-pweb-be-production.up.railway.app/api/transaksi';
      const method = editingTransaction ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Refresh the transaction list after creating or updating
      fetchTransactions();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating/updating transaction:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        const response = await fetch(`https://ets-pweb-be-production.up.railway.app/api/transaksi/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        fetchTransactions(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const openModal = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setTransaction(transaction);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="container mt-5">
      <Button onClick={() => openModal()}>Create Transaction</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Transaction Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Nominal</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.owner}</TableCell>
              <TableCell>{transaction.name}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{transaction.notes}</TableCell>
              <TableCell>
                <Button onClick={() => openModal(transaction)}>Edit</Button>
                {/* <Button onClick={() => deleteTransaction(transaction.id)} className="ml-2">Delete</Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for Creating and Editing Transactions */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-1/3">
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">
                {editingTransaction ? 'Edit Transaction' : 'Create New Transaction'}
              </h2>
              <form onSubmit={handleSubmitTransaction}>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Transaction Name</label>
                  <input
                    type="text"
                    name="name"
                    value={transaction.name}
                    onChange={handleInputChange}
                    placeholder="Enter transaction title"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Notes</label>
                  <input
                    type="text"
                    name="notes"
                    value={transaction.notes}
                    onChange={handleInputChange}
                    placeholder="Enter transaction description"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={transaction.amount}
                    onChange={handleInputChange}
                    placeholder="Enter transaction amount"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Category</label>
                  <select
                    name="type"
                    value={transaction.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  {editingTransaction && (
                    <Button
                      type="button"
                      className="mr-2 bg-red-500 text-white"
                      onClick={() => deleteTransaction(editingTransaction.id)}
                    >
                      Delete
                    </Button>
                  )}
                  <Button
                    type="button"
                    className="mr-2"
                    onClick={() => { setShowModal(false); resetForm(); }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">{editingTransaction ? 'Save Changes' : 'Create'}</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
