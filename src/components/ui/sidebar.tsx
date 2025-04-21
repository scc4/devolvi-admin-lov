
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Menu as MenuIcon,
} from "lucide-react";

type SidebarContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const SidebarContext = React.createContext<SidebarContextType>({
  open: true,
  setOpen: () => {},
  toggle: () => {},
});

export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const toggle = React.useCallback(() => setOpen((prev) => !prev), []);

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { open } = useSidebar();
  const { className, ...rest } = props;

  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r bg-sidebar transition-all duration-300 ease-in-out dark:border-sidebar-border",
        open ? "w-64" : "w-20",
        className
      )}
      {...rest}
    />
  );
});

Sidebar.displayName = "Sidebar";

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  const { className, ...rest } = props;
  const { toggle, open } = useSidebar();

  return (
    <button
      ref={ref}
      onClick={toggle}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-md bg-sidebar text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sidebar-ring",
        className
      )}
      {...rest}
    >
      {open ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
});

SidebarTrigger.displayName = "SidebarTrigger";

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-14 items-center border-b border-sidebar-border px-4",
        className
      )}
      {...rest}
    />
  );
});

SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn("flex flex-1 flex-col overflow-hidden", className)}
      {...rest}
    />
  );
});

SidebarContent.displayName = "SidebarContent";

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center border-t border-sidebar-border p-4",
        className
      )}
      {...rest}
    />
  );
});

SidebarFooter.displayName = "SidebarFooter";

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn("py-2", className)}
      {...rest}
    />
  );
});

SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { open } = useSidebar();
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn(
        "mb-2 px-4 text-xs font-medium text-sidebar-foreground/50",
        open ? "text-left" : "text-center",
        className
      )}
      {...rest}
    />
  );
});

SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn("space-y-1", className)}
      {...rest}
    />
  );
});

SidebarGroupContent.displayName = "SidebarGroupContent";

export const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn("space-y-1 px-2", className)}
      {...rest}
    />
  );
});

SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn("", className)}
      {...rest}
    />
  );
});

SidebarMenuItem.displayName = "SidebarMenuItem";

const menuButtonVariants = cva(
  "group flex w-full items-center rounded-md px-3 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sidebar-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      isActive: {
        default: "",
        true: "bg-sidebar-accent text-sidebar-accent-foreground",
      },
    },
    defaultVariants: {
      isActive: "default",
    },
  }
);

export interface SidebarMenuButtonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  asChild?: boolean;
}

export const SidebarMenuButton = React.forwardRef<
  HTMLDivElement,
  SidebarMenuButtonProps
>(({ className, isActive, asChild = false, ...props }, ref) => {
  const { open } = useSidebar();

  return (
    <div
      ref={ref}
      className={cn(
        menuButtonVariants({ isActive }),
        open ? "" : "justify-center px-0 py-2",
        className
      )}
      {...props}
    >
      {props.children}
    </div>
  );
});

SidebarMenuButton.displayName = "SidebarMenuButton";
