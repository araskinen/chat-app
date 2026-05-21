interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

export const FormField = ({ label, value, onChange, type = "text" }: Props) => (
  <div className="flex flex-col gap-1">
    <label className="text-[13px] font-medium text-[#555]">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="px-3 py-[0.6rem] rounded-lg border border-[#ddd] text-sm"
    />
  </div>
);
