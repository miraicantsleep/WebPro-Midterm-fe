import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="flex flex-col items-center justify-center">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <Button>
            <Link href={"/login"}>Login</Link>
          </Button>
          <Button>
            <Link href={'/register'}>Register</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
