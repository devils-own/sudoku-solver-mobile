//
//  RNOpenCvLibrary.h
//  sudokuSolver
//
//  Created by Hritik Aggarwal on 9/21/20.
//

#ifndef RNOpenCvLibrary_h
#define RNOpenCvLibrary_h

#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

#import <opencv2/imgproc/imgproc.hpp>

@interface RNOpenCvLibrary : NSObject <RCTBridgeModule>

@end

#endif /* RNOpenCvLibrary_h */

