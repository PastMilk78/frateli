import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Star, ChevronDown, ShoppingCart, X, Plus, Minus } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

// Simulación de datos del catálogo
const catalogo = [
  { id: 1, nombre: 'Collar de perlas', categoria: 'Joyería Dama', subcategoria: 'Gargantillas', precio: 1500, existencias: 5, calificacion: 4.5, imagen: '/placeholder.svg', metal: 'Plata', piedras: ['Perla'], isNew: true },
  { id: 2, nombre: 'Anillo de diamantes', categoria: 'Joyería Dama', subcategoria: 'Anillos', precio: 5000, existencias: 3, calificacion: 5, imagen: '/placeholder.svg', metal: 'Oro', kilataje: 14, piedras: ['Diamante'] },
  { id: 3, nombre: 'Pulsera de oro', categoria: 'Joyería Caballero', subcategoria: 'Pulseras y Esclavas', precio: 3000, existencias: 7, calificacion: 4, imagen: '/placeholder.svg', metal: 'Oro', kilataje: 18, piedras: [], isNew: true },
  { id: 4, nombre: 'Aretes de plata', categoria: 'Joyería Dama', subcategoria: 'Aretes', precio: 800, existencias: 10, calificacion: 3.5, imagen: '/placeholder.svg', metal: 'Plata', piedras: ['Zafiro'] },
  { id: 5, nombre: 'Medalla religiosa', categoria: 'Joyería Religiosa', subcategoria: 'Medallas', precio: 1000, existencias: 15, calificacion: 4.5, imagen: '/placeholder.svg', metal: 'Oro morado', kilataje: 19, piedras: [] },
]

const categorias = {
  "Joyería Dama": ["Todos", "Anillos", "Aretes", "Cadenas", "Gargantillas", "Dijes", "Pulseras"],
  "Joyería Caballero": ["Todos", "Anillos", "Cadenas", "Pulseras y Esclavas"],
  "Joyería Religiosa": ["Todos", "Medallas", "Cruces", "Arras", "Lazos"]
}

const metales = ["Oro morado", "Oro", "Plata"]
const kilatajes = {
  "Oro": [10, 14, 18],
  "Oro morado": [19]
}

const piedras = ["Diamante", "Rubí", "Zafiro", "Esmeralda", "Perla"]

const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star key={i + fullStars} className="w-4 h-4 text-gray-300" />
      ))}
    </div>
  )
}

