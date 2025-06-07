import { cn } from "@/shared/utils.ts"
import { Button } from "@/components/ui/button.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { Link, useLocation } from 'react-router-dom';
import { FileText, Home, Settings, Users, LogOut } from "lucide-react"
import { useState, useEffect, useContext } from "react";
import { ProfileDialog } from "@/components/dialogs/ProfileDialog";
import { AuthContext } from "@/contexts/AuthContext";

interface NavItemProps {
  icon: React.ElementType;
  title: string;
  path?: string;
  collapsed: boolean;
  isDialog?: boolean;
}

function NavItem({ icon: Icon, title, path, collapsed, isDialog }: NavItemProps) {
  const location = useLocation();
  const isActive = path === location.pathname;

  if (isDialog) {
    return <ProfileDialog collapsed={collapsed} />;
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 text-white hover:bg-white/10 h-10",
        collapsed ? "px-2" : "",
        isActive && "bg-white/10"
      )}
      asChild
      title={collapsed ? title : undefined}
    >
      <Link to={path!} className={collapsed ? "flex justify-center" : "flex items-center gap-3"}>
        <Icon className="h-5 w-5" />
        {!collapsed && <span>{title}</span>}
      </Link>
    </Button>
  );
}

function LogoutItem({ collapsed }: { collapsed: boolean }) {
  return (
    <>
      <Separator className="my-4 bg-white/20" />
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 text-white hover:bg-white/10 h-10",
          collapsed ? "px-2" : ""
        )}
        asChild
        title={collapsed ? "Sair" : undefined}
      >
        <Link to="/signin" className={collapsed ? "flex justify-center" : "flex items-center gap-3"}>
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Sair</span>}
        </Link>
      </Button>
    </>
  );
}

export default function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [collapsed, setCollapsed] = useState(false);
  const { userRoles } = useContext(AuthContext);

  useEffect(() => {
    const checkScreenSize = () => setCollapsed(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const isAgente = userRoles?.includes("ROLE_AGENT");
  const isAdmin = userRoles?.includes("ROLE_OWNER") || userRoles?.includes("ROLE_ADMIN");

  const navItems = isAgente
    ? [
        { icon: FileText, title: "Meus Chamados", path: "/funcionario/Dashboard" },
        { icon: FileText, title: "Histórico", path: "/funcionario/Historico" },
        { icon: Users, title: "Perfil", path: "/funcionario/Profile" }
      ]
    : isAdmin
    ? [
        { icon: Home, title: "Admin Dashboard", path: "/admin/dashboard" },
        // ...adicionar outros itens de admin aqui
      ]
    : [
        { icon: Home, title: "Início", path: "/home" },
        { icon: FileText, title: "Chamados", path: "/chamados" },
        { icon: Users, title: "Perfil", isDialog: true },
        { icon: Settings, title: "Configurações", path: "/config" }
      ];

  return (
    <div
      className={cn(
        "sidebar fixed top-0 left-0 h-screen border-r bg-primary z-40 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="py-4 flex flex-col h-[calc(100%-4rem)]">
        <nav className={cn("space-y-2", collapsed ? "px-1" : "px-2")}>
          {navItems.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              title={item.title}
              path={item.path}
              collapsed={collapsed}
              isDialog={item.isDialog}
            />
          ))}
        </nav>
        <div className={cn("mb-4", collapsed ? "px-1" : "px-2")}>  
          <LogoutItem collapsed={collapsed} />
        </div>
      </div>
    </div>
  );
}
