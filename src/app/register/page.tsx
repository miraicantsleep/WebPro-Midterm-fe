"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    telp_number: '',
    password: ''
  });

  const router = useRouter();

  const handleInputUser = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  }

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('https://ets-pweb-be-production.up.railway.app/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        const data = await response.json();
        alert('Register berhasil');

        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        alert('Register gagal: ' + JSON.stringify(errorData));
      }
    } catch {
      console.error('Terjadi kesalahan');
      alert('Terjadi kesalahan');
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="">
        <CardHeader className="flex items-center">
          <CardTitle>REGISTER</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-2" onSubmit={handleRegister}>
            <div>
              <label className="text-sm font-medium mx-1">Nama</label>
              <input
                type="text"
                id="name"
                name="name"
                value={values.name}
                onChange={handleInputUser}
                placeholder="Masukan nama lengkap"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium mx-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleInputUser}
                placeholder="Masukan email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium mx-1">Nomor Telepon</label>
              <input
                type="number"
                id="telp_number"
                name="telp_number"
                value={values.telp_number}
                onChange={handleInputUser}
                placeholder="Masukan nomor telepon"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium mx-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={values.password}
                onChange={handleInputUser}
                placeholder="Masukan password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              />
            </div>
            <Button className="w-full" type="submit">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
