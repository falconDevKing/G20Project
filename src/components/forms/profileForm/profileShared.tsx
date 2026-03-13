type ProfileInfoItemProps = {
  label: string;
  value: string | number;
  className?: string;
};

export const sectionCardClass =
  "rounded-[1.5rem] border border-[#d7c8a3]/45 bg-white/80 p-5 shadow-[0_18px_45px_rgba(17,28,48,0.05)] backdrop-blur-sm dark:border-[#6b86b8]/35 dark:bg-[linear-gradient(145deg,rgba(37,54,86,0.92),rgba(50,69,108,0.88))]";

export const detailFieldClass =
  "rounded-2xl border border-[#efe4c7] bg-[#fffdfa] px-4 py-3 dark:border-[#88a2d0]/25 dark:bg-[linear-gradient(145deg,rgba(58,77,118,0.72),rgba(69,92,137,0.64))]";

export const ProfileInfoItem = ({ label, value, className = "" }: ProfileInfoItemProps) => (
  <div className={`${detailFieldClass} ${className}`}>
    <p className="text-[11px] uppercase tracking-[0.24em] text-[#8c7a58] dark:text-[#c8d7f1]">{label}</p>
    <p className="mt-2 text-sm font-medium text-GGP-dark dark:text-white">{value || "Not provided"}</p>
  </div>
);
