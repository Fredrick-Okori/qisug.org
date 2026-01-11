// app/(admin)/layout.tsx
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Fixed Sidebar */}
        <Sidebar />
        
        {/* Content Area */}
        <main className="flex-1 bg-gray-50 dark:bg-slate-950 overflow-y-auto">
          <div className="p-8">
             {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
