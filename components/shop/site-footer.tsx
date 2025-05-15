import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="bg-background border-t py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">LOOPED</h3>
            <p className="text-muted-foreground">
              Sustainable thrift fashion for conscious consumers.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=Outerwear" className="text-muted-foreground hover:text-foreground">
                  Outerwear
                </Link>
              </li>
              <li>
                <Link href="/products?category=Tops" className="text-muted-foreground hover:text-foreground">
                  Tops
                </Link>
              </li>
              <li>
                <Link href="/products?category=Bottoms" className="text-muted-foreground hover:text-foreground">
                  Bottoms
                </Link>
              </li>
              <li>
                <Link href="/products?category=Accessories" className="text-muted-foreground hover:text-foreground">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-muted-foreground hover:text-foreground">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-foreground">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Looped. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}