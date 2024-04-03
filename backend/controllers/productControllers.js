import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";

// ---------------------aggregation-----------------------------------------------------------

// Create new Product   =>  /api/v1/products
export const getProducts = catchAsyncErrors(async (req, res) => {
  const products = await Product.aggregate([
    { $match: {ratings: {$gte: 4.5}}},
    { $group: {
      // _id: 'null',
      _id: '$name',
      avgRating: { $avg: '$ratings'},
      avgPrice: { $avg: '$price' },
      minPrice: { $min: '$price' },
      maxPrice: { $max: '$price' },
      priceTotal: { $sum: '$price'},
      productCount: { $sum: 1}
  }},
  // Accending Order
  { $sort: { minPrice: 1}},

  //Decending order
  // { $sort: { minPrice: -1}}

 { $match: {maxPrice: {$gte: 60}}},

 {
  $project: {
    avgRating: 1, 
    productCount: 1, 
    priceTotal:1
  }
}

  ]);
  
  res.status(200).json({
    count: products.length,
    products,
  });
});







// ------------------------------------------------------------------






// // Create new Product   =>  /api/v1/products
// export const getProducts = catchAsyncErrors(async (req, res) => {
//   const products = await Product.find();

//   res.status(200).json({
//     products,
//   });
// });





// Create new Product   =>  /api/v1/admin/products
export const newProduct = catchAsyncErrors(async (req, res) => {
  const product = await Product.create(req.body);

  res.status(200).json({
    product,
    
  });
});

// Get single product details   =>  /api/v1/products/:id
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    product,
  });
});

// Update product details   =>  /api/v1/products/:id
export const updateProduct = catchAsyncErrors(async (req, res) => {
  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
    new: true,
  });

  res.status(200).json({
    product,
  });
});

// Delete product   =>  /api/v1/products/:id
export const deleteProduct = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await product.deleteOne();

  res.status(200).json({
    message: "Product Deleted",
  });
});
