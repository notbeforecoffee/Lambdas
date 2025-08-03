
import { v4 as uuidv4 } from 'uuid';

import { ProductModel } from "../../../models/models";
import removeImageBG from "../../../services/removeImageBG";
import uploadToS3 from "../../../services/uploadToS3";




//Remove product image background
//Required: Request Body
const removeProductImageBackground = async (req, res) =>
{
  
  const { imageURL, productID } = req.body;

  if (!imageURL) return res.status(400).json({
      success: false,
      message: 'An image URL is required',
  });

  if(imageURL.includes("moodboard-image.s3")) return res.json({ 
      success: true,
      message: 'Image background has already been removed',
      imageURL
    });
  

  try
  {
    let product;

    if (productID)
    {
      product = await ProductModel.findOne({ _id: productID }).select("imageURLs");
    
      if(!product) return res.status(400).json({
        success: false,
        message: 'Product not found',
      });
    }
      
    const removeImageBGResponse = await removeImageBG(imageURL);


    if(!removeImageBGResponse.success) return res.status(400).json(removeImageBGResponse);

    if (!removeImageBGResponse?.response?.data?.result_b64) return res.status(400).json({
      success: false,
      message: 'An error occurred while removing image background',
    });

    const uploadToS3Response = await uploadToS3({ fileName: uuidv4(), bucket: "moodboard-image", base64Data: removeImageBGResponse.response.data.result_b64 });

    if (!uploadToS3Response.success) return res.status(400).json(uploadToS3Response);

    if (product)
    {
      const productImageURLs = [];

      for (const productImageURL of product.imageURLs)
      {
        if (productImageURL === imageURL) productImageURLs.push(uploadToS3Response.url);
        if (productImageURL !== imageURL) productImageURLs.push(productImageURL);
      }

      await ProductModel.findOneAndUpdate(
        { _id: productID },
        { imageURLs: productImageURLs },
      );
    }


    return res.json({ 
      success: true,
      message: 'Image background removed successfully',
      imageURL: uploadToS3Response.url
    });
  
    
  } catch (error)
  {
    console.error(`removeProductImageBackground: ${error}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default removeProductImageBackground;
