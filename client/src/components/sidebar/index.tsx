import { cn } from "@/lib/utils.ts"
import { Button } from "@/components/ui/button.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { Link, useLocation } from 'react-router-dom';
import { FileText, Home, Settings, Users, LogOut } from "lucide-react"

interface NavItemProps {
    icon: React.ElementType;
    title: string;
    path: string;
}

const navItems = [
    {
        icon: Home,
        title: "Início",
        path: "/home"
    },
    {
        icon: FileText,
        title: "Relatórios",
        path: "/chamados"
    },
    {
        icon: Users,
        title: "Usuários",
        path: "/perfil"
    },
    {
        icon: Settings,
        title: "Configurações",
        path: "/config"
    }
];

function NavItem({ icon: Icon, title, path }: NavItemProps) {
    const location = useLocation();
    const isActive = location.pathname === path;

    return (
        <Button
            variant="ghost"
            className={cn(
                "w-full justify-center text-white hover:bg-white/10 h-10 px-0",
                isActive && "bg-white/10"
            )}
            asChild
        >
            <Link to={path}>
                <Icon className="h-5 w-5" />
                <span className="sr-only">{title}</span>
            </Link>
        </Button>
    );
}

function LogoutItem() {
    return (
        <>
            <Separator className="my-4 bg-white/20" />
            <NavItem path={"/signin"} icon={LogOut} title="Sair"/>
        </>
    )
}

export default function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("sidebar relative h-screen border-r w-16", className)}>
            <div className="py-4 flex flex-col h-[calc(100%-4rem)]">
                <nav className="space-y-2 px-2">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.path}
                            icon={item.icon}
                            title={item.title}
                            path={item.path}
                        />
                    ))}
                </nav>

                <div className="px-2 mb-4">
                    <LogoutItem/>
                </div>
            </div>
        </div>
    )
}