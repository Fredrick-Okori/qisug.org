import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileUser, 
  CheckCircle, 
  ClipboardList, 
  Settings, 
  LogOut 
} from 'lucide-react';

const AdminSidebar = () => {
  const menuItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Applied Students', href: '/admin/applied', icon: ClipboardList },
    { name: 'Review Documents', href: '/admin/documents', icon: FileUser },
    { name: 'Approved Students', href: '/admin/approved', icon: CheckCircle },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-slate-900 text-slate-300 border-r border-slate-800">
      {/* School Logo/Title Area */}
      <div className="p-6">
        <h1 className="text-xl font-bold text-white tracking-tight">
          QISUG <span className="text-blue-400">Admin</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium uppercase">Management Portal</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors group"
          >
            <item.icon size={20} className="text-slate-400 group-hover:text-blue-400" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800 space-y-1">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-red-400 rounded-md hover:bg-red-900/20 transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;