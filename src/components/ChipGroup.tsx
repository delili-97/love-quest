type Props = {
  options: string[]               // the choices to show
  value: string                   // the one currently selected
  onChange: (v: string) => void   // called with the new choice
}

export default function ChipGroup({ options, value, onChange }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-2 w-full">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`px-2 py-2 text-[10px] cursor-pointer ${
            value === o ? 'bg-pink-500 text-white' : 'bg-[#3b2470] text-[#fff1dc]'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}