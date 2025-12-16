import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <h1 className="text-2xl font-bold text-center">404 - Página No Encontrada</h1>
      <p className="text-center mt-3 text-gray-600 text-sm">Lo sentimos, la página que buscas no existe.</p>
      <Link to="/" className="block text-center mt-4 text-blue-600 hover:underline text-sm">
        Volver a la página principal
      </Link>

    </div>
  )
}

export default PageNotFound