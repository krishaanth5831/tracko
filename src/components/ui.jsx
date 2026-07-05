export const inputCls =
  'w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-white/30 outline-none focus:border-violet-400 [color-scheme:dark]'

export const btnPrimary =
  'rounded-lg bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2.5 font-semibold transition-colors'

export function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card-glass rounded-2xl p-6 w-full max-w-md pop-in max-h-[90vh] overflow-y-auto bg-[#16132b]!">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 text-white/60">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
