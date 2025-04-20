import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, Product, ProductVariant } from '../api/products';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      setLoading(true);
      const productData = await getProductById(productId);
      
      if (productData) {
        setProduct(productData);
        
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
        
        const primaryImage = productData.images.find(img => img.is_primary);
        if (primaryImage) {
          setSelectedImage(primaryImage.url);
        } else if (productData.images.length > 0) {
          setSelectedImage(productData.images[0].url);
        }
      }
      
      setLoading(false);
    };
    
    fetchProduct();
  }, [productId]);

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const handleImageChange = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    console.log('Adding to cart:', {
      product,
      variant: selectedVariant,
      quantity
    });
    
    alert(`Added ${quantity} ${product?.name} (${selectedVariant.name}) to cart`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="flex space-x-2">
              <Skeleton className="h-20 w-20 rounded-md" />
              <Skeleton className="h-20 w-20 rounded-md" />
              <Skeleton className="h-20 w-20 rounded-md" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p>The product you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            {selectedImage && (
              <img 
                src={selectedImage} 
                alt={product.name} 
                className="h-full w-full object-cover object-center"
              />
            )}
          </div>
          <div className="flex space-x-2 overflow-auto">
            {product.images.map((image) => (
              <button
                key={image.id}
                className={`relative h-20 w-20 cursor-pointer rounded-md bg-gray-100 ${
                  selectedImage === image.url ? 'ring-2 ring-black' : ''
                }`}
                onClick={() => handleImageChange(image.url)}
              >
                <img
                  src={image.url}
                  alt={image.alt_text}
                  className="h-full w-full object-cover object-center"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-1 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.average_rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">
                {product.average_rating.toFixed(1)} ({product.review_count} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {product.sale_price ? (
              <>
                <span className="text-2xl font-bold">${product.sale_price.toFixed(2)}</span>
                <span className="text-lg text-gray-500 line-through">${product.price.toFixed(2)}</span>
                <Badge className="bg-red-500">Sale</Badge>
              </>
            ) : (
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-gray-600">{product.description}</p>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Brand</h3>
              <p className="mt-1">{product.brand}</p>
            </div>

            {product.variants.some(v => v.color) && (
              <div>
                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                <div className="mt-2 flex space-x-2">
                  {Array.from(new Set(product.variants.map(v => v.color).filter(Boolean))).map(
                    (color) => (
                      <button
                        key={color}
                        className={`h-8 w-8 rounded-full border ${
                          selectedVariant?.color === color
                            ? 'ring-2 ring-black'
                            : 'ring-1 ring-gray-300'
                        }`}
                        style={{ backgroundColor: color?.toLowerCase() }}
                        onClick={() => {
                          const variant = product.variants.find(v => v.color === color);
                          if (variant) handleVariantChange(variant);
                        }}
                        aria-label={`Color: ${color}`}
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {product.variants.some(v => v.size) && (
              <div>
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.from(new Set(product.variants.map(v => v.size).filter(Boolean))).map(
                    (size) => (
                      <button
                        key={size}
                        className={`rounded-md border px-3 py-1 text-sm ${
                          selectedVariant?.size === size
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          const variant = product.variants.find(v => v.size === size);
                          if (variant) handleVariantChange(variant);
                        }}
                      >
                        {size}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
              <div className="mt-2 flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={selectedVariant ? quantity >= selectedVariant.inventory_count : false}
                >
                  +
                </Button>
                {selectedVariant && (
                  <span className="text-sm text-gray-500">
                    {selectedVariant.inventory_count} available
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.inventory_count === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu
                    aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies
                    lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-sm font-medium text-gray-900">Category</h3>
                    <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-sm font-medium text-gray-900">Brand</h3>
                    <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-sm font-medium text-gray-900">SKU</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedVariant?.sku || 'N/A'}
                    </p>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      Available Colors
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {Array.from(
                        new Set(
                          product.variants
                            .map((v) => v.color)
                            .filter(Boolean)
                        )
                      ).join(', ') || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {product.reviews.length === 0 ? (
                    <p className="text-center text-gray-500">No reviews yet</p>
                  ) : (
                    product.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{review.user_name}</p>
                            <div className="mt-1 flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="mt-2 text-gray-600">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;
