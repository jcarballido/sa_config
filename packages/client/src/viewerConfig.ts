export type ProductVariant = {
  label: string
  modelUrl: string | null
  imageUrl: string | null
}

export type Product = {
  id: string
  name: string
  variants: ProductVariant[]
}

// Temporarily null while the server is disconnected (UI isolation mode).
// Restore your real endpoints here when ready to fetch again.
// Each variant is a colorway: the 3D file plus its associated render image.
export const PRODUCTS: Product[] = [
  {
    id: 'small',
    name: 'Small',
    variants: [
      { label: 'Default', modelUrl: null, imageUrl: null },
      { label: 'Colorway A', modelUrl: null, imageUrl: null },
      { label: 'Colorway B', modelUrl: null, imageUrl: null },
    ],
  },
  {
    id: 'medium',
    name: 'Medium',
    variants: [
      { label: 'Default', modelUrl: null, imageUrl: null },
      { label: 'Colorway A', modelUrl: null, imageUrl: null },
      { label: 'Colorway B', modelUrl: null, imageUrl: null },
    ],
  },
  {
    id: 'large',
    name: 'Large',
    variants: [
      { label: 'Default', modelUrl: null, imageUrl: null },
      { label: 'Colorway A', modelUrl: null, imageUrl: null },
      { label: 'Colorway B', modelUrl: null, imageUrl: null },
    ],
  },
]
