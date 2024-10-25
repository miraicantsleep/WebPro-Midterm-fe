"use client"

import Navbar from "@/components/molecules/navbar/NavBar";
import ListPersonalTransaction from "@/components/organism/dashboard/ListPersonalTransaction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<{ id: string; name: string; notes: string; amount: number; type: string } | null>(null);
  const [transaction, setTransaction] = useState({
    title: '',
    notes: '',
    amount: '',
    categories: 'income'
  });

  const [userName, setUserName] = useState('');
  const [listTransaction, setListTransaction] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalNetWorth, setTotalNetWorth] = useState(0);

  useEffect(() => {
    const storedUserName = localStorage.getItem('username');
    if (storedUserName) {
      setUserName(storedUserName);
    }

    const token = localStorage.getItem('token');
    if (token) {
      fetchTransaction(token);
    }
  }, []);

  const fetchTransaction = async (token: string) => {
    try {
      const response = await fetch('https://ets-pweb-be-production.up.railway.app/api/transaksi', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setListTransaction(data.data.data);
        calculateTotal(data.data.data);
      } else {
        console.error('Failed to fetch transactions', response.status);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }

  const createTransaction = async (transaction: { title: string; notes: string; amount: string; categories: string }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }

    try {
      const response = await fetch('https://ets-pweb-be-production.up.railway.app/api/transaksi', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: transaction.title,
          notes: transaction.notes,
          amount: parseFloat(transaction.amount),
          type: transaction.categories,
        }),
      });

      if (response.ok) {
        await response.json();
        fetchTransaction(token);
        resetForm();
      } else {
        console.error('Failed to create transaction', response.status);
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  }

  const updateTransaction = async (transaction: { id: string; title: string; notes: string; amount: string; categories: string }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }

    try {
      const response = await fetch('https://ets-pweb-be-production.up.railway.app/api/transaksi', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: transaction.title,
          notes: transaction.notes,
          amount: parseFloat(transaction.amount),
          type: transaction.categories,
        }),
      });

      if (response.ok) {
        fetchTransaction(token); // Refresh the list after updating
        resetForm(); // Reset the form after updating a transaction
      } else {
        console.error('Failed to update transaction', response.status);
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  }

  const deleteTransaction = async (transactionId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }

    try {
      const response = await fetch(`https://ets-pweb-be-production.up.railway.app/api/transaksi/${transactionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchTransaction(token); // Refresh the list after deletion
        resetForm(); // Reset the form after deletion
        setShowModal(false); // Close the modal after deleting
      } else {
        console.error('Failed to delete transaction', response.status);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  }

  const handleSubmitTransaction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingTransaction) {
      await updateTransaction({ ...transaction, id: editingTransaction.id });
    } else {
      await createTransaction(transaction);
    }
    setShowModal(false);
  }

  const handleEditTransaction = (transaction: { id: string; name: string; notes: string; amount: number; type: string }) => {
    setTransaction({
      title: transaction.name, // Use 'title' correctly
      notes: transaction.notes, // Match the keys properly
      amount: transaction.amount.toString(),
      categories: transaction.type,
    });
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const resetForm = () => {
    setTransaction({
      title: '',
      notes: '',
      amount: '',
      categories: 'income',
    });
    setEditingTransaction(null);
  };

  const calculateTotal = (transactions: { type: string; amount: number }[]) => {
    let incomes = 0;
    let expenses = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        incomes += transaction.amount;
      } else {
        expenses += transaction.amount;
      }
    });
    setTotalIncome(incomes);
    setTotalExpenses(expenses);
    setTotalNetWorth(incomes - expenses);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTransaction((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="">
      <Navbar />
      <div className="h-screen flex flex-col">
        <section className="h-[10vh] flex justify-start items-end">
          <h1 className="text-3xl mx-10">Welcome, {userName}</h1>
        </section>

        <section className="flex justify-center items-center h-[20vh]">
          <div className="w-1/3 mx-5">
            <Card>
              <CardHeader>
                <CardTitle>Total Net Worth</CardTitle>
              </CardHeader>
              <CardContent>
                <h1>Rp {totalNetWorth.toLocaleString()}</h1>
              </CardContent>
            </Card>
          </div>
          <div className="w-1/3 mx-5">
            <Card>
              <CardHeader>
                <CardTitle>Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                <h1>Rp {totalIncome.toLocaleString()}</h1>
              </CardContent>
            </Card>
          </div>
          <div className="w-1/3 mx-5">
            <Card>
              <CardHeader>
                <CardTitle>Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <h1>Rp {totalExpenses.toLocaleString()}</h1>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="w-full flex justify-start">
          <Button className="ml-10" onClick={() => setShowModal(true)}>Create</Button>
        </div>

        <section className="mx-10">
          <ListPersonalTransaction
            transactions={listTransaction}
            onEdit={handleEditTransaction}
          />
        </section>

        {showModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg w-1/3">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">
                  {editingTransaction ? 'Edit Transaction' : 'Create New Transaction'}
                </h2>
                <form onSubmit={handleSubmitTransaction}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={transaction.title}
                      onChange={handleInputChange}
                      placeholder="Enter transaction title"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Description</label>
                    <input
                      type="text"
                      name="notes" // Match the 'notes' key
                      value={transaction.notes}
                      onChange={handleInputChange}
                      placeholder="Enter transaction description"
                      className="w-full px-3 py-2 border rounded-md"
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
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Category</label>
                    <select
                      name="categories"
                      value={transaction.categories}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="income">Income</option>
                      <option value="expenses">Expenses</option>
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
                    <Button type="button" className="mr-2" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
                    <Button type="submit">{editingTransaction ? 'Save Changes' : 'Create'}</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
