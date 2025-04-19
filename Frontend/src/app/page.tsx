import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          User Management System
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl">
          A comprehensive system for managing users with separate interfaces for regular users and administrators.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="text-lg px-8 py-6" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button className="text-lg px-8 py-6" variant="outline" asChild>
            <Link href="/register">Create Account</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
