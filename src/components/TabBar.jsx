export function TabBar({ tabs, active, onSelect, onClose }) {
  return (
    <nav className="ui-chrome relative z-10 flex items-end gap-1 border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
      <Tab label="Home" active={active === 'home'} onSelect={() => onSelect('home')} />
      {tabs.map((t) => (
        <Tab
          key={t.id}
          label={t.name}
          active={active === t.id}
          onSelect={() => onSelect(t.id)}
          onClose={() => onClose(t.id)}
        />
      ))}
    </nav>
  )
}

function Tab({ label, active, onSelect, onClose }) {
  return (
    <div
      onClick={onSelect}
      className={`group/tab flex items-center gap-2 px-4 py-2.5 cursor-pointer select-none whitespace-nowrap
        mono text-[10px] border-b-2 -mb-px transition-colors ${
          active
            ? 'border-white text-white'
            : 'border-transparent text-white/35 hover:text-white/70'
        }`}
    >
      <span className="max-w-36 truncate">{label}</span>
      {onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className={`transition-opacity hover:text-white ${
            active ? 'opacity-60' : 'opacity-0 group-hover/tab:opacity-60'
          }`}
          title="Close tab"
        >
          ✕
        </button>
      )}
    </div>
  )
}
