import Link from "next/link";

const grainSvg =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.09'/%3E%3C/svg%3E\")";

export default function Home() {
  return (
    <div className="font-landing-sans relative min-h-screen overflow-x-hidden bg-[#f2efe6] text-[#1a1814] selection:bg-[#c45c3e]/25 selection:text-[#1a1814] dark:bg-[#12110f] dark:text-[#ebe6dc] dark:selection:bg-[#d4a27f]/30 dark:selection:text-[#f2efe6]">
      {/* 背景层次：暖调网格 + 柔光 + 颗粒 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(196,92,62,0.06)_45%,transparent_70%)] dark:bg-[linear-gradient(135deg,transparent_0%,rgba(212,162,127,0.05)_50%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[size:24px_24px] opacity-[0.35] dark:opacity-[0.2] [background-image:linear-gradient(to_right,rgba(26,24,20,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,24,20,0.06)_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,rgba(235,230,220,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(235,230,220,0.05)_1px,transparent_1px)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-1/4 top-1/4 h-[min(520px,55vh)] w-[min(520px,90vw)] rounded-full bg-[radial-gradient(circle_at_center,rgba(196,92,62,0.14),transparent_68%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(212,162,127,0.12),transparent_68%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55] mix-blend-multiply dark:opacity-[0.35] dark:mix-blend-soft-light"
        style={{ backgroundImage: grainSvg }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-16 pt-10 sm:px-10 lg:px-14">
        <header className="animate-landing-in mb-16 flex items-baseline justify-between gap-6 border-b border-[#1a1814]/10 pb-6 dark:border-[#ebe6dc]/12 [animation-delay:0ms]">
          <div className="flex flex-col gap-1">
            <span className="font-landing-serif text-lg font-semibold tracking-[0.02em] sm:text-xl">
              墨笺
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.28em] text-[#5c574e] dark:text-[#9a9488]">
              notes · 本地优先的教学演示
            </span>
          </div>
          <div className="hidden text-right text-sm text-[#5c574e] dark:text-[#9a9488] sm:block">
            模块一
            <span className="mx-2 text-[#1a1814]/25 dark:text-[#ebe6dc]/20">
              /
            </span>
            身份与访问
          </div>
        </header>

        <main className="grid flex-1 gap-12 lg:grid-cols-12 lg:gap-10 lg:items-start">
          <section className="animate-landing-in lg:col-span-7 [animation-delay:90ms]">
            <p className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#6b655a] dark:text-[#a39e92]">
              <span
                aria-hidden
                className="inline-block h-px w-10 bg-[#c45c3e] dark:bg-[#d4a27f]"
              />
              写下来的想法，才站得住脚
            </p>
            <h1 className="font-landing-serif text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-[#14120f] dark:text-[#f5f1e8]">
              把零碎灵感
              <br />
              <span className="text-[#8b3a2b] dark:text-[#d4a27f]">
                收成可检索的笔记
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-[1.05rem] leading-[1.75] text-[#3d3a34] dark:text-[#c9c2b4]">
              注册与登录由 Supabase 托管；受保护页面在服务端校验会话。开始前请在{" "}
              <code className="rounded border border-[#1a1814]/12 bg-[#e8e3d8] px-1.5 py-0.5 font-mono text-[0.9em] text-[#1a1814] dark:border-[#ebe6dc]/15 dark:bg-[#1e1c19] dark:text-[#ebe6dc]">
                .env.local
              </code>{" "}
              填入项目 URL 与 anon key。
            </p>
          </section>

          <aside className="animate-landing-in relative lg:col-span-5 [animation-delay:180ms]">
            <div
              aria-hidden
              className="absolute -right-4 -top-4 hidden h-24 w-24 rounded-full border border-[#c45c3e]/25 dark:border-[#d4a27f]/20 lg:block"
            />
            <div className="relative border border-[#1a1814]/12 bg-[#faf8f3]/90 p-8 shadow-[8px_8px_0_0_rgba(26,24,20,0.06)] backdrop-blur-sm dark:border-[#ebe6dc]/10 dark:bg-[#1a1819]/85 dark:shadow-[8px_8px_0_0_rgba(0,0,0,0.35)]">
              <div className="mb-6 font-landing-serif text-xl font-semibold text-[#14120f] dark:text-[#f5f1e8]">
                从这里开始
              </div>
              <p className="mb-8 text-sm leading-relaxed text-[#5c574e] dark:text-[#a39e92]">
                新用户先建立账户；已有账户直接登录。笔记页需要有效会话。
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/register"
                  className="group flex items-center justify-center border-2 border-[#8b3a2b] bg-[#8b3a2b] px-5 py-3.5 text-center text-sm font-semibold text-[#faf8f3] transition hover:bg-[#7a3326] dark:border-[#c17d5a] dark:bg-[#c17d5a] dark:text-[#1a1810] dark:hover:bg-[#b06f4f]"
                >
                  注册账户
                  <span className="ml-2 inline-block transition group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
                <Link
                  href="/login"
                  className="border-2 border-[#1a1814]/18 bg-transparent px-5 py-3.5 text-center text-sm font-semibold text-[#1a1814] transition hover:border-[#1a1814]/35 hover:bg-[#1a1814]/[0.03] dark:border-[#ebe6dc]/22 dark:text-[#ebe6dc] dark:hover:border-[#ebe6dc]/40 dark:hover:bg-[#ebe6dc]/[0.04]"
                >
                  登录
                </Link>
                <Link
                  href="/notes"
                  className="text-center text-sm font-medium text-[#6b655a] underline decoration-[#6b655a]/35 underline-offset-4 transition hover:text-[#1a1814] hover:decoration-[#1a1814]/45 dark:text-[#9a9488] dark:decoration-[#9a9488]/35 dark:hover:text-[#ebe6dc]"
                >
                  进入笔记（需登录）
                </Link>
              </div>
            </div>
          </aside>
        </main>

        <footer className="animate-landing-in mt-20 border-t border-[#1a1814]/10 pt-8 text-xs leading-relaxed text-[#7a7468] dark:border-[#ebe6dc]/10 dark:text-[#8a8478] [animation-delay:260ms]">
          <p>
            界面为课程演示用途；生产环境请补充速率限制、邮件验证与审计日志等策略。
          </p>
        </footer>
      </div>
    </div>
  );
}
