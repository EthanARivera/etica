import { useRef, useState, type PointerEvent } from 'react'
import { jsPDF } from 'jspdf'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clock3,
  Code2,
  Eye,
  Heart,
  Leaf,
  LockKeyhole,
  Menu,
  Scale,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'

type Principle = {
  number: string
  title: string
  text: string
  icon: typeof LockKeyhole
  color: string
  details: string[]
}

const principles: Principle[] = [
  {
    number: '01',
    title: 'Diseñamos para la autonomía',
    text: 'La tecnología debe ampliar tus decisiones, nunca tomarlas por ti.',
    icon: LockKeyhole,
    color: 'coral',
    details: ['Sin patrones oscuros ni consentimientos confusos.', 'Siempre podrás exportar tus datos.', 'Explicamos el porqué de cada decisión automatizada.'],
  },
  {
    number: '02',
    title: 'La privacidad no es un extra',
    text: 'Tratamos tus datos como trataríamos los nuestros: con respeto, límites y propósito.',
    icon: Eye,
    color: 'lavender',
    details: ['Recogemos solo lo estrictamente necesario.', 'Cifrado por defecto, no como una promesa.', 'Borrado sencillo y verificable cuando lo pidas.'],
  },
  {
    number: '03',
    title: 'El futuro también cuenta',
    text: 'Cada línea de código tiene un costo. Medimos nuestro impacto para reducirlo.',
    icon: Leaf,
    color: 'yellow',
    details: ['Optimizamos antes de escalar infraestructura.', 'Reportamos nuestra huella digital anualmente.', 'Reutilizamos, reparamos y alargamos la vida de los equipos.'],
  },
]

const crisisSteps = [
  { title: 'Detectar', text: 'Cualquier persona puede reportar un riesgo, sin jerarquías ni fricción.', detail: 'Escuchamos cada señal, documentamos lo ocurrido y evaluamos su impacto en las personas, el producto y el entorno.', icon: CircleAlert },
  { title: 'Contener', text: 'Pausamos la funcionalidad afectada y protegemos a las personas primero.', detail: 'Reducimos el alcance del problema, protegemos los datos involucrados y detenemos cualquier proceso que pueda causar más daño.', icon: ShieldCheck },
  { title: 'Comunicar', text: 'Informamos con claridad qué pasó, a quién afecta y qué estamos haciendo.', detail: 'Compartimos información verificable con las personas afectadas, sin ocultar incertidumbres ni esperar a tener una respuesta perfecta.', icon: Zap },
  { title: 'Reparar', text: 'Corregimos, auditamos y compartimos lo aprendido para no repetirlo.', detail: 'Implementamos la solución, revisamos nuestras decisiones y convertimos lo aprendido en cambios concretos y comprobables.', icon: Scale },
]

