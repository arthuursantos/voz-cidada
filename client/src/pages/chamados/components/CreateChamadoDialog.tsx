import { useState, useRef, useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import api from "@/shared/axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import ProgressBar from "@/components/ProgressStepsBar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Camera, Upload, X, MapPin } from "lucide-react";
import L from "leaflet";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const detailsFormSchema = z.object({
  titulo: z.string().min(1, "O título é obrigatório"),
  descricao: z.string().min(1, "A descrição é obrigatória"),
});

const locationFormSchema = z.object({
  latitude: z.number({ invalid_type_error: "Latitude é obrigatória" }),
  longitude: z.number({ invalid_type_error: "Longitude é obrigatória" }),
});

const photoFormSchema = z.object({
  foto: z
    .instanceof(File, { message: "Por favor, envie um arquivo válido" })
    .refine((file) => file.size <= MAX_FILE_SIZE, "Arquivo deve ter no máximo 5MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Apenas JPG, PNG e WebP são aceitos"
    )
    .optional(),
});

const chamadoFormSchema = detailsFormSchema.merge(locationFormSchema).merge(photoFormSchema);
type ChamadoFormValues = z.infer<typeof chamadoFormSchema>;

interface CreateChamadoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function CreateChamadoDialog({ 
  open, 
  onOpenChange, 
  onSuccess 
}: CreateChamadoDialogProps) {
  const [step, setStep] = useState(0);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useContext(AuthContext);
  // Refs para o mapa e o container
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [locationInformed, setLocationInformed] = useState(false);

  const form = useForm<ChamadoFormValues>({
    resolver: zodResolver(chamadoFormSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      latitude: undefined,
      longitude: undefined,
    },
  });

  useEffect(() => {
    if (step === 1 && open && mapContainerRef.current && !mapRef.current) {
      // Cria o mapa apenas se não existir
      mapRef.current = L.map(mapContainerRef.current).setView([-23.092, -47.21], 13);
      
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapRef.current);

      // Adiciona evento de clique no mapa
      mapRef.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        form.setValue('latitude', lat);
        form.setValue('longitude', lng);
        
        // Atualiza ou cria o marcador
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(mapRef.current!);
        }
      });
    }

    // Limpeza ao desmontar ou mudar de passo
    return () => {
      if (mapRef.current) {
        mapRef.current.off('click');
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [step, open]);

  // Atualiza o marcador quando as coordenadas mudam
  useEffect(() => {
    const latitude = form.watch('latitude');
    const longitude = form.watch('longitude');
    
    if (mapRef.current && latitude && longitude) {
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      } else {
        markerRef.current = L.marker([latitude, longitude]).addTo(mapRef.current);
      }
      
      // Centraliza o mapa nas novas coordenadas
      mapRef.current.setView([latitude, longitude]);
    }
  }, [form.watch('latitude'), form.watch('longitude')]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Arquivo deve ter no máximo 5MB");
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Apenas JPG, PNG e WebP são aceitos");
      return;
    }

    form.setValue("foto", file);
    const reader = new FileReader();
    reader.onload = (event) => setFotoPreview(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveFoto = () => {
    form.setValue("foto", undefined);
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleNext = async () => {
    const fields = step === 0 
      ? ["titulo", "descricao"] 
      : ["latitude", "longitude"];
    
    const isValid = await form.trigger(fields as any);
    if (isValid) setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      form.reset();
      setFotoPreview(null);
      setStep(0);
    }
    onOpenChange(open);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocalização não suportada pelo navegador");
      return;
    }

    toast.info("Obtendo localização...");
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        form.setValue("latitude", pos.lat);
        form.setValue("longitude", pos.lng);
        setLocationInformed(true);
        toast.success("Localização obtida com sucesso!");
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        toast.error("Não foi possível obter a localização");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const onSubmit: SubmitHandler<ChamadoFormValues> = async (values) => {
    if (!user?.id) {
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
      formData.append("titulo", values.titulo);
      formData.append("descricao", values.descricao);
      formData.append("usuarioId", user.id.toString());
      formData.append("status", "PENDENTE");
      formData.append("latitude", values.latitude.toString());
      formData.append("longitude", values.longitude.toString());
      
      if (values.foto) {
        formData.append("fotoAntesFile", values.foto);
      }

      await api.post("/api/chamado/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Chamado criado com sucesso!");
      handleDialogClose(false);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao criar chamado:", error);
      toast.error("Não foi possível criar o chamado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-primary uppercase tracking-wider">
                Novo Chamado
              </DialogTitle>
              <DialogDescription>
                {step === 0 && "O que está acontecendo?"}
                {step === 1 && "Qual é a localização do problema?"}
                {step === 2 && "Tirou alguma foto do problema? Envie pra gente."}
              </DialogDescription>
            </DialogHeader>

            <ProgressBar currentStep={step + 1} totalSteps={3} />

            <div className="space-y-4">
              {step === 0 && (
                <>
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assunto</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Ex: 'Buraco na rua'" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Descreva o problema" 
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {step === 1 && (
                <>
                  <Button
                    onClick={handleGetLocation}
                    className="w-full mb-4 text-[--cor-primaria] bg-white border-[--cor-primaria] hover:border-none hover:bg-[--cor-primaria2] hover:text-white"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Usar Localização Atual
                  </Button>

                  <div id="map" ref={mapContainerRef} className="relative h-[300px] w-full rounded-md overflow-hidden border"/>

                  {!locationInformed && form.formState.errors.latitude && (
                    <p className="text-sm font-medium text-destructive">
                      Informe o endereço do chamado
                    </p>
                  )}
                  

                  <div className="hidden grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              {...field}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                field.onChange(value);
                               
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              {...field}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                field.onChange(value);
                                
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <FormField
                  control={form.control}
                  name="foto"
                  render={() => (
                    <FormItem>
                      <FormLabel>Foto do Problema (Opcional)</FormLabel>
                      {fotoPreview ? (
                        <div className="relative">
                          <img
                            src={fotoPreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={handleRemoveFoto}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 text-[--cor-primaria] bg-white border-[--cor-primaria] hover:border-white hover:bg-[--cor-primaria2] hover:text-white"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Selecionar arquivo
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 text-[--cor-primaria] bg-white border-[--cor-primaria] hover:border-white hover:bg-[--cor-primaria2] hover:text-white"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Tirar foto
                          </Button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                          />
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter>
              <div className="flex justify-between w-full">
                {step > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="text-[--cor-primaria] hover:text-[--cor-primaria]"
                    onClick={handleBack}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Voltar
                  </Button>
                ) : (
                  <div />
                )}

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDialogClose(false)}
                    disabled={isSubmitting}
                    className="text-[--cor-error] bg-white border-[--cor-error] hover:border-white hover:bg-[--cor-error] hover:text-white"
                  >
                    Cancelar
                  </Button>

                  {step < 2 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={isSubmitting}
                      className="text-[--cor-primaria] bg-white border-[--cor-primaria] hover:border-none hover:bg-[--cor-primaria2] hover:text-white"
                    >
                      Avançar
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="text-[--cor-primaria] bg-white border-[--cor-primaria] hover:border-none hover:bg-[--cor-primaria2] hover:text-white"
                    >
                      {isSubmitting ? "Enviando..." : "Enviar Chamado"}
                    </Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}