// import { useParams } from "react-router-dom";
// import { products } from "@/data/products";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Truck, Shield, RefreshCw, Award } from "lucide-react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { products } from "@/data/products";

interface ProductDetailPageProps {
  product: any;
  onBack: () => void;
}

const ProductDetailPage = ( ProductDetailPageProps) => {
  // const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
   const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
    const { addToCart, updateQuantity, getCartItemQuantity } = useCart();
    const { toast } = useToast();

    const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const onBack = () => {
  navigate("/products"); // or your actual route path
};
  
  // Try to get product from location state or fetch by id
  const product = location.state?.product || products.find(p => product.id === id);
  
  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }
  
  const handleBack = () => {
    navigate("/products");
  };

  // Mock product data for demo
  const mockProduct = product || {
    name: "Premium Wireless Headphones",
    description: "Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation and 30-hour battery life.",
    price: 2999,
    originalPrice: 4999,
    rating: 4.5,
    image: "/api/placeholder/500/500",
    customizable: true,
    material: "Premium Plastic & Metal",
    dimensions: "18 x 15 x 7 cm",
    weight: "250g",
    colors: "Black, White, Blue"
  };

  // Mock multiple images for the slider (you can replace with actual product images)
  const productImages = [
    mockProduct?.image || "/api/placeholder/500/500",
    mockProduct?.image || "/api/placeholder/500/500",
    mockProduct?.image || "/api/placeholder/500/500",
    mockProduct?.image || "/api/placeholder/500/500"
  ];

  if (!mockProduct) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500">Product not found.</p>
      </div>
    );
  }

  const handleCustomizeClick = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsCustomizationOpen(true);
  };

  const handleAddToCart = (product) => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleQuantityChange = (product, newQuantity) => {
    if (newQuantity <= 0) {
      updateQuantity(product.id, 0);
      toast({
        title: "Removed from Cart",
        description: `${product.name} has been removed from your cart.`,
      });
    } else {
      updateQuantity(product.id, newQuantity);
      toast({
        title: "Cart Updated",
        description: `${product.name} quantity updated to ${newQuantity}.`,
      });
    }
  };

  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToImage = (index: number) => {
    if (isTransitioning || index === currentImageIndex) return;
    setIsTransitioning(true);
    setCurrentImageIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Products
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            {/* Main Image Slider */}
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-square relative overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out h-full"
                  style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                >
                  {productImages.map((image, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0">
                      <img
                        src={image}
                        alt={`${mockProduct.name} - Image ${index + 1}`}
                        className="w-full h-full object-fill"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Navigation Arrows */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        currentImageIndex === index
                          ? "bg-white scale-125"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
                  {currentImageIndex + 1} / {productImages.length}
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg  border-2 transition-all duration-300 transform ${
                    currentImageIndex === index
                      ? "border-blue-600 shadow-md "
                      : "border-gray-200 hover:border-gray-300 hover:scale-102"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-200"
                  />
                </button>
              ))}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {mockProduct.customizable && (
                <Badge className="bg-blue-600 text-white">Customizable</Badge>
              )}
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                In Stock
              </Badge>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-4">
            {/* Product Title & Description */}
            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {mockProduct.name}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {mockProduct.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(mockProduct.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium">
                {mockProduct.rating} (248 reviews)
              </span>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="flex items-center space-x-4">
                <span className="text-2xl lg:text-2xl font-bold text-gray-900">
                  ₹{mockProduct.price}
                </span>
                {mockProduct.originalPrice && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">
                      ₹{mockProduct.originalPrice}
                    </span>
                    <Badge variant="destructive" className="text-sm font-semibold">
                      {Math.round(
                        ((mockProduct.originalPrice - mockProduct.price) / mockProduct.originalPrice) * 100
                      )}
                      % OFF
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Inclusive of all taxes • Free shipping on orders above ₹500
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="font-semibold text-gray-900">Quantity:</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 hover:bg-gray-100"
                  >
                    -
                  </Button>
                  <span className="px-2 py-2 min-w-[40px] text-center font-semibold">
                    {quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-8 w-8 hover:bg-gray-100"
                  >
                    +
                  </Button>
                </div>
                <span className="text-sm text-gray-500">
                  Only 12 items left in stock
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4"
                onClick={(e) => {
                                e.stopPropagation();
                                if (product.customizable) {
                                  handleCustomizeClick(product, e);
                                } else {
                                  // Add directly to cart for non-customizable items
                                  handleAddToCart(product);
                                  // console.log('Add to cart:', product);
                                }
                              }}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 border-2 border-gray-300 hover:bg-gray-50"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Wishlist
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 border-2 border-gray-300 hover:bg-gray-50"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex items-center space-x-3 text-sm">
                <Truck className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Free Delivery</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <RefreshCw className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Easy Returns</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Award className="w-5 h-5 text-orange-600" />
                <span className="text-gray-700">Quality Assured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">Material:</span>
                <span className="text-gray-600">{mockProduct.material || "High-quality materials"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">Dimensions:</span>
                <span className="text-gray-600">{mockProduct.dimensions || "Standard size"}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">Weight:</span>
                <span className="text-gray-600">{mockProduct.weight || "Lightweight"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">Available Colors:</span>
                <span className="text-gray-600">{mockProduct.colors || "Multiple options"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;