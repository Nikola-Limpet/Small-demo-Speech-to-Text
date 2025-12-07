'use client'

import { SidebarProvider } from '@/components/ui/sidebar'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <div className='flex min-h-svh w-full flex-1 flex-col md:ml-64 transition-all duration-200 ease-linear md:peer-data-[state=collapsed]:ml-0'>
        {children}
      </div>
    </SidebarProvider>
  )
}
