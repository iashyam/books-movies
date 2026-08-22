interface StatusPillProps {
  status: string;
  label: string;
  color: {
    bg: string;
    text: string;
  };
}

export function StatusPill({ label, color }: StatusPillProps) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${color.bg} ${color.text}`}>
      {label}
    </span>
  );
}
