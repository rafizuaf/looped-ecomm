import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { excludeDeleted } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/shop/product-card';

export default async function HomePage() {
  const featuredProducts = await db.product.findMany(
    excludeDeleted({
      take: 4,
      orderBy: { createdAt: 'desc' },
    })
  );

  return (
    <div className="flex flex-col">
      {/* Hero section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image
          src="https://images.pexels.com/photos/6069552/pexels-photo-6069552.jpeg"
          alt="Thrift fashion"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="relative z-20 flex h-full flex-col items-center justify-center text-center px-4 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fadeIn">
            Sustainable Style, <br /> Reimagined
          </h1>
          <p className="text-lg md:text-xl max-w-xl mb-6">
            Discover unique, pre-loved fashion that tells a story
          </p>
          <Button asChild size="lg" className="animate-fadeIn animation-delay-300">
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-20 px-4 md:px-10">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Finds</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="bg-muted py-20 px-4 md:px-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="mb-4">
                Looped was born from a passion for sustainable fashion and the belief that 
                quality clothing deserves multiple lives.
              </p>
              <p className="mb-4">
                We curate unique, pre-loved pieces that combine style, quality, and character, 
                all while reducing the environmental impact of the fashion industry.
              </p>
              <p className="mb-6">
                Every item in our collection has been carefully selected to ensure it meets 
                our standards for quality and style, giving you confidence in your purchase.
              </p>
              <Button asChild variant="outline">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/8386668/pexels-photo-8386668.jpeg"
                alt="Clothes rack"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}