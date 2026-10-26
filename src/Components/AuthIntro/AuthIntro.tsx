

export default function AuthIntro() {
  return (
    <>
        <section className="order-2 w-full max-w-xl text-center lg:order-1 lg:text-left">
            <h1 className="hidden text-5xl font-extrabold tracking-tight text-primary sm:text-6xl lg:block">
              Route Posts
            </h1>
            <p className="hidden mt-4 text-2xl font-medium leading-snug text-slate-800 lg:block">
              Connect with friends and the world around you on Route Posts.
            </p>
            <div className="mt-6 rounded-2xl border border-[#c9d5ff] bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary">
                About Route Academy
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                Egypt's Leading IT Training Center Since 2012
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Route Academy is the premier IT training center in Egypt,
                established in 2012. We specialize in delivering high-quality
                training courses in programming, web development, and
                application development. We've identified the unique challenges
                people may face when learning new technology and made efforts to
                provide strategies to overcome them.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                  <p className="text-base font-extrabold text-primary">2012</p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                    Founded
                  </p>
                </div>
                <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                  <p className="text-base font-extrabold text-primary">40K+</p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                    Graduates
                  </p>
                </div>
                <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                  <p className="text-base font-extrabold text-primary">50+</p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                    Partner Companies
                  </p>
                </div>
                <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                  <p className="text-base font-extrabold text-primary">5</p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                    Branches
                  </p>
                </div>
                <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                  <p className="text-base font-extrabold text-primary">20</p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                    Diplomas Available
                  </p>
                </div>
              </div>
            </div>
          </section>
    </>
  )
}
