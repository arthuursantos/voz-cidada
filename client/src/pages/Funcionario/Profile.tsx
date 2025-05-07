"use client";

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import api from "@/shared/axios";
import { AuthContext, JWTClaims } from "@/contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FuncionarioLayout from "@/shared/FuncionarioLayout";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Mínimo 6 caracteres"),
});

type ProfileFormData = z.infer<typeof schema>;

export default function ProfileFuncionario() {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const jwt = token ? jwtDecode<JWTClaims>(token) : null;
  const funcionarioId = jwt?.sub;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    async function fetchFuncionario() {
      if (!funcionarioId) return;
      try {
        const { data } = await api.get(`/api/funcionario/${funcionarioId}`);
        setValue("email", data.email);
      } catch (err) {
        console.error("Erro ao carregar dados do funcionário:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFuncionario();
  }, [funcionarioId, setValue]);

  const onSubmit = async (form: ProfileFormData) => {
    if (!funcionarioId) return;
    try {
      await api.put(`/api/funcionario/${funcionarioId}`, { email: form.email });
      await api.post(`/api/auth/change-password`, {
        userId: funcionarioId,
        newPassword: form.senha,
      });
      navigate("/funcionario/dashboard");
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
    }
  };

  if (loading) return <p className="p-6">Carregando perfil...</p>;

  return (
    <FuncionarioLayout>
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold">Meu Perfil</h1>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">E-mail</label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full p-2 border rounded-md"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nova Senha</label>
                <input
                  {...register("senha")}
                  type="password"
                  className="w-full p-2 border rounded-md"
                />
                {errors.senha && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.senha.message}
                  </p>
                )}
              </div>

              <Button type="submit">Salvar Alterações</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </FuncionarioLayout>
  );
}
