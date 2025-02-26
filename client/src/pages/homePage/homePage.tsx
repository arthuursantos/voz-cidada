"use client";

import { useState } from "react";
import { Bell, LogOut, MapPin, Search, User } from 'lucide-react';

export default function Dashboard() {
  const [notifications] = useState(1);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#2B87B3] text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-8 w-8" />
            <div className="flex flex-col">
              <span className="text-sm">Nome_cidadão</span>
              <button className="text-xs hover:underline">
                <span className="flex items-center gap-1">
                  <LogOut className="h-3 w-3" />
                  Finalizar Sessão
                </span>
              </button>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="hover:underline">HOME</a>
            <a href="#" className="hover:underline">SOBRE NÓS</a>
            <a href="#" className="hover:underline">FALE CONOSCO</a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="h-6 w-6" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Pesquisar ocorrências..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Grid Cards */}
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Square Cards */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold">Registro do Chamado</h3>
          <MapPin className="text-red-500 h-6 w-6 mx-auto" />
          <p className="text-sm text-center text-gray-500">outras informações...</p>
          <p className="text-sm text-center">Em análise...</p>
          <div className="flex justify-center">
            <div className="bg-red-500 rounded-full h-10 w-10" />
          </div>
        </div>

        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold">Registro do Chamado</h3>
          <MapPin className="text-red-500 h-6 w-6 mx-auto" />
          <p className="text-sm text-center text-gray-500">outras informações...</p>
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4].map((star) => (
              <span key={star} className="text-yellow-400">★</span>
            ))}
            <span className="text-gray-300">★</span>
          </div>
          <div className="flex justify-center">
            <div className="bg-green-500 rounded-full h-10 w-10" />
          </div>
        </div>
      </div>

      {/* List Cards */}
      <div className="max-w-7xl mx-auto p-4 space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex items-center border rounded-lg p-3 gap-4"
          >
            <MapPin className="text-red-500 h-6 w-6" />
            <div className="flex-1">
              <h3 className="font-semibold">Registro do Chamado</h3>
              <p className="text-sm text-gray-500">outras informações...</p>
              <p className="text-sm">Em análise...</p>
            </div>
            <div className="bg-red-500 rounded-full h-8 w-8" />
          </div>
        ))}
      </div>

      {/* Open Call Button */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4">
        <button className="bg-[#673AB7] text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
          ABRIR CHAMADO
        </button>
      </div>

      {/* Decorative Waves */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 320"
          className="w-full"
          style={{ transform: "rotate(180deg)" }}
        >
          <path
            fill="#2B87B3"
            fillOpacity="0.2"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,224C672,213,768,171,864,149.3C960,128,1056,128,1152,133.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}