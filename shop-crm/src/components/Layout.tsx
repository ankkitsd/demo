import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="ml-64">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
