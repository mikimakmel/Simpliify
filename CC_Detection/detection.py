import cv2 as cv
import numpy as np
from preprocess import preprocess
from postprocess import postprocess


# Get the names of the output layers
def get_outputs_names(_net):
    # Get the names of all the layers in the network
    layers_names = _net.getLayerNames()
    # Get the names of the output layers, i.e. the layers with unconnected outputs
    return [layers_names[i[0] - 1] for i in _net.getUnconnectedOutLayers()]


def detection(img):
    inpWidth = 416       # Width of network's input image
    inpHeight = 416       # Height of network's input image

    # Give the configuration and weight files for the model and load the network using them.
    model_configuration = "models/darknet-yolov3.cfg"
    model_weights = "models/darknet-yolov3_best.weights"
    net = cv.dnn.readNetFromDarknet(model_configuration, model_weights)
    net.setPreferableBackend(cv.dnn.DNN_BACKEND_OPENCV)
    net.setPreferableTarget(cv.dnn.DNN_TARGET_CPU)

    # Create a 4D blob from a frame.
    blob = cv.dnn.blobFromImage(img, 1/255, (inpWidth, inpHeight), [0, 0, 0], 1, crop=False)

    # Sets the input to the network
    net.setInput(blob)

    # Runs the forward pass to get output of the output layers
    outs = net.forward(get_outputs_names(net))

    # Put efficiency information. The function getPerfProfile returns the overall time for inference(t) and the timings for each of the layers(in layersTimes)
    # t, _ = net.getPerfProfile()
    # label = 'Inference time: %.2f ms' % (t * 1000.0 / cv.getTickFrequency())
    # cv.putText(img, label, (0, 15), cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255))

    return img, outs

@profile
def detect_card_details(card_img, image_path=".jpg", prepro=False):
    # Preprocess image
    if prepro:
        card_img = preprocess(card_img)

    # Predict classes from image
    card_img, outs = detection(card_img)

    # Postprocess to extract card details
    image_name = image_path.split('/')[-1]
    _card_details = postprocess(card_img, outs, image_name)

    return _card_details