export default function TiendaJoyeria() {
  const [filtroCategoria, setFiltroCategoria] = useState('Todos')
  const [filtroSubcategoria, setFiltroSubcategoria] = useState('Todos')
  const [filtroMetal, setFiltroMetal] = useState('Todos')
  const [filtroKilataje, setFiltroKilataje] = useState('Todos')
  const [filtroPiedras, setFiltroPiedras] = useState([])
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [nuevoUsuario, setNuevoUsuario] = useState('')
  const [nuevaCalificacion, setNuevaCalificacion] = useState(5)
  const [carrito, setCarrito] = useState([])
  const [mostrarCarrito, setMostrarCarrito] = useState(false)
  const [newOpacity, setNewOpacity] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setNewOpacity(prev => {
        if (prev <= 0.1) return 0.1
        if (prev >= 1) return 1
        return prev > 0.55 ? prev - 0.05 : prev + 0.05
      })
    }, 75)
    return () => clearInterval(interval)
  }, [])

  const productosFiltrados = catalogo
    .sort((a, b) => {
      if (a.isNew && !b.isNew) return -1
      if (!a.isNew && b.isNew) return 1
      return 0
    })
    .filter(producto => 
      (filtroCategoria === 'Todos' || producto.categoria === filtroCategoria) &&
      (filtroSubcategoria === 'Todos' || producto.subcategoria === filtroSubcategoria) &&
      (filtroMetal === 'Todos' || producto.metal === filtroMetal) &&
      (filtroKilataje === 'Todos' || producto.kilataje === filtroKilataje) &&
      (filtroPiedras.length === 0 || filtroPiedras.some(piedra => producto.piedras.includes(piedra)))
    )

  const handleSubmitResena = (e: React.FormEvent) => {
    e.preventDefault()
    if (nuevoComentario.trim() && nuevoUsuario.trim()) {
      console.log('Nueva reseña:', { usuario: nuevoUsuario, comentario: nuevoComentario, calificacion: nuevaCalificacion })
      setNuevoComentario('')
      setNuevoUsuario('')
      setNuevaCalificacion(5)
    }
  }

  const agregarAlCarrito = (producto) => {
    const itemExistente = carrito.find(item => item.id === producto.id)
    if (itemExistente) {
      if (itemExistente.cantidad < producto.existencias) {
        setCarrito(carrito.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        ))
        toast({
          title: "Producto actualizado",
          description: `Se ha aumentado la cantidad de ${producto.nombre} en el carrito.`,
        })
      } else {
        toast({
          title: "Límite alcanzado",
          description: `No hay más existencias disponibles de ${producto.nombre}.`,
          variant: "destructive",
        })
      }
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }])
      toast({
        title: "Producto añadido",
        description: `Se ha añadido ${producto.nombre} al carrito.`,
      })
    }
  }

  const actualizarCantidad = (id, incremento) => {
    const productoEnCarrito = carrito.find(item => item.id === id)
    const productoEnCatalogo = catalogo.find(item => item.id === id)
    
    if (productoEnCarrito) {
      const nuevaCantidad = productoEnCarrito.cantidad + incremento
      if (nuevaCantidad > 0 && nuevaCantidad <= productoEnCatalogo.existencias) {
        setCarrito(carrito.map(item =>
          item.id === id ? { ...item, cantidad: nuevaCantidad } : item
        ))
      } else if (nuevaCantidad > productoEnCatalogo.existencias) {
        toast({
          title: "Límite alcanzado",
          description: `No hay más existencias disponibles de ${productoEnCarrito.nombre}.`,
          variant: "destructive",
        })
      }
    }
  }

  const actualizarCantidadManual = (id, nuevaCantidad) => {
    const productoEnCarrito = carrito.find(item => item.id === id)
    const productoEnCatalogo = catalogo.find(item => item.id === id)
    
    if (productoEnCarrito) {
      const cantidad = Math.max(1, Math.min(nuevaCantidad, productoEnCatalogo.existencias))
      setCarrito(carrito.map(item =>
        item.id === id ? { ...item, cantidad } : item
      ))
    }
  }

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id))
    toast({
      title: "Producto eliminado",
      description: "Se ha eliminado el producto del carrito.",
    })
  }

  const comprarAhora = (producto) => {
    console.log('Compra directa:', producto)
    toast({
      title: "Compra realizada",
      description: `Has comprado ${producto.nombre}.`,
    })
  }

  const toggleFiltroPiedra = (piedra) => {
    setFiltroPiedras(prev => 
      prev.includes(piedra) 
        ? prev.filter(p => p !== piedra)
        : [...prev, piedra]
    )
  }

  const resetearFiltros = () => {
    setFiltroCategoria('Todos')
    setFiltroSubcategoria('Todos')
    setFiltroMetal('Todos')
    setFiltroKilataje('Todos')
    setFiltroPiedras([])
  }

  const totalCarrito = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0)

  const getKilatColor = (kilataje) => {
    switch(kilataje) {
      case 10: return 'bg-yellow-400'
      case 14: return 'bg-yellow-500'
      case 18: return 'bg-yellow-600'
      default: return 'bg-[#D4AF37]'
    }
  }

  return (
    <div className="container mx-auto px-4 bg-black text-[#D4AF37]">
      {/* Logo y Carrito */}
      <div className="flex justify-between items-center py-8 mb-4 sticky top-0 z-50 bg-black">
        <div className="relative w-[200px] h-[80px]">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-TdWJuFBLXCXc93Z1l7jfckGy5pgL0i.png"
            alt="Blizmar Joyas Logo"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
        <Button
          variant="outline"
          className="relative w-24 h-24 flex flex-col items-center justify-center"
          onClick={() => setMostrarCarrito(true)}
        >
          <ShoppingCart className="h-12 w-12" />
          {carrito.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black rounded-full w-8 h-8 flex items-center justify-center text-xs">
              {carrito.reduce((total, item) => total + item.cantidad, 0)}
            </span>
          )}
          <span className="text-xs mt-2 text-center">Pagar mi pedido</span>
        </Button>
      </div>

      {/* Menús desplegables de categorías */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {Object.entries(categorias).map(([categoria, subcategorias]) => (
          <DropdownMenu key={categoria}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-[#4A3C2B] text-[#D4AF37] border-[#D4AF37]">
                {categoria} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#4A3C2B] text-[#D4AF37] border-[#D4AF37]">
              {subcategorias.map((subcategoria) => (
                <DropdownMenuItem 
                  key={subcategoria}
                  onClick={() => {
                    setFiltroCategoria(categoria)
                    setFiltroSubcategoria(subcategoria)
                  }}
                  className="hover:bg-[#D4AF37] hover:text-black"
                >
                  {subcategoria}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
        <Button 
          variant="outline" 
          className="bg-[#6A1B9A] text-[#D4AF37] border-[#D4AF37] hover:bg-[#8E24AA]"
          onClick={resetearFiltros}
        >
          Todos los artículos
        </Button>
      </div>

      {/* Botones de metales y piedras */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Button
          onClick={() => {
            setFiltroMetal(filtroMetal === 'Oro morado' ? 'Todos' : 'Oro morado')
            setFiltroKilataje(filtroMetal === 'Oro morado' ?   'Todos' : 19)
          }}
          className={`${filtroMetal === 'Oro morado' ? 'bg-[#6D3266]' : 'bg-[#8E4585]'} text-white hover:bg-[#6D3266]`}
        >
          Oro morado 19K
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className={`${filtroMetal === 'Oro' ? 'bg-[#B8860B]' : 'bg-[#D4AF37]'} text-black hover:bg-[#B8860B]`}>
              Oro <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#4A3C2B] text-[#D4AF37] border-[#D4AF37]">
            {kilatajes.Oro.map((k) => (
              <DropdownMenuItem 
                key={k}
                onClick={() => {
                  if (filtroMetal === 'Oro' && filtroKilataje === k) {
                    setFiltroMetal('Todos')
                    setFiltroKilataje('Todos')
                  } else {
                    setFiltroMetal('Oro')
                    setFiltroKilataje(k)
                  }
                }}
                className={`hover:bg-[#D4AF37] hover:text-black ${getKilatColor(k)} text-white`}
              >
                {k}K
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          onClick={() => setFiltroMetal(filtroMetal === 'Plata' ? 'Todos' : 'Plata')}
          className={`${filtroMetal === 'Plata' ?   'bg-[#A0A0A0]' : 'bg-[#C0C0C0]'} text-black hover:bg-[#A0A0A0]`}
        >
          Plata
        </Button>
        
        {/* Menú desplegable para piedras */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className={`${filtroPiedras.length > 0 ? 'bg-[#5A4C3B]' : 'bg-[#4A3C2B]'} text-[#D4AF37] border-[#D4AF37]`}>
              Piedras <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#4A3C2B] text-[#D4AF37] border-[#D4AF37]">
            {piedras.map((piedra) => (
              <DropdownMenuItem 
                key={piedra}
                onClick={() => toggleFiltroPiedra(piedra)}
                className="hover:bg-[#D4AF37] hover:text-black"
              >
                <Checkbox 
                  checked={filtroPiedras.includes(piedra)}
                  onCheckedChange={() => {}}
                  className="mr-2"
                />
                {piedra}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Catálogo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {productosFiltrados.map(producto => (
          <Dialog key={producto.id}>
            <DialogTrigger asChild>
              <div className="border border-[#D4AF37] rounded-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-lg hover:shadow-[#D4AF37]/50 transition-shadow duration-300 bg-[#2A2A2A] relative">
                {producto.isNew && (
                  <div 
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold"
                    style={{ opacity: newOpacity }}
                  >
                    NEW
                  </div>
                )}
                <div className="relative aspect-square">
                  <Image
                    src={producto.imagen}
                    alt={producto.nombre}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-[#D4AF37]">{producto.nombre}</h3>
                    <p className="text-sm text-[#B8860B] font-medium mb-2">
                      {producto.subcategoria}
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-bold mt-2 text-[#D4AF37]">${producto.precio.toLocaleString('es-MX')} MXN</p>
                    <p className="text-sm text-[#B8860B] mt-1">Existencias: {producto.existencias}</p>
                    <p className="text-sm text-[#B8860B] mt-1">
                      {producto.metal} {producto.kilataje ? `${producto.kilataje}K` : ''}
                    </p>
                    <p className="text-sm text-[#B8860B] mt-1">
                      Piedras: {producto.piedras.length > 0 ? producto.piedras.join(', ') : 'Ninguna'}
                    </p>
                    <div className="mt-2 flex justify-center">
                      <RatingStars rating={producto.calificacion} />
                    </div>
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="bg-[#2A2A2A] text-[#D4AF37] border-[#D4AF37]">
              <DialogHeader>
                <DialogTitle>{producto.nombre}</DialogTitle>
                <DialogDescription className="text-[#B8860B]">
                  Categoría: {producto.categoria} - {producto.subcategoria}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <div className="relative aspect-square w-full max-w-md mx-auto">
                  <Image
                    src={producto.imagen}
                    alt={producto.nombre}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <p className="mt-4 text-2xl font-bold text-[#D4AF37]">${producto.precio.toLocaleString('es-MX')} MXN</p>
                <p className="text-[#B8860B]">Existencias: {producto.existencias}</p>
                <p className="text-[#B8860B]">
                  Metal: {producto.metal} {producto.kilataje ? `${producto.kilataje}K` : ''}
                </p>
                <p className="text-[#B8860B]">
                  Piedras: {producto.piedras.length > 0 ? producto.piedras.join(', ') : 'Ninguna'}
                </p>
                <div className="mt-2 flex items-center">
                  <span className="mr-2 text-[#B8860B]">Calificación:</span>
                  <RatingStars rating={producto.calificacion} />
                </div>
                <div className="mt-4 flex gap-4">
                  <Button className="flex-1 bg-[#D4AF37] text-black hover:bg-[#B8860B]" onClick={() => agregarAlCarrito(producto)}>
                    Añadir al carrito
                  </Button>
                  <Button className="flex-1 bg-[#4A3C2B] text-[#D4AF37] hover:bg-[#5A4C3B]" onClick={() => comprarAhora(producto)}>
                    Comprar ahora
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {/* Carrito */}
      <Dialog open={mostrarCarrito} onOpenChange={setMostrarCarrito}>
        <DialogContent className="bg-[#2A2A2A] text-[#D4AF37] border-[#D4AF37]">
          <DialogHeader>
            <DialogTitle>Carrito de Compras</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] w-full">
            {carrito.map(item => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-[#D4AF37]">
                <div>
                  <p className="font-semibold">{item.nombre}</p>
                  <p className="text-sm text-[#B8860B]">${item.precio.toLocaleString('es-MX')} MXN x {item.cantidad}</p>
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" onClick={() => actualizarCantidad(item.id, -1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={item.cantidad}
                    onChange={(e) => actualizarCantidadManual(item.id, parseInt(e.target.value))}
                    className="w-16 mx-2 bg-black text-[#D4AF37] border-[#D4AF37]"
                    min="1"
                    max={catalogo.find(p => p.id === item.id).existencias}
                  />
                  <Button variant="ghost" onClick={() => actualizarCantidad(item.id, 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" onClick={() => eliminarDelCarrito(item.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="mt-4">
            <p className="text-xl font-bold">Total: ${totalCarrito.toLocaleString('es-MX')} MXN</p>
            <Button className="w-full mt-4 bg-[#D4AF37] text-black hover:bg-[#B8860B]">
              Proceder al pago
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sección de Reseñas */}
      <div className="mt-12 bg-[#2A2A2A] p-6 rounded-lg border border-[#D4AF37]">
        <h2 className="text-2xl font-bold mb-6 text-[#D4AF37]">Deja tu Reseña</h2>

        {/* Formulario para nueva reseña */}
        <form onSubmit={handleSubmitResena} className="space-y-4">
          <Input
            type="text"
            placeholder="Tu nombre"
            value={nuevoUsuario}
            onChange={(e) => setNuevoUsuario(e.target.value)}
            required
            className="bg-black text-[#D4AF37] border-[#D4AF37]"
          />
          <Textarea
            placeholder="Escribe tu reseña aquí"
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            required
            className="bg-black text-[#D4AF37] border-[#D4AF37]"
          />
          <div className="flex items-center gap-2">
            <span className="mr-2 text-[#B8860B]">Calificación:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 cursor-pointer ${
                  star <= nuevaCalificacion ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#4A3C2B]'
                }`}
                onClick={() => setNuevaCalificacion(star)}
              />
            ))}
          </div>
          <Button type="submit" className="w-full bg-[#D4AF37] text-black hover:bg-[#B8860B]">
            Enviar Reseña
          </Button>
        </form>
      </div>
    </div>
  )
}
