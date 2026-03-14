import HandshakePicture from "@/assets/generalAppAssets/shake.png";
import { OfflineBankDetails } from "./offlinePaymentDetails";

const Banner = () => {
  return (
    <section className="relative bg-[#0a1220] px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[#6b5322] bg-[#c39a41]">
          <div className="absolute inset-0 opacity-10">
            <img src={HandshakePicture} alt="" className="h-full w-full object-cover" />
          </div>

          <div className="relative px-5 py-10 text-center sm:px-8 sm:py-12 lg:px-10">
            <p className="text-sm font-semibold tracking-[0.22em] uppercase text-[#2a210f]">G20 Partnership</p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#1e170a] sm:text-3xl lg:text-4xl">Your support is bringing purpose to countless lives.</h3>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[#2a210f] sm:text-base">
              Through your generosity and commitment, you are helping advance the Gospel across nations and transform lives.
            </p>

            <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <a
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-full border border-[#1e170a] bg-[#1e170a] px-7 py-3 text-sm font-semibold text-white hover:bg-[#2a210f] sm:w-auto"
              >
                Login to Dashboard
              </a>
              <a
                href="/paymentButton"
                className="inline-flex w-full items-center justify-center rounded-full border border-[#f8f1e3] bg-[#f8f1e3] px-7 py-3 text-sm font-semibold text-[#1e170a] hover:bg-[#fffaf0] sm:w-auto"
              >
                Give Now
              </a>
              <OfflineBankDetails fullWidthOnMobile />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