function App() {
  const [activePrinciple, setActivePrinciple] = useState<Principle | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [crisisStage, setCrisisStage] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [userName, setUserName] = useState('')
  const [promiseError, setPromiseError] = useState('')
  const swipeStartX = useRef<number | null>(null)

  const moveCrisisStage = (direction: number) => {
    setCrisisStage((stage) => (stage + direction + 5) % 5)
  }

  const handleSwipeStart = (event: PointerEvent<HTMLDivElement>) => {
    swipeStartX.current = event.clientX
  }

  const handleSwipeEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (swipeStartX.current === null) return
    const distance = event.clientX - swipeStartX.current
    if (Math.abs(distance) > 50) moveCrisisStage(distance < 0 ? 1 : -1)
    swipeStartX.current = null
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const generatePromisePdf = () => {
    const name = userName.trim()
    if (!name) {
      setPromiseError('Escribe tu nombre para personalizar el contrato.')
      return
    }

    setPromiseError('')
    const document = new jsPDF()
    const pageWidth = document.internal.pageSize.getWidth()
    const margin = 22
    let y = 28

    document.setProperties({ title: 'Contrato LUMINA de responsabilidad y autonomía', author: 'LUMINA' })
    document.setFillColor(25, 26, 25)
    document.rect(0, 0, pageWidth, 14, 'F')
    document.setTextColor(25, 26, 25)
    document.setFont('helvetica', 'bold')
    document.setFontSize(22)
    document.text('CONTRATO LUMINA', margin, y)
    y += 9
    document.setFont('helvetica', 'normal')
    document.setFontSize(10)
    document.setTextColor(90, 90, 90)
    document.text('Compromiso de responsabilidad con las personas usuarias · Versión 1.0', margin, y)
    y += 15
    document.setTextColor(25, 26, 25)

    const addParagraph = (text: string, size = 11) => {
      document.setFont('helvetica', 'normal')
      document.setFontSize(size)
      const lines = document.splitTextToSize(text, pageWidth - margin * 2)
      if (y + lines.length * 6 > 265) {
        document.addPage()
        y = 24
      }
      document.text(lines, margin, y)
      y += lines.length * 6 + 5
    }

    const addSection = (title: string, text: string) => {
      document.setFont('helvetica', 'bold')
      document.setFontSize(13)
      document.setTextColor(255, 96, 77)
      document.text(title, margin, y)
      y += 7
      document.setTextColor(25, 26, 25)
      addParagraph(text)
    }

    addParagraph(`LUMINA se compromete con ${name} a diseñar y operar productos digitales que respeten su autonomía, su dinero y su salud mental. Este documento expresa nuestra responsabilidad en lenguaje claro y sirve como constancia de esta promesa.`, 12)
    addSection('1. Tu autonomía', 'LUMINA no usará patrones oscuros, manipulación ni decisiones automatizadas opacas para limitar tus opciones. Te explicaremos las decisiones relevantes, podrás revisar tus preferencias y conservarás el control sobre tus datos y sobre la forma en que utilizas nuestros servicios.')
    addSection('2. Tu dinero', 'Presentaremos precios, condiciones y cobros de manera clara antes de que tomes una decisión. No incluiremos cargos sorpresa, renovaciones confusas ni obstáculos intencionales para cancelar. Si detectamos un error de cobro, lo comunicaremos y trabajaremos para corregirlo de forma oportuna.')
    addSection('3. Tu salud mental', 'Diseñaremos experiencias que respeten tus límites y tu tiempo. No trataremos tu atención como un recurso ilimitado ni promoveremos hábitos dañinos mediante presión, culpa o notificaciones innecesarias. Priorizaremos opciones que permitan pausar, desconectarse y pedir ayuda cuando corresponda.')
    addSection('Si fallamos', 'Te informaremos primero qué ocurrió, a quién afecta y qué haremos para repararlo. Investigaremos la causa, corregiremos el problema y compartiremos lo aprendido para reducir la posibilidad de repetirlo. La confianza se construye con transparencia, especialmente cuando algo sale mal.')

    y += 3
    document.setDrawColor(255, 96, 77)
    document.line(margin, y, pageWidth - margin, y)
    y += 10
    document.setFont('helvetica', 'bold')
    document.setFontSize(11)
    document.text(`Compromiso con: ${name}`, margin, y)
    y += 7
    document.setFont('helvetica', 'normal')
    document.text(`Fecha: ${new Date().toLocaleDateString('es-MX')}`, margin, y)
    y += 17
    document.text('LUMINA · Agencia digital con conciencia', margin, y)
    document.save(`contrato-lumina-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`)

    setShowToast(true)
    window.setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f2eb] text-[#191a19]">
      <header className="fixed top-0 z-40 w-full border-b border-[#191a19]/10 bg-[#f5f2eb]/90 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-6 lg:px-10">
          <button onClick={() => scrollTo('inicio')} className="group flex items-center gap-3" aria-label="Ir al inicio">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#191a19] text-[#f5f2eb] transition-transform group-hover:rotate-12">
              <Sparkles size={17} />
            </span>
            <span className="font-display text-xl font-bold tracking-[-0.06em]">LUMINA<span className="text-[#ff604d]">®</span></span>
          </button>
          <nav className="hidden items-center gap-2 rounded-full border border-[#191a19]/10 bg-white/30 p-1.5 text-[10px] font-bold uppercase tracking-[0.16em] md:flex">
            <button onClick={() => scrollTo('filosofia')} className="nav-link rounded-full px-3 py-2">Filosofía</button>
            <button onClick={() => scrollTo('codigo')} className="nav-link rounded-full px-3 py-2">Código LSC</button>
            <button onClick={() => scrollTo('promesa')} className="nav-link rounded-full px-3 py-2">Promesa</button>
            <button onClick={() => scrollTo('crisis')} className="nav-link rounded-full px-3 py-2">Crisis</button>
          </nav>
          <button onClick={() => scrollTo('promesa')} className="hidden rounded-full bg-[#ff604d] px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-white transition hover:bg-[#e64d3c] md:block">
            Conócenos <ArrowUpRight className="ml-1 inline" size={14} />
          </button>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && <div className="border-t border-[#191a19]/10 bg-[#f5f2eb] px-6 py-5 md:hidden">
          {['filosofia', 'codigo', 'promesa', 'crisis'].map((item) => <button key={item} onClick={() => scrollTo(item)} className="block w-full py-3 text-left text-xs font-bold uppercase tracking-widest">{item === 'codigo' ? 'Código LSC' : item}</button>)}
        </div>}
      </header>

      <main>
        <section id="inicio" className="relative mx-auto flex min-h-[720px] max-w-[1240px] items-center px-6 pb-20 pt-36 lg:px-10">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#191a19]/20 bg-white/25 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff604d]" /> Manifiesto de identidad profesional · Edición 01
            </div>
            <h1 className="font-display max-w-4xl text-[clamp(4rem,10vw,8.7rem)] font-bold leading-[0.82] tracking-[-0.085em]">
              Tecnología<br /><span className="text-[#ff604d]">con</span> criterio<span className="text-[#ff604d]">.</span>
            </h1>
            <p className="mt-10 max-w-md text-lg leading-relaxed text-[#191a19]/70">Somos LUMINA, una agencia digital que cree que el software no solo debe funcionar. <strong className="font-semibold text-[#191a19]">Debe hacer bien.</strong></p>
            <button onClick={() => scrollTo('filosofia')} className="mt-9 flex items-center gap-3 rounded-full bg-[#191a19] px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:-translate-y-1">
              Explorar nuestro manifiesto <ArrowDown size={16} />
            </button>
          </div>
          <div className="absolute bottom-8 left-6 hidden items-center gap-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#191a19]/45 lg:flex">
            <span className="font-mono">LSC / 001</span><span className="h-px w-8 bg-[#191a19]/25" /><span>Ética aplicada al software</span>
          </div>
          <div className="hero-orbit absolute right-8 top-44 hidden w-[390px] rounded-[2rem] bg-[#191a19] p-7 text-white shadow-2xl shadow-[#191a19]/20 lg:block xl:right-16">
            <div className="flex items-start justify-between border-b border-white/15 pb-6">
              <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#f2d879]">LUMINA / ESTADO</p><p className="mt-3 font-display text-2xl font-bold tracking-tight">Ética en práctica</p></div>
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 font-mono text-[10px] text-[#f2d879]"><span className="h-1.5 w-1.5 rounded-full bg-[#f2d879]" /> ACTIVO</span>
            </div>
            <div className="grid grid-cols-2 gap-3 py-6">
              <div className="rounded-2xl bg-white/10 p-4"><p className="font-mono text-[10px] text-white/45">DECISIONES</p><p className="mt-3 font-display text-3xl font-bold">100<span className="text-[#ff604d]">%</span></p><p className="mt-1 text-[11px] text-white/50">explicables</p></div>
              <div className="rounded-2xl bg-[#ff604d] p-4"><p className="font-mono text-[10px] text-white/70">CONFIANZA</p><p className="mt-3 font-display text-3xl font-bold">∞</p><p className="mt-1 text-[11px] text-white/75">se construye</p></div>
            </div>
            <div className="flex items-center justify-between border-t border-white/15 pt-5"><div className="flex -space-x-2"><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#191a19] bg-[#d7d0f4] text-xs text-[#191a19]">A</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#191a19] bg-[#f2d879] text-xs text-[#191a19]">B</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#191a19] bg-[#ffb8a9] text-xs text-[#191a19]">C</span></div><span className="font-mono text-[10px] uppercase tracking-widest text-white/45">equipo con criterio</span></div>
          </div>
          <div className="absolute bottom-8 right-10 hidden items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#191a19]/50 lg:flex">
            <span className="h-px w-12 bg-[#191a19]/30" /> Desliza para descubrir
          </div>
        </section>

        <section id="filosofia" className="bg-[#191a19] py-28 text-[#f5f2eb]">
          <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
            <div className="grid gap-16 md:grid-cols-[1fr_1.3fr] md:items-end">
              <div><p className="section-label text-[#ff604d]">01 — Nuestra filosofía</p><h2 className="mt-5 max-w-md font-display text-5xl font-bold leading-[0.95] tracking-[-0.06em] md:text-7xl">Hacer más.<br /><span className="text-[#d7d0f4]">Hacerlo bien.</span></h2></div>
              <div><p className="max-w-xl text-xl leading-relaxed text-white/70">Para nosotros, el éxito no se mide solo en usuarios activos o ingresos. Se mide en la confianza que construimos, en el daño que evitamos y en el valor real que dejamos.</p><div className="mt-9 grid grid-cols-2 gap-8 border-t border-white/20 pt-6"><div><p className="font-display text-4xl font-bold text-[#f2d879]">0</p><p className="mt-2 text-xs uppercase tracking-widest text-white/50">patrones oscuros</p></div><div><p className="font-display text-4xl font-bold text-[#f2d879]">100%</p><p className="mt-2 text-xs uppercase tracking-widest text-white/50">transparencia</p></div></div></div>
            </div>
          </div>
        </section>

        <section id="codigo" className="mx-auto max-w-[1240px] px-6 py-28 lg:px-10">
          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="section-label text-[#ff604d]">02 — El código LSC moderno</p><h2 className="mt-5 font-display text-5xl font-bold leading-none tracking-[-0.06em] md:text-7xl">Tres reglas.<br />Cero excusas.</h2></div><p className="max-w-xs text-sm leading-relaxed text-[#191a19]/60">Los principios no son un póster en la pared. Son criterios para tomar decisiones difíciles.<span className="mt-4 block font-mono text-[10px] uppercase tracking-widest text-[#191a19]/40">Haz clic para explorar</span></p></div>
          <div className="grid gap-5 md:grid-cols-3">
            {principles.map((principle) => {
              const Icon = principle.icon
              const backgroundClass = principle.color === 'coral' ? 'bg-coral' : principle.color === 'lavender' ? 'bg-lavender' : 'bg-yellow'
              return <button key={principle.number} onClick={() => setActivePrinciple(principle)} className={`principle-card group ${backgroundClass} text-left`}>
                <div className="flex items-start justify-between"><span className="font-display text-5xl font-bold tracking-[-0.08em]">{principle.number}</span><Icon size={28} strokeWidth={1.5} className="transition-transform group-hover:rotate-12" /></div>
                <div className="mt-20"><h3 className="max-w-xs font-display text-3xl font-bold leading-none tracking-[-0.05em]">{principle.title}</h3><p className="mt-4 max-w-xs text-sm leading-relaxed text-[#191a19]/70">{principle.text}</p><span className="mt-7 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest underline-offset-4 group-hover:underline">Leer el principio <ArrowRight size={14} /></span></div>
              </button>
            })}
          </div>
        </section>

        <section id="promesa" className="bg-[#d7d0f4] py-28">
          <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
            <div className="grid gap-14 md:grid-cols-[0.8fr_1.2fr] md:items-center">
              <div><p className="section-label">03 — La promesa al usuario</p><h2 className="mt-5 font-display text-5xl font-bold leading-[0.9] tracking-[-0.07em] md:text-7xl">Tú tienes<br />el control<span className="text-[#ff604d]">.</span></h2><p className="mt-7 max-w-sm leading-relaxed text-[#191a19]/70">Un contrato no tiene que ser aburrido. Esta es nuestra promesa, en lenguaje humano.</p><label className="mt-7 block max-w-sm text-xs font-bold uppercase tracking-widest" htmlFor="promise-name">Tu nombre<input id="promise-name" value={userName} onChange={(event) => { setUserName(event.target.value); setPromiseError('') }} placeholder="Escribe tu nombre" className="mt-2 w-full rounded-xl border border-[#191a19]/20 bg-white/50 px-4 py-3 text-sm font-normal normal-case tracking-normal outline-none transition focus:border-[#ff604d]" /></label>{promiseError && <p className="mt-2 max-w-sm text-xs font-semibold text-[#d94332]" role="alert">{promiseError}</p>}<button onClick={generatePromisePdf} className="mt-5 rounded-full border border-[#191a19] px-5 py-3 text-xs font-bold uppercase tracking-widest transition hover:bg-[#191a19] hover:text-white">Guardar mi promesa <ArrowUpRight className="ml-1 inline" size={14} /></button></div>
              <div className="rounded-[2rem] bg-[#f5f2eb] p-7 shadow-xl shadow-[#191a19]/10 md:p-10">
                <div className="flex items-center justify-between border-b border-[#191a19]/15 pb-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#191a19] text-white"><ShieldCheck size={19} /></span><div><p className="font-bold">Contrato LUMINA</p><p className="text-xs text-[#191a19]/50">Versión 1.0 · Siempre vigente</p></div></div><Check className="text-[#ff604d]" /></div>
                <div className="space-y-7 pt-7">
                  {[['Tu autonomía', 'Nunca usaremos tu atención en tu contra.', 'LockKeyhole'], ['Tu dinero', 'Precios claros. Sin trampas. Sin cobros sorpresa.', 'Scale'], ['Tu salud mental', 'Diseñamos experiencias que respetan tus límites.', 'Heart']].map(([title, text, icon]) => {
                    const Icon = icon === 'LockKeyhole' ? LockKeyhole : icon === 'Scale' ? Scale : Heart
                    return <div key={title} className="flex gap-4"><span className="mt-1 text-[#ff604d]"><Icon size={21} strokeWidth={1.7} /></span><div><p className="font-display text-xl font-bold tracking-tight">{title}</p><p className="mt-1 text-sm text-[#191a19]/60">{text}</p></div></div>
                  })}
                </div>
                <div className="mt-8 rounded-xl bg-[#f2d879]/35 p-4 text-xs leading-relaxed"><strong>Si fallamos,</strong> te lo diremos primero. La confianza se construye con transparencia, especialmente cuando algo sale mal.</div>
              </div>
            </div>
          </div>
        </section>

        <section id="crisis" className="mx-auto max-w-[1240px] px-6 py-36 lg:px-10">
          <div className="md:sticky md:top-24 md:z-20 md:bg-[#f5f2eb] md:pb-10">
            <div className="max-w-4xl">
              <p className="section-label text-[#ff604d]">04 — Plan de acción</p>
              <h2 className="mt-5 font-display text-5xl font-bold leading-[0.9] tracking-[-0.07em] md:text-8xl">Cuando algo<br /><span className="text-[#ff604d]">sale mal.</span></h2>
              <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
                <p className="max-w-2xl text-lg leading-relaxed text-[#191a19]/65">La ética se prueba en una crisis. Ante una vulnerabilidad crítica o un daño ambiental, respondemos con un proceso visible, humano y orientado a reparar el impacto.</p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><Clock3 size={15} /> Tiempo de respuesta: 24h</div>
              </div>
              <div className="mt-8 max-w-2xl rounded-2xl border border-dashed border-[#ff604d] bg-[#ff604d]/5 p-5 text-sm leading-relaxed"><span className="font-bold text-[#ff604d]">Nuestro estándar:</span> nunca ocultamos un incidente para proteger una métrica.</div>
            </div>
          </div>
          <div className="mt-10 md:mt-16">
            <div
              className="relative mx-auto max-w-5xl select-none touch-pan-y"
              onPointerDown={handleSwipeStart}
              onPointerUp={handleSwipeEnd}
              onPointerCancel={() => { swipeStartX.current = null }}
            >
              <button onClick={() => moveCrisisStage(-1)} className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-[#f5f2eb] shadow-lg transition hover:bg-[#ff604d] hover:text-white" aria-label="Etapa anterior"><ChevronLeft size={20} /></button>
              <button onClick={() => moveCrisisStage(1)} className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-[#f5f2eb] shadow-lg transition hover:bg-[#ff604d] hover:text-white" aria-label="Siguiente etapa"><ChevronRight size={20} /></button>
              <div className="h-[560px] overflow-y-auto rounded-[2rem] bg-[#191a19] px-8 py-12 text-white shadow-xl md:h-[480px] md:px-24">
                {crisisStage === 0 ? <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#f2d879]">Vista general</p>
                  <h3 className="mt-4 font-display text-4xl font-bold tracking-[-0.05em] md:text-6xl">Una respuesta en cuatro movimientos.</h3>
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65">Cuando algo sale mal, avanzamos de forma ordenada para proteger a las personas, comunicar con honestidad y reparar el impacto.</p>
                  <div className="mt-9 grid gap-3 sm:grid-cols-4">{crisisSteps.map((step, index) => <button key={step.title} onClick={() => setCrisisStage(index + 1)} className="rounded-2xl border border-white/15 p-4 text-left transition hover:border-[#ff604d] hover:bg-white/10"><span className="font-mono text-xs text-[#ff604d]">0{index + 1}</span><span className="mt-3 block font-display text-lg font-bold">{step.title}</span></button>)}</div>
                </div> : (() => {
                  const step = crisisSteps[crisisStage - 1]
                  const Icon = step.icon
                  return <div className="flex min-h-[230px] items-start gap-5">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#ff604d] text-white"><Icon size={24} /></span>
                    <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#f2d879]">Etapa 0{crisisStage} de 04</p><h3 className="mt-4 font-display text-4xl font-bold tracking-[-0.05em] md:text-6xl">{step.title}</h3><p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">{step.text}</p><p className="mt-7 max-w-2xl border-t border-white/15 pt-5 leading-relaxed text-white/85">{step.detail}</p></div>
                  </div>
                })()}
              </div>
              <div className="mt-7 flex justify-center gap-2">{Array.from({ length: 5 }, (_, index) => <button key={index} onClick={() => setCrisisStage(index)} className={`h-2.5 rounded-full transition-all ${crisisStage === index ? 'w-8 bg-[#ff604d]' : 'w-2.5 bg-[#191a19]/25 hover:bg-[#ff604d]/60'}`} aria-label={`Ir a la etapa ${index + 1}`} />)}</div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-[#191a19]/10 bg-[#f2d879] py-24">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#191a19]/10" />
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-[#191a19]/10" />
          <div className="mx-auto max-w-[1000px] px-6 text-center"><Code2 className="mx-auto mb-7" size={38} strokeWidth={1.2} /><h2 className="font-display text-5xl font-bold leading-[0.9] tracking-[-0.07em] md:text-8xl">El futuro es<br /><span className="text-[#ff604d]">una decisión.</span></h2><p className="mx-auto mt-8 max-w-lg text-lg text-[#191a19]/65">Y cada día elegimos construirlo con responsabilidad.</p><button onClick={() => scrollTo('inicio')} className="mt-9 rounded-full bg-[#191a19] px-6 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#ff604d]">Volver arriba <ArrowUpRight className="ml-1 inline" size={14} /></button></div>
        </section>
      </main>

      <footer className="bg-[#191a19] px-6 py-10 text-[#f5f2eb] lg:px-10"><div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-6 md:flex-row md:items-center"><div><p className="font-display text-2xl font-bold tracking-[-0.06em]">LUMINA<span className="text-[#ff604d]">®</span></p><p className="mt-2 text-xs text-white/40">Agencia digital con conciencia · Mexicali, Baja California, México / Remoto</p></div><div className="text-left md:text-right"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#f2d879]">Código LSC activo</p><p className="mt-2 text-xs text-white/40">Manifiesto creado con intención © 2026</p></div></div></footer>

      {activePrinciple && <div className="fixed inset-0 z-50 grid place-items-center bg-[#191a19]/60 p-5 backdrop-blur-sm" onClick={() => setActivePrinciple(null)}><div className="relative max-w-lg rounded-3xl bg-[#f5f2eb] p-8 shadow-2xl md:p-10" onClick={(event) => event.stopPropagation()}><button onClick={() => setActivePrinciple(null)} className="absolute right-6 top-6 rounded-full p-2 hover:bg-[#191a19]/10" aria-label="Cerrar"><X size={20} /></button><p className="section-label text-[#ff604d]">Principio {activePrinciple.number}</p><h3 className="mt-5 max-w-sm font-display text-4xl font-bold leading-none tracking-[-0.06em]">{activePrinciple.title}</h3><p className="mt-5 text-lg leading-relaxed text-[#191a19]/70">{activePrinciple.text}</p><ul className="mt-7 space-y-3 border-t border-[#191a19]/15 pt-6">{activePrinciple.details.map((detail) => <li key={detail} className="flex gap-3 text-sm"><Check className="shrink-0 text-[#ff604d]" size={17} />{detail}</li>)}</ul></div></div>}
      {showToast && <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-[#191a19] px-5 py-3 text-sm text-white shadow-xl"><Check size={16} className="text-[#f2d879]" /> Contrato descargado correctamente</div>}
    </div>
  )
}

export default App
