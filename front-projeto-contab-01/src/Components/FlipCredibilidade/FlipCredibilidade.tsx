import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export function FlipCredibilidade() {
  const textos = [
    '+300 clientes satisfeitos',
    '+100 parceiros',
    '+1M faturados',
  ]
  const cuboRef = useRef(null)
  let rotacaoAtual = 0

  useEffect(() => {
    // gira −120° a cada 3s
    const id = setInterval(() => {
      rotacaoAtual -= 120
      gsap.to(cuboRef.current, {
        rotationX: rotacaoAtual,
        duration: 0.8,
        ease: 'power2.inOut',
      })
    }, 4000)
    return () => clearInterval(id)
  }, [])

  // calcule translateZ = metade da altura do box
  // se h-40 (10rem = 160px), fica 80px
  const depth = 60

  return (
    <div
      style={{ perspective: 800 }}
      className="w-60 h-30 mx-auto"
    >
      <div
        ref={cuboRef}
        className="w-full h-full relative"
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
        }}
      >
        {textos.map((t, i) => (
          <div
            key={i}
            className="absolute inset-0 flex items-center text-white text-3xl font rounded-md border-solid border-2 border-fundoCinzaEscuro bg-fundoPreto px-4 py-2"
            style={{
              transform: `rotateX(${i * 120}deg) translateZ(${depth}px)`,
              backfaceVisibility: 'hidden',
            }}
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  )
}