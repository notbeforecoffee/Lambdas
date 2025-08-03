## Remove Background Lambda Function


This function uses an api service to remove backgrounds on images, which is a paid service.  

Once the background is removed, the image is stored on S3, so that it can be re-used.  Once called, this function will check to make sure we have not already stored that image before forwarding it to have the background removed.

This service is called from the Fulhaus app, in web-frontends.