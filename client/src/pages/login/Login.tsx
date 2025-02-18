import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useForm } from "react-hook-form";
import { AuthContext } from "@/contexts/AuthContext.tsx"
import {useContext} from "react";

export default function LoginForm(){

    const { register, handleSubmit } = useForm();
    const { signIn } = useContext(AuthContext)

    async function handleSignIn(data) {
        await signIn(data)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-sm mx-auto">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
                        <div>
                            <Input
                                {...register('login')}
                                type="text"
                                placeholder="Login"
                            />
                        </div>
                        <div>
                            <Input
                                {...register('password')}
                                type="password"
                                placeholder="Password"
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Entrar
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>

    );
};