export default function Footer() {
  return (
    <footer className="relative bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/80 overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(229,57,53,0.05),_transparent_40%)] dark:bg-[radial-gradient(circle_at_bottom_right,_rgba(229,57,53,0.1),_transparent_40%)]" />
      <div className="relative max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">ZigZag</div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Alimentos frescos de granjas locales hasta tu puerta.</p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Enlaces</h4>
          <ul className="text-sm space-y-3">
            <li className="cursor-pointer text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors">Comprar</li>
            <li className="cursor-pointer text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors">Recetas</li>
            <li className="cursor-pointer text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors">Ayuda</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Contacto</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors cursor-pointer">hola@zigzag.example</p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Redes</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">Instagram · Facebook · Pinterest</p>
        </div>
      </div>
      <div className="relative bg-slate-50 dark:bg-black/20 text-sm text-slate-500 dark:text-slate-500 text-center py-4 border-t border-slate-200 dark:border-white/5 transition-colors duration-300">
        © {new Date().getFullYear()} ZigZag - Tienda de Alimentos. Todos los derechos reservados.
      </div>
    </footer>
  );
}
