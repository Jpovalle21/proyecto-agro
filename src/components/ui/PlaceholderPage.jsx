export default function PlaceholderPage({ title }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        <p className="text-sm text-slate-400 mt-2">Módulo en construcción</p>
      </div>
    </div>
  )
}