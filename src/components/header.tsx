interface HeaderProps {
  lable: string;
  position?: string;
}

export const Header = ({ lable, position = "start" }: HeaderProps) => {
  return (
    <div className={`flex flex-col justify-start items-${position}`}>
      <span className="text-[#101828] text-[22px]">{lable}</span>
    </div>
  );
};
