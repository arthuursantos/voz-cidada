import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AuthContext } from '@/contexts/AuthContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@radix-ui/react-label'
import { LockIcon } from 'lucide-react'
import { useContext, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import BlocoConfirmacao from './Components/BlocoDeConfirmacao.tsx'
import { Link } from 'react-router'
import toast from 'react-hot-toast'

const Profile = () => {
  const { isGoogleUser, user, getCepApi, updateUser } = useContext(AuthContext)

  const [cep, setCep] = useState(user?.cep || "12345-678");
  const [rua, setRua] = useState(user?.rua || "");
  const [bairro, setBairro] = useState(user?.bairro || "");
  const [cidade, setCidade] = useState(user?.cidade || "");
  const [uf, setUf] = useState(user?.uf || "");

  const message = "Formato de CEP inválido. Use 00000-000 ou 00000000."

  const [isError, setIsError] = useState(false)
  const [confirmation, setConfirmation] = useState(false)
  const [hasChanges, setHasChanges] = useState(true)

  const updateUserSchema = z.object({
    cep: z.string()
          .min(8)
          .max(9)
          .regex(/^\d{5}-?\d{3}$/, "Formato de CEP inválido. Use 00000-000 ou 00000000.")
          .transform((cep) => cep.replace(/[^0-9]/g, "")),
  })

  type updateUserData = z.infer<typeof updateUserSchema>

  const { register, handleSubmit  } = useForm<updateUserData>({
          resolver: zodResolver(updateUserSchema)
      })

  const enableCepSubmit = () => {
    const cepInput = document.getElementById('cep') as HTMLInputElement
    const cepChangeBtn = document.getElementById('cepChangeBtn') as HTMLButtonElement

    if((cepInput.value !== user?.cep && cepInput.value !==  "12345-678") && (cepInput.value.length == 9 || cepInput.value.length == 8)){
      cepChangeBtn.disabled = false
    } else {
      cepChangeBtn.disabled = true
    }
  }

  const validateCep = (cep: string) => {
    const cepRegex = /^\d{5}-?\d{3}$/;
    if (!cepRegex.test(cep)) {
      setIsError(true);
      return cep; // Return the invalid CEP to avoid setting it to undefined
    }
    setIsError(false);
    return cep.replace(/[^0-9]/g, ""); // Return the cleaned CEP
  };
  
  const changeAddress = async (cep: string) => {
    if (!cep) {
      console.error('CEP inválido.');
      return null;
    }
  
    if (isError) {
      return;
    }
  
    try {
      const response = await getCepApi(cep);
  
      if (!response) {
        console.error('CEP não encontrado.');
        return null;
      }
  
      // Atualiza os campos de endereço
      setRua(response.logradouro);
      setBairro(response.bairro);
      setCidade(response.localidade);
      setUf(response.uf);
      
      setHasChanges(false)
      // Verifica se há mudanças após atualizar os campos
    } catch (error) {
      console.error('Erro ao buscar o CEP:', error);
      return null;
    }
  };

  const handleUpdateUser: SubmitHandler<updateUserData> = async (data) => {
    toast.promise(
      async() => {
        console.log(data)
        await updateUser(data)
        setConfirmation(false) // Fechar o pop-up após a confirmação
        setHasChanges(true)
      },
      {
        loading: 'Atualizando endereço...',
        success: 'Endereço atualizado com sucesso!',
        error: 'Erro ao atualizar o endereço. Tente novamente.'
      }
    )
    
  }

  const resetForm = () => {
    setCep(user?.cep || "12345-678");
    setRua(user?.rua || "");
    setBairro(user?.bairro || "");
    setCidade(user?.cidade || "");
    setUf(user?.uf || "");

    setHasChanges(true);
  };

  const checkForChanges = () => {
    const hasChanges =
      rua !== (user?.rua || "") ||
      bairro !== (user?.bairro || "") ||
      cidade !== (user?.cidade || "") ||
      uf !== (user?.uf || "");
  
    setHasChanges(hasChanges);
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-[--cor-primaria2] font-montserrat text-center mt-4'>Dados da Conta</h1>
      <div className='flex flex-col md:flex-row border-t-2 border-grey mt-4 flex-grow overflow-auto'>
        {/* div info pessoal */}
        <div className='flex flex-col items gap-4 w-xl pb-4 border-b-2 md:border-r-2 border-grey'>
          <CardHeader>
            <CardTitle><h1 className='font-montserrat text-[--cor-primaria2] text-2xl'>Informações Pessoais</h1></CardTitle>
            <CardDescription><p className='font-lato text-md sm:text-md md:text-lg'>Suas informações pessoais não podem ser modificadas.</p></CardDescription>
          </CardHeader>
          <div className="grid font-lato gap-2 pl-8 pr-8">
            <div className="flex items-center justify-between">
              <Label htmlFor="name">Nome Completo</Label>
              <LockIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input id="name" value={user? user.nome : 'Nome_Cidadão'} disabled className="bg-muted/50" />
          </div>
          
          { !isGoogleUser && <div className="grid font-lato gap-2 pl-8 pr-8">
            <div className="flex items-center justify-between">
              <Label htmlFor="cpf">CPF</Label>
              <LockIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input id="cpf" value={user? user.cpf : '123.456.789-00'} disabled className="bg-muted/50" />
          </div>}

          { !isGoogleUser && <div className="grid font-lato gap-2 pl-8 pr-8">
            <div className="flex items-center justify-between">
              <Label htmlFor="name">Data de Nascimento</Label>
              <LockIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input id="name" type='date' value={user? user.dataNascimento : ''} disabled className="bg-muted/50" />
          </div>}

          { !isGoogleUser && <Button className='mx-auto bg-[--cor-primaria] hover:bg-[#162547] w-48'>
            <Link to='/redefinir-senha' className='text-white'>Redefinição de Senha</Link>
          </Button>}
        </div>

        {/* div info endereco */}
        <div className='flex flex-col gap-4 w-full'>
        
          <CardHeader>
            <CardTitle><p className='font-montserrat text-[--cor-primaria2] text-2xl md:text-3xl text-center'>Informação de endereço</p></CardTitle>
          </CardHeader>
            <CardContent>
           
              <div className="grid font-lato gap-2">
              <form onSubmit={async(e) => {
                e.preventDefault();
                await changeAddress(cep)
              }}>
                <label htmlFor="cep">CEP</label>

                <div className='flex items-center gap-2'>
                  <Input {...register('cep')} id="cep" value={cep} onChange={(e) => {
                      const validatedCep = validateCep(e.target.value);
                      setCep(validatedCep);
                      enableCepSubmit();
                    }} type='text' maxLength={9} placeholder="00000-000" className='w-32' />
                    
                    <Button disabled id='cepChangeBtn' className='bg-[--cor-primaria] hover:bg-[#162547]'>Trocar Cep</Button>
                    {isError && <span className='text-red-500 text-sm'> {message} </span>}
                </div>

                
                <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target='_blank' className='text-[--cor-primaria2] text-sm hover:underline w-fit'>Esqueceu o CEP?</a>
              </form>
              </div>

            <form className='font-lato' onSubmit={handleSubmit(handleUpdateUser)}>
              <div className="grid gap-2">
                <Label htmlFor="street">Rua</Label>
                <Input  id="street" value={rua} onChange={(e) => {
                                                      setRua(e.target.value);
                                                      checkForChanges(); // Verifica mudanças após alterar o campo
                                                    }} disabled placeholder="Digite sua rua" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input  id="bairro" value={bairro} onChange={(e) => {
                                                        setBairro(e.target.value);
                                                        checkForChanges(); // Verifica mudanças após alterar o campo
                                                      }} disabled placeholder="Digite seu bairro" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input  id="city" value={cidade} onChange={(e) => {
                                                        setCidade(e.target.value);
                                                        checkForChanges(); // Verifica mudanças após alterar o campo
                                                      }} disabled placeholder="Digite sua cidade" />
                </div>
                <div className="grid gap-2 w-28">
                  <Label htmlFor="state">UF</Label>
                  <Input  id='estado' value={uf} onChange={(e) => {
                                                      setUf(e.target.value);
                                                      checkForChanges(); // Verifica mudanças após alterar o campo
                                                    }} disabled placeholder='Digite o UF'/>
                </div>
              </div>
              <CardFooter className="flex justify-end space-x-2">
                <Button type='button' onClick={resetForm} variant="outline">Cancelar</Button>
                <Button type="button" onClick={() => setConfirmation(true)} disabled={hasChanges} className='bg-[--cor-primaria] hover:bg-[#162547]'>Salvar alterações</Button>
              </CardFooter>
              {confirmation && <BlocoConfirmacao setConfirmation={setConfirmation} onConfirm={handleSubmit(handleUpdateUser)} />}
            </form>
            </CardContent>
        </div>
      </div>
    </div>
  )
}

export default Profile