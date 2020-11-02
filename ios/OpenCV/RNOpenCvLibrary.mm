#import "RNOpenCvLibrary.h"
#import <React/RCTLog.h>

@implementation RNOpenCvLibrary

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location)
{
  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}

RCT_EXPORT_METHOD(sudokuSolvedImage:(NSString *)imageAsBase64 callback:(RCTResponseSenderBlock)callback) {
  UIImage* uiImage = [self decodeBase64ToImage:imageAsBase64];
  
  cv::Mat cvImg = [self convertUIImageToCVMat:uiImage];
  
  // Rescale
  cv::Mat rescaledBuf = [self rescale:cvImg:500];
  
  // Convert to Grayscale
  cv::cvtColor(rescaledBuf, rescaledBuf, cv::COLOR_RGBA2GRAY, 0);
  
  // Change Threshold
  cv::adaptiveThreshold(rescaledBuf, rescaledBuf, 255, cv::ADAPTIVE_THRESH_GAUSSIAN_C, cv::THRESH_BINARY, 11, 10);

  UIImage* finalUiImage = [self converCVMatToUIImage:rescaledBuf:uiImage.imageOrientation];
  
  NSString *finalImage = [self encodeToBase64String:finalUiImage];
  
  NSArray *dataArray = @[finalImage];
  callback(@[[NSNull null], dataArray]);
}

- (cv::Mat)rescale:(cv::Mat)src:(int)newWidth {
  cv::Mat dest;
  cv::Size srcSize = src.size();
  cv::Size *destSize = new cv::Size(newWidth, srcSize.height * newWidth / srcSize.width);
  cv::resize(src, dest, *destSize);
  return dest;
}

- (UIImage *)decodeBase64ToImage:(NSString *)strEncodeData {
  NSData *data = [[NSData alloc]initWithBase64EncodedString:strEncodeData options:NSDataBase64DecodingIgnoreUnknownCharacters];
  return [UIImage imageWithData:data];
}

- (NSString *)encodeToBase64String:(UIImage *)image {
 return [UIImageJPEGRepresentation(image, .5) base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
}

- (cv::Mat)convertUIImageToCVMat:(UIImage *)image {
  CGColorSpaceRef colorSpace = CGImageGetColorSpace(image.CGImage);
  
  CGFloat cols;
  CGFloat rows;
  
  if (image.imageOrientation == UIImageOrientationLeft || image.imageOrientation == UIImageOrientationRight) {
    cols = image.size.height;
    rows = image.size.width;
  } else {
    cols = image.size.width;
    rows = image.size.height;
  }
  
  cv::Mat cvMat(rows, cols, CV_8UC4); // 8 bits per component, 4 channels (color channels + alpha)
  
  CGContextRef contextRef = CGBitmapContextCreate(cvMat.data,                 // Pointer to  data
                                                  cols,                       // Width of bitmap
                                                  rows,                       // Height of bitmap
                                                  8,                          // Bits per component
                                                  cvMat.step[0],              // Bytes per row
                                                  colorSpace,                 // Colorspace
                                                  kCGImageAlphaNoneSkipLast |
                                                  kCGBitmapByteOrderDefault); // Bitmap info flags
  
  CGContextDrawImage(contextRef, CGRectMake(0, 0, cols, rows), image.CGImage);
  CGContextRelease(contextRef);
  
  return cvMat;
}

-(UIImage *)converCVMatToUIImage:(cv::Mat)cvMat:(UIImageOrientation) imageOrientation {
    NSData *data = [NSData dataWithBytes:cvMat.data length:cvMat.elemSize()*cvMat.total()];

    CGColorSpaceRef colorSpace;
    CGBitmapInfo bitmapInfo;

    if (cvMat.elemSize() == 1) {
        colorSpace = CGColorSpaceCreateDeviceGray();
        bitmapInfo = kCGImageAlphaNone | kCGBitmapByteOrderDefault;
    } else {
        colorSpace = CGColorSpaceCreateDeviceRGB();
        bitmapInfo = kCGBitmapByteOrder32Little | (
            cvMat.elemSize() == 3? kCGImageAlphaNone : kCGImageAlphaNoneSkipFirst
        );
    }

    CGDataProviderRef provider = CGDataProviderCreateWithCFData((__bridge CFDataRef)data);

    // Creating CGImage from cv::Mat
    CGImageRef imageRef = CGImageCreate(
        cvMat.cols,                 //width
        cvMat.rows,                 //height
        8,                          //bits per component
        8 * cvMat.elemSize(),       //bits per pixel
        cvMat.step[0],              //bytesPerRow
        colorSpace,                 //colorspace
        bitmapInfo,                 // bitmap info
        provider,                   //CGDataProviderRef
        NULL,                       //decode
        false,                      //should interpolate
        kCGRenderingIntentDefault   //intent
    );

    // Getting UIImage from CGImage
    UIImage *finalImage = [UIImage imageWithCGImage:imageRef
                                              scale:1
                                        orientation:imageOrientation];
    CGImageRelease(imageRef);
    CGDataProviderRelease(provider);
    CGColorSpaceRelease(colorSpace);

    return finalImage;
}


@end
