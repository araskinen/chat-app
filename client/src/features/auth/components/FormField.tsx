interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

export const FormField = ({ label, value, onChange, type = "text" }: Props) => (
  <div className="flex flex-col gap-1">
    <label className="text-2xs font-medium text-subtle">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="px-3 py-2.5 rounded-lg border border-dim text-sm"
    />
  </div>
);
