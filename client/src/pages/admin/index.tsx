"use client"

import { useState } from "react"
import { Plus, Search, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Header from "@/components/header"

export default function AdminPanel() {

  const [showNewEmployeeDialog, setShowNewEmployeeDialog] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input className="pl-10 bg-white border-gray-200" placeholder="Pesquisar setores ou funcionários..." />
          </div>

          <Tabs defaultValue="sectors">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="sectors">Setores</TabsTrigger>
                <TabsTrigger value="employees">Funcionários</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">

                <Dialog open={showNewEmployeeDialog} onOpenChange={setShowNewEmployeeDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#1e88e5] hover:bg-[#1976d2]">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Funcionário
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-montserrat">Cadastrar Novo Funcionário</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 font-lato">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="employee-name" className="font-montserrat">Nome</Label>
                          <Input id="employee-name" placeholder="Nome completo" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="employee-role" className="font-montserrat">Cargo</Label>
                          <Input id="employee-role" placeholder="Cargo" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="employee-sector" className="font-montserrat">Setor</Label>
                        <div className="relative">
                          <select
                            id="employee-sector"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          >
                            <option value="" disabled selected>
                              Selecione o setor
                            </option>
                            <option value="obras">Obras Públicas</option>
                            <option value="saude">Saúde</option>
                            <option value="transporte">Transporte</option>
                            <option value="seguranca">Segurança</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="employee-email" className="font-montserrat">Login</Label>
                        <Input id="employee-email" type="email" placeholder="email@prefeitura.gov.br" />
                      </div>
                        <div className="grid gap-2">
                          <Label htmlFor="employee-password" className="font-montserrat">Senha</Label>
                          <Input id="employee-password" type="password" placeholder="Senha" />
                        </div>
                      </div>
                      
                    </div>
                    <div className="flex justify-end gap-2 font-montserrat">
                      <Button variant="outline" onClick={() => setShowNewEmployeeDialog(false)}>
                        Cancelar
                      </Button>
                      <Button
                        className="bg-[#1e88e5] hover:bg-[#1976d2] font-montserrat"
                        onClick={() => setShowNewEmployeeDialog(false)}
                      >
                        Salvar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent value="sectors" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                {/* Sector Cards */}
                <Card>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-medium">Obras Públicas</CardTitle>
                    <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-2">
                      Responsável por manutenção de vias e obras públicas
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        Funcionários: <span className="font-medium">12</span>
                      </div>
                      <div>
                        Chamados: <span className="font-medium">47</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-medium">Saúde</CardTitle>
                    <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-2">Responsável por questões de saúde pública</div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        Funcionários: <span className="font-medium">24</span>
                      </div>
                      <div>
                        Chamados: <span className="font-medium">31</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-medium">Transporte</CardTitle>
                    <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-2">
                      Responsável por transporte público e mobilidade
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        Funcionários: <span className="font-medium">18</span>
                      </div>
                      <div>
                        Chamados: <span className="font-medium">52</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-medium">Segurança</CardTitle>
                    <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </CardHeader>

                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-2">
                      Responsável por segurança pública e vigilância
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        Funcionários: <span className="font-medium">32</span>
                      </div>
                      <div>
                        Chamados: <span className="font-medium">28</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="employees">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse font-lato">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-4 text-left font-medium font-montserrat">Nome</th>
                          <th className="p-4 text-left font-medium font-montserrat">Setor</th>
                          <th className="p-4 text-left font-medium font-montserrat">Cargo</th>
                          <th className="p-4 text-left font-medium font-montserrat">Email</th>
                          
                          <th className="p-4 text-right font-medium font-montserrat">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
// Pencil icon
function Edit(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  )
}

const tableRowData = () => {
    return(
        <tr className="border-b hover:bg-muted/50">
            <td className="p-4 font-medium">Carlos Silva</td>
            <td className="p-4">Obras Públicas</td>
            <td className="p-4">Engenheiro</td>
            <td className="p-4">carlos.silva@prefeitura.gov.br</td>
            <td className="p-4 text-right">
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                <Trash className="h-4 w-4" />
            </Button>
            </td>
        </tr>
    )
}