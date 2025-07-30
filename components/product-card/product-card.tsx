import Image from "next/image";

interface ProductCardProps {
  image: string;
  title: string;
  price: number;
  description?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  description,
}) => {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden transition-transform hover:scale-105 duration-300">
      <Image
        src={image}
        alt={title}
        width={300}
        height={300}
        className="w-full h-64 object-contain"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-500 text-sm mb-2">
          {description || "A great product just for you!"}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-800">₹{price}</span>
          <button className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
