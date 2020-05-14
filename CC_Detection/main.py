import os
import sys
import argparse
import cv2
from detection import detect_card_details
import cProfile

# standalone app
# The image must include credit card with no background
# The results will be saved in 'output_imgs' directory
# $ python3 main.py <image path>
if __name__ == "__main__":
    # Parse program arguments
    parser = argparse.ArgumentParser()
    parser.add_argument("image", help="add image to inference path")
    args = parser.parse_args()

    if not os.path.isfile(args.image):
        print("Input image file ", args.image, " doesn't exist")
        sys.exit(1)
    img = cv2.imread(args.image)
    card_details = detect_card_details(img, args.image)
    print("card details: ", card_details)
