import { cn } from "@/lib/utils";

const SectionShell = ({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section id={id} className={cn("relative py-16 sm:py-12 px-6 sm:px-16 lg:px-24", className)}>
    <div className="mx-auto w-full  px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        {eyebrow ? <p className="text-xs font-semibold tracking-[0.22em] text-[#d4b062] uppercase">{eyebrow}</p> : null}
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#f8f1e3] sm:text-4xl">{title}</h2>
        {subtitle ? <p className="mt-4 text-sm leading-7 text-[#c8d3e9] sm:text-base">{subtitle}</p> : null}
      </div>

      <div className="mt-10">{children}</div>
    </div>
  </section>
);

export default SectionShell;
