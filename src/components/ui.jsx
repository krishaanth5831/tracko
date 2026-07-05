export const inputCls =
  'w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-white/25 outline-none focus:border-white/40 transition-colors [color-scheme:dark]'

export const btnPrimary =
  'rounded-full bg-white text-black hover:bg-white/85 disabled:opacity-30 disabled:cursor-not-allowed px-5 py-2.5 font-semibold transition-colors'

export const btnGhost =
  'rounded-full bg-transparent border border-white/15 hover:border-white/40 px-4 py-2 text-sm transition-colors'

export function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card rounded-2xl p-6 w-full max-w-md pop-in max-h-[90vh] overflow-y-auto bg-[#0b0b0b]!">
        <div className="flex items-center justify-between mb-5">
          <h2 className="mono text-xs text-white/60">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 text-white/50">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
