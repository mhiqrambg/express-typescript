// Buat file declarations.d.ts di root project Anda
declare global {
    var testPool: import('pg').Pool;
    // Tambahkan variabel global lain yang Anda perlukan
  }
  
  // Penting: Export sesuatu agar file ini diperlakukan sebagai modul
  export {};
  