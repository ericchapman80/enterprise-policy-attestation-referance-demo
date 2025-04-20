import { Link } from 'react-router-dom';
import { Product } from '../api/products';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const displayImage = product.images.find(img => img.is_primary) || product.images[0];
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden">
          {displayImage && (
            <img 
              src={displayImage.url} 
              alt={displayImage.alt_text} 
              className="h-full w-full object-cover object-center transition-transform hover:scale-105"
            />
          )}
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-500">{product.brand}</span>
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{product.average_rating.toFixed(1)}</span>
            </div>
          </div>
          <h3 className="mb-2 font-medium">{product.name}</h3>
          <div className="flex items-center space-x-2">
            {product.sale_price ? (
              <>
                <span className="font-bold">${product.sale_price.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
                <Badge className="bg-red-500">Sale</Badge>
              </>
            ) : (
              <span className="font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
