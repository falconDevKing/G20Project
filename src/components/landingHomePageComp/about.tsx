import { ContainerFluid } from "../containerFluid";
import ProphetImage from "../../assets/prophet.png";

export const About = () => {
  return (
    <section id="about" className="mt-4 bg-[#121212] h-full">
      <div className="text-white py-40 pb-4 md:py-32">
        <ContainerFluid className=" max-w-[1300px] mx-auto px-4 md:px-0">
          <div className=" grid grid-cols-1 lg:grid-cols-2 md:p-3 md:gap-9 items-center space-y-8 md:space-y-0">
            <div className="">
              <img src={ProphetImage} className=" w-full rounded-xl md:rounded-[20px]" alt="ProphetImage" />
            </div>
            <div className=" flex flex-col space-y-4 md:space-y-10">
              <h1 className=" text-2xl md:text-5xl font-bold text-GGP-darkGold">YOU’RE WELCOME!</h1>
              <div className=" leading-loose text-lg font-light tracking-normal">
                On behalf of the Prophet, we welcome all partners to this community in the name of Jesus, and we thank you for being a partner with the Prophet.
                Because you are signed up for partnership, you will be receiving this communication from the prophet's office regularly as his way of staying in
                touch with you.
                <br />
                <div className="py-4">As we begin again, it is important we review what this relationship is about.</div>
              </div>
            </div>
          </div>
        </ContainerFluid>
      </div>
    </section>
  );
};
