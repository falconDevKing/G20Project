import HandshakePicture from "@/assets/generalAppAssets/shake.png";

const Banner = () => {
  return (
    <div>
      {/* BIG CTA RIBBON (like your gold banner section) */}
      <section className="relative py-10 sm:py-14">
        <div className="mx-auto  px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gold-500">
            <div className="absolute inset-0 opacity-15">
              <img src={HandshakePicture} alt="" className="h-full w-full object-cover" />
            </div>

            <div className="relative px-6 py-12 text-center sm:px-10">
              <p className="text-sm font-semibold tracking-[0.22em] uppercase text-black/70">G20 Partnership</p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-black sm:text-4xl">Your support is bringing purpose to countless lives.</h3>
              <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-black/80 sm:text-base">
                Through your generosity and commitment, you are helping advance the Gospel across nations and transform lives.
              </p>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full bg-black px-7 py-3 text-sm font-semibold text-white hover:bg-black/90"
                >
                  Login to Dashboard
                </a>
                <a
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-black hover:bg-white/90"
                >
                  Sign up
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Banner;
