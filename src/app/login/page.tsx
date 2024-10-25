"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleInputUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('https://ets-pweb-be-production.up.railway.app/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('username', values.email);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('role', data.data.role); // Save the role

        console.log(data);
        
        //pindah ke dashboard
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        alert('Login gagal: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error('Terjadi kesalahan', error);
      alert('Terjadi kesalahan');
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="">
        <CardHeader className="flex items-center">
          <CardTitle>LOGIN</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-2" onSubmit={handleLogin}>
            <div>
              <label className="text-sm font-medium">Email</label> {/* Updated label */}
              <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleInputUser}
                placeholder="Email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={values.password}
                onChange={handleInputUser}
                placeholder="Password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              />
            </div>
            <Button className="w-full" type="submit">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
